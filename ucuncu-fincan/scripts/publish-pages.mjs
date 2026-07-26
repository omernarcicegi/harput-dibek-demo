// dist/ klasorunu gh-pages dalina gonderir.
// GitHub Pages "deploy from branch" modunda bu dali sunar.
//
// Neden Actions degil: mevcut GitHub token'inda `workflow` yetkisi yok,
// bu yuzden .github/workflows gonderilemiyor. Yetkiyi acmak istersen
// docs/OTOMATIK-YAYIN.md dosyasina bak.

import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve('dist');
const BRANCH = 'gh-pages';
const WORKTREE = resolve('.gh-pages-worktree');

if (!existsSync(DIST)) {
  console.error('dist/ yok — once "npm run build:pages" calistir.');
  process.exit(1);
}

const git = (...args) =>
  execFileSync('git', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const gitLoud = (...args) => execFileSync('git', args, { stdio: 'inherit' });

// Onceki worktree kalintisini temizle
try { git('worktree', 'remove', '--force', WORKTREE); } catch { /* yoktu */ }
if (existsSync(WORKTREE)) rmSync(WORKTREE, { recursive: true, force: true });

// gh-pages dali yoksa bos olarak olustur
let branchExists = true;
try { git('rev-parse', '--verify', BRANCH); } catch { branchExists = false; }
if (!branchExists) {
  try { git('fetch', 'origin', `${BRANCH}:${BRANCH}`); } catch { branchExists = false; }
}

if (branchExists) {
  gitLoud('worktree', 'add', WORKTREE, BRANCH);
} else {
  gitLoud('worktree', 'add', '--detach', WORKTREE);
  execFileSync('git', ['checkout', '--orphan', BRANCH], { cwd: WORKTREE, stdio: 'inherit' });
}

// Icerigi tazele
execFileSync('git', ['rm', '-rf', '--ignore-unmatch', '.'], { cwd: WORKTREE, stdio: 'ignore' });
execFileSync('cp', ['-R', `${DIST}/.`, WORKTREE], { stdio: 'inherit' });
// Jekyll'in _ ile baslayan dosyalari yutmasini engelle
execFileSync('touch', [resolve(WORKTREE, '.nojekyll')]);

execFileSync('git', ['add', '-A'], { cwd: WORKTREE, stdio: 'inherit' });
const status = execFileSync('git', ['status', '--porcelain'], { cwd: WORKTREE }).toString().trim();
if (status) {
  execFileSync('git', ['commit', '-m', `Yayin: ${new Date().toISOString()}`], {
    cwd: WORKTREE, stdio: 'inherit',
  });
  execFileSync('git', ['push', '-u', 'origin', BRANCH], { cwd: WORKTREE, stdio: 'inherit' });
  console.log('\n✓ gh-pages dalina gonderildi');
} else {
  console.log('\n• Degisiklik yok, gonderilmedi');
}

git('worktree', 'remove', '--force', WORKTREE);
