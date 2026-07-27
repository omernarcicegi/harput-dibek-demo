// Bagimliliksiz Chrome DevTools Protocol istemcisi (Node 24 global WebSocket).
// Gercek 375px mobil emulasyonu, kaydirma ve ekran goruntusu icin.

import { writeFileSync } from 'node:fs';

const DEBUG_PORT = 9222;

async function getPageTarget() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      /* Chrome henuz hazir degil */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Chrome hedefi bulunamadi');
}

export async function connect() {
  const target = await getPageTarget();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let nextId = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  return { send, close: () => ws.close() };
}

/** Sayfayi 375x812 mobil olarak acar. */
export async function openMobile(send, url, { width = 375, height = 812, dpr = 2 } = {}) {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: dpr,
    mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2500));
}

export async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? 'JS hatasi');
  }
  return result.result.value;
}

export async function screenshot(send, path) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(path, Buffer.from(data, 'base64'));
  return path;
}

/** Snap ve yumusak kaydirmayi kapatip belirtilen konuma atlar. */
export async function scrollTo(send, y) {
  await evaluate(
    send,
    `(() => {
      const de = document.documentElement;
      de.style.scrollBehavior = 'auto';
      de.style.scrollSnapType = 'none';
      window.scrollTo(0, ${y});
      return window.scrollY;
    })()`,
  );
  await new Promise((r) => setTimeout(r, 900));
  return evaluate(send, 'window.scrollY');
}
