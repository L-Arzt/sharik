'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Upload, Trash2, Wand2 } from 'lucide-react';
import Image from 'next/image';

type Category = { id: string; name: string; parentId?: string | null };

type ProductImage = {
  id?: string;
  relativePath: string;
  isPrimary?: boolean;
  imageOrder?: number;
};

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  price: string;
  priceNumeric: number | null;
  descriptionText: string;
  isActive: boolean;
  inStock: boolean;
  categories: { id: string }[];
  images: ProductImage[];
};

type ProductFromAPI = {
  id: string;
  name: string;
  slug?: string | null;
  price: string;
  priceNumeric?: number | null;
  descriptionText?: string;
  isActive: boolean;
  inStock: boolean;
  categories: { categoryId: string; category?: { id: string; name: string } }[];
  images: { id: string; relativePath: string; isPrimary: boolean; imageOrder: number }[];
};

function slugifyRu(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };

  return (text || '')
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parsePriceNumeric(price: string): number | null {
  const cleaned = String(price || '')
    .replace(/\s/g, '')
    .replace(/[^\d,.]/g, '')
    .replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default function ProductModal({
  product,
  onClose,
  onSave,
  token,
}: {
  product: ProductFromAPI | null;
  onClose: () => void;
  onSave: () => void;
  token: string;
}) {
  const [form, setForm] = useState<ProductForm>({
    name: '',
    slug: '',
    price: '',
    priceNumeric: null,
    descriptionText: '',
    isActive: true,
    inStock: true,
    categories: [],
    images: [],
  });

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [catSearch, setCatSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullScreenImage) {
        setFullScreenImage(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [fullScreenImage]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllCategories(data || []);
    })().catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!product) return;

    // Нормализуем то, что приходит с API (там categories: ProductCategory[])
    const normalized: ProductForm = {
      id: product.id,
      name: product.name || '',
      slug: product.slug || '',
      price: product.price || '',
      priceNumeric: product.priceNumeric ?? parsePriceNumeric(product.price || ''),
      descriptionText: product.descriptionText || '',
      isActive: !!product.isActive,
      inStock: !!product.inStock,
      categories: (product.categories || [])
  .map((pc) => pc.categoryId || pc.category?.id) 
  .filter((id): id is string => !!id)         
  .map((id) => ({ id })),     
      images: (product.images || []).map((img) => ({
        id: img.id,
        relativePath: img.relativePath,
        isPrimary: img.isPrimary,
        imageOrder: img.imageOrder,
      })),
    };

    setForm(normalized);
  }, [product]);

  const filteredCategories = useMemo(() => {
    const q = catSearch.trim().toLowerCase();
    if (!q) return allCategories;
    return allCategories.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [allCategories, catSearch]);

  const selectedCategoryIds = useMemo(
    () => new Set((form.categories || []).map((c) => c.id)),
    [form.categories]
  );

  const toggleCategory = (id: string) => {
    setForm((prev) => {
      const exists = prev.categories.some((c) => c.id === id);
      return {
        ...prev,
        categories: exists ? prev.categories.filter((c) => c.id !== id) : [...prev.categories, { id }],
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);

        const res = await fetch('/api/admin/images/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        // Используем relativePath если есть, иначе url (для обратной совместимости)
        const relativePath = data.relativePath || data.url?.replace(/^\//, '');
        if (!relativePath) continue;

        setForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              relativePath,
              isPrimary: prev.images.length === 0,
              imageOrder: prev.images.length,
            },
          ],
        }));
      }
    } catch {
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImageLocal = (idx: number) => {
    setForm((prev) => {
      const next = prev.images.filter((_, i) => i !== idx);
      // переназначаем primary/order
      const normalized = next.map((img, i) => ({ ...img, imageOrder: i, isPrimary: i === 0 }));
      return { ...prev, images: normalized };
    });
  };

  const setPrimary = (idx: number) => {
    setForm((prev) => {
      const next = prev.images.map((img, i) => ({ ...img, isPrimary: i === idx }));
      // primary вверх
      const sorted = [...next].sort((a, b) => Number(!!b.isPrimary) - Number(!!a.isPrimary));
      const normalized = sorted.map((img, i) => ({ ...img, imageOrder: i, isPrimary: i === 0 }));
      return { ...prev, images: normalized };
    });
  };

const toPublicUrl = (p?: string | null) => {
  if (!p) return '/images/pic1.jpg';
  const s = String(p).trim().replace(/\\/g, '/');

  // внешний URL
  if (s.startsWith('http://') || s.startsWith('https://')) return s;

  // уже абсолютный путь от корня сайта (например, /images/...)
  if (s.startsWith('/')) {
    // Если это не /api/images/, то возвращаем как есть
    if (s.startsWith('/api/') || s.startsWith('/images/')) return s;
    // Иначе формируем через /api/images/
  }

  // Формируем URL через API, как в каталоге
  const normalizedPath = s.replace(/\\/g, '/');
  const segments = normalizedPath.split('/').filter(seg => seg.length > 0);
  const encodedPath = segments.map(segment => encodeURIComponent(segment)).join('/');
  return `/api/images/${encodedPath}`;
};



  const validate = (): string | null => {
    if (!form.name.trim()) return 'Введите название товара';
    if (!form.price.trim()) return 'Введите цену';
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) return alert(err);

    setSaving(true);

    const method = product ? 'PUT' : 'POST';
    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';

    const payload = {
      ...form,
      priceNumeric: form.priceNumeric ?? parsePriceNumeric(form.price),
      // API ожидает categories: [{id}] и images: [{relativePath}]
      categories: form.categories,
      images: form.images.map((i) => ({ relativePath: i.relativePath })),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      onSave();
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {product ? 'Редактировать товар' : 'Новый товар'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/80 transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Введите название товара"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, slug: slugifyRu(form.name) })}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition font-medium"
                    title="Сгенерировать из названия"
                  >
                    <Wand2 className="w-3 h-3" />
                    Сгенерировать
                  </button>
                </div>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Цена</label>
                <input
                  value={form.price}
                  onChange={(e) => {
                    const price = e.target.value;
                    setForm({ ...form, price, priceNumeric: parsePriceNumeric(price) });
                  }}
                  placeholder="6500 ₽"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <div className="text-xs text-gray-500 mt-1.5">
                  Числовое значение: <span className="font-medium">{form.priceNumeric ?? '—'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  value={form.descriptionText}
                  onChange={(e) => setForm({ ...form, descriptionText: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-32 transition resize-none"
                  placeholder="Описание товара..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Активен</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">В наличии</span>
                </label>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Категории</label>
                  <span className="text-xs text-gray-500 font-medium">
                    Выбрано: {form.categories.length}
                  </span>
                </div>

                <input
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="Поиск категории..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />

                <div className="mt-2 max-h-48 overflow-auto border border-gray-200 rounded-xl bg-white">
                  {filteredCategories.map((cat) => {
                    const checked = selectedCategoryIds.has(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(cat.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">{cat.name}</span>
                        <span className="ml-auto text-xs text-gray-400">{cat.id}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Изображения</label>

                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">{uploading ? 'Загрузка...' : 'Добавить фото'}</span>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {form.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition cursor-pointer">
                        <Image
                          src={toPublicUrl(img.relativePath)}
                          alt=""
                          width={112}
                          height={112}
                          className="w-full h-28 object-cover"
                          loading="lazy"
                          onClick={() => setFullScreenImage(toPublicUrl(img.relativePath))}
                        />

                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <button
                            type="button"
                            onClick={() => setPrimary(idx)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                              img.isPrimary 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                            title="Сделать главным"
                          >
                            {img.isPrimary ? '✓ Главное' : 'Главным'}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeImageLocal(idx)}
                            className="p-1.5 rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition"
                            title="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-3">
                  Первое фото будет главным (показывается превью в каталоге/админке)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition font-medium"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
