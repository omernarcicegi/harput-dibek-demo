// Kategori yönetimi: ekleme, ad değiştirme, sıralama, silme.

import { useMemo, useState } from 'react';
import { menuActions, selectCategories } from '../stores/menuStore';
import { useMenu } from '../stores/hooks';
import { Button, Field, IconButton, TextInput } from './fields';

export function CategoriesTab() {
  const menu = useMenu();
  const categories = useMemo(() => selectCategories(menu), [menu]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  function itemCountOf(categoryId: string): number {
    return menu.items.filter((item) => item.categoryId === categoryId).length;
  }

  function handleAdd() {
    const name = newName.trim();
    if (name === '') return;
    menuActions.addCategory(name);
    setNewName('');
  }

  function handleDelete(categoryId: string, name: string) {
    const count = itemCountOf(categoryId);
    // İçi dolu kategoride ürünlerin de silineceği açıkça söylenir.
    const message =
      count > 0
        ? `"${name}" kategorisi ve içindeki ${count} ürün silinecek. Devam edilsin mi?`
        : `"${name}" kategorisi silinsin mi?`;
    if (!window.confirm(message)) return;
    menuActions.removeCategory(categoryId);
  }

  function handleSaveName(categoryId: string) {
    const name = editingName.trim();
    if (name !== '') menuActions.renameCategory(categoryId, name);
    setEditingId(null);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
        <Field label="Yeni kategori" htmlFor="new-category">
          <TextInput
            id="new-category"
            value={newName}
            placeholder="Örn. Kahvaltı"
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAdd();
            }}
          />
        </Field>
        <Button variant="primary" onClick={handleAdd} disabled={newName.trim() === ''}>
          Kategori ekle
        </Button>
      </div>

      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li
            key={category.id}
            className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-3"
          >
            <div className="min-w-0 flex-1">
              {editingId === category.id ? (
                <TextInput
                  value={editingName}
                  autoFocus
                  aria-label={`${category.name} yeni adı`}
                  onChange={(event) => setEditingName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSaveName(category.id);
                    if (event.key === 'Escape') setEditingId(null);
                  }}
                />
              ) : (
                <>
                  <p className="truncate font-semibold text-ink">{category.name}</p>
                  <p className="text-sm text-muted">{itemCountOf(category.id)} ürün</p>
                </>
              )}
            </div>

            {editingId === category.id ? (
              <>
                <Button variant="primary" onClick={() => handleSaveName(category.id)}>
                  Kaydet
                </Button>
                <Button onClick={() => setEditingId(null)}>Vazgeç</Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setEditingId(category.id);
                    setEditingName(category.name);
                  }}
                >
                  Yeniden adlandır
                </Button>
                <Button variant="danger" onClick={() => handleDelete(category.id, category.name)}>
                  Sil
                </Button>
              </>
            )}

            <div className="flex shrink-0 flex-col gap-1.5">
              <IconButton
                label={`${category.name} yukarı taşı`}
                disabled={index === 0}
                onClick={() => menuActions.moveCategory(category.id, 'up')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 12V4M4 8l4-4 4 4" />
                </svg>
              </IconButton>
              <IconButton
                label={`${category.name} aşağı taşı`}
                disabled={index === categories.length - 1}
                onClick={() => menuActions.moveCategory(category.id, 'down')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 4v8M4 8l4 4 4-4" />
                </svg>
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
