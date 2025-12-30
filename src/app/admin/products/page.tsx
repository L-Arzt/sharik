'use client';

import { useEffect, useMemo, useState } from 'react';
import { Package, X, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import ProductModal from './ProductModal';

type ProductRow = {
  id: string;
  name: string;
  slug?: string | null;
  price: string;
  isActive: boolean;
  inStock: boolean;
  images: { id: string; relativePath?: string | null; isPrimary: boolean; imageOrder: number }[];
  categories: { id: string; categoryId: string; category?: { id: string; name: string; slug: string } }[];
};

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: CategoryWithChildren[];
}

type CategoryWithChildren = Category & { children: CategoryWithChildren[] };

export default function AdminProductsPage() {
  const [token, setToken] = useState<string | null>(null);

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const take = 20;

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  
  // Массовое управление категориями
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkCategoriesModalOpen, setBulkCategoriesModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'add' | 'remove' | 'replace'>('add');
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('adminToken');
    setToken(stored);
  }, []);

  const skip = useMemo(() => (page - 1) * take, [page]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('skip', String(skip));
      qs.set('take', String(take));
      if (search.trim()) qs.set('search', search.trim());

      const res = await fetch(`/api/admin/products?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('load failed');

      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      load().catch(() => {});
      loadCategories().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

  const loadCategories = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllCategories(data || []);
    } catch {
      console.error('Failed to load categories');
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const toggleAllProducts = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / take));

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: ProductRow) => {
    setEditing(p);
    setModalOpen(true);
  };

  const remove = async (id: string) => {
    if (!token) return;
    if (!confirm('Удалить товар?')) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert('Ошибка удаления');
      return;
    }

    await load();
  };

  const getPreview = (p: ProductRow): string => {
    const primary = p.images?.find((i) => i.isPrimary)?.relativePath;
    const relativePath = primary || p.images?.[0]?.relativePath;
    
    if (!relativePath) return '/images/pic1.jpg';
    
    // Формируем URL через API, как в каталоге
    const normalizedPath = relativePath.replace(/\\/g, '/');
    const segments = normalizedPath.split('/').filter(seg => seg.length > 0);
    const encodedPath = segments.map(segment => encodeURIComponent(segment)).join('/');
    return `/api/images/${encodedPath}`;
  };

  if (!token) return null;

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Товары
          </h1>
          <p className="text-gray-600 mt-1">
            Показано {products.length} из {total}
            {selectedProducts.size > 0 && (
              <span className="ml-2 text-blue-600 font-semibold">
                • Выбрано: {selectedProducts.size}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-xs">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  load().catch(() => {});
                }
              }}
              placeholder="Поиск по названию..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
            />
          </div>
          <button
            onClick={() => {
              setPage(1);
              load().catch(() => {});
            }}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium"
          >
            Найти
          </button>
          {selectedProducts.size > 0 && (
            <button
              onClick={() => {
                setBulkAction('add');
                setBulkCategoriesModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <Package size={18} className="inline mr-2" />
              Управление категориями ({selectedProducts.size})
            </button>
          )}
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            + Новый товар
          </button>
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700 w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === products.length && products.length > 0}
                    onChange={toggleAllProducts}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Название</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Цена</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Категории</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Фото</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Статус</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Действия</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-500" colSpan={7}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Загрузка...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-500" colSpan={7}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📦</span>
                      <span className="font-medium">Товары не найдены</span>
                      <span className="text-sm">Попробуйте изменить параметры поиска</span>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const preview = getPreview(p);
                  const isSelected = selectedProducts.has(p.id);
                  return (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-blue-50/50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProductSelection(p.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{p.slug || p.id}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{p.price}</span>
                      </td>

                      <td className="px-6 py-4">
                        {p.categories?.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {p.categories.map((pc) => (
                              <span
                                key={pc.id}
                                className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 font-medium"
                                title={pc.category?.slug || ''}
                              >
                                {pc.category?.name || pc.categoryId}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {preview ? (
                          <div className="flex items-center gap-3">
                            <Image
                              src={preview}
                              alt={p.name}
                              width={56}
                              height={56}
                              className="w-14 h-14 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                              loading="lazy"
                            />
                            <span className="text-sm text-gray-600 font-medium">{p.images?.length || 0} шт.</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Нет</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block w-fit ${
                            p.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {p.isActive ? '✓ Активен' : '✗ Отключен'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full inline-block w-fit ${
                            p.inStock 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {p.inStock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => remove(p.id)}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            ← Назад
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Страница
            </span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  // Разрешаем пустое значение для редактирования
                  return;
                }
                const newPage = parseInt(value, 10);
                if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                  setPage(newPage);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                const newPage = parseInt(value, 10);
                if (isNaN(newPage) || newPage < 1 || newPage > totalPages) {
                  // Восстанавливаем текущее значение если некорректное
                  e.target.value = String(page);
                } else if (newPage !== page) {
                  setPage(newPage);
                  load().catch(() => {});
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur(); // Вызовет onBlur
                }
              }}
              className="w-16 px-3 py-2 text-center bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-semibold text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              из {totalPages}
            </span>
          </div>
          
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Вперёд →
          </button>
        </div>
      )}

      {modalOpen && token && (
        <ProductModal
          product={editing ? {
            id: editing.id,
            name: editing.name,
            slug: editing.slug,
            price: editing.price,
            priceNumeric: null,
            descriptionText: undefined,
            isActive: editing.isActive,
            inStock: editing.inStock,
            categories: editing.categories.map(pc => ({ categoryId: pc.categoryId, category: pc.category })),
            images: editing.images.map(img => ({
              id: img.id,
              relativePath: img.relativePath || '',
              isPrimary: img.isPrimary,
              imageOrder: img.imageOrder
            }))
          } : null}
          token={token}
          onClose={() => setModalOpen(false)}
          onSave={async () => {
            setModalOpen(false);
            await load();
          }}
        />
      )}

      {/* Модальное окно массового управления категориями */}
      {bulkCategoriesModalOpen && token && (
        <BulkCategoriesModal
          selectedCount={selectedProducts.size}
          allCategories={allCategories}
          action={bulkAction}
          onActionChange={setBulkAction}
          onClose={() => {
            setBulkCategoriesModalOpen(false);
            setSelectedProducts(new Set());
          }}
          onSave={async (categoryIds) => {
            if (!token) return;
            try {
              const res = await fetch('/api/admin/products/bulk-update-categories', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  productIds: Array.from(selectedProducts),
                  categoryIds,
                  action: bulkAction,
                }),
              });

              const data = await res.json();
              if (!res.ok) {
                alert(data.error || 'Ошибка обновления категорий');
                return;
              }

              alert(`Успешно обновлено товаров: ${data.updated} из ${data.total}`);
              setBulkCategoriesModalOpen(false);
              setSelectedProducts(new Set());
              await load();
            } catch {
              alert('Ошибка обновления категорий');
            }
          }}
        />
      )}
    </div>
  );
}

// Модальное окно для массового управления категориями
function BulkCategoriesModal({
  selectedCount,
  allCategories,
  action,
  onActionChange,
  onClose,
  onSave,
}: {
  selectedCount: number;
  allCategories: Category[];
  action: 'add' | 'remove' | 'replace';
  onActionChange: (action: 'add' | 'remove' | 'replace') => void;
  onClose: () => void;
  onSave: (categoryIds: string[]) => void;
}) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Строим дерево категорий
  const categoryTree = useMemo(() => {
    const buildCategoryTree = (categories: Category[]): CategoryWithChildren[] => {
      const categoryMap = new Map<string, CategoryWithChildren>();
      const rootCategories: CategoryWithChildren[] = [];

      categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      categories.forEach(cat => {
        const category = categoryMap.get(cat.id)!;
        if (cat.parentId && categoryMap.has(cat.parentId)) {
          const parent = categoryMap.get(cat.parentId)!;
          parent.children.push(category);
        } else {
          rootCategories.push(category);
        }
      });

      return rootCategories;
    };

    return buildCategoryTree(allCategories);
  }, [allCategories]);

  // Фильтруем категории по поиску
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return categoryTree;

    const query = searchQuery.toLowerCase();
    const filterCategories = (cats: CategoryWithChildren[]): CategoryWithChildren[] => {
      return cats
        .filter(cat =>
          cat.name.toLowerCase().includes(query) ||
          cat.slug.toLowerCase().includes(query) ||
          filterCategories(cat.children).length > 0
        )
        .map(cat => ({
          ...cat,
          children: filterCategories(cat.children),
        }));
    };
    return filterCategories(categoryTree);
  }, [categoryTree, searchQuery]);

  useEffect(() => {
    // Раскрываем все категории для удобства
    const allIds = new Set(allCategories.map(c => c.id));
    setExpandedIds(allIds);
  }, [allCategories]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    if (selectedCategoryIds.size === 0) {
      alert('Выберите хотя бы одну категорию');
      return;
    }
    onSave(Array.from(selectedCategoryIds));
  };

  const actionLabels = {
    add: 'Добавить категории',
    remove: 'Удалить категории',
    replace: 'Заменить все категории',
  };

  const actionDescriptions = {
    add: 'Выбранные категории будут добавлены к существующим категориям товаров',
    remove: 'Выбранные категории будут удалены из товаров',
    replace: 'Все существующие категории будут заменены на выбранные',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Массовое управление категориями
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Выбрано товаров: <span className="font-semibold">{selectedCount}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Выбор действия */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Действие</label>
            <div className="grid grid-cols-3 gap-2">
              {(['add', 'remove', 'replace'] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => onActionChange(act)}
                  className={`px-4 py-3 rounded-xl border-2 transition font-medium ${
                    action === act
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {actionLabels[act]}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{actionDescriptions[action]}</p>
          </div>

          {/* Поиск категорий */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск категорий</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Дерево категорий */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите категории ({selectedCategoryIds.size} выбрано)
            </label>
            <div className="border border-gray-200 rounded-xl bg-gray-50 max-h-96 overflow-y-auto">
              <div className="space-y-1 p-2">
                {filteredTree.map((cat) => (
                  <BulkCategoryTreeItem
                    key={cat.id}
                    category={cat}
                    level={0}
                    selectedIds={selectedCategoryIds}
                    onToggle={toggleCategory}
                    expandedIds={expandedIds}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={selectedCategoryIds.size === 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Применить к {selectedCount} товарам
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент для отображения категории в дереве (для массового управления)
function BulkCategoryTreeItem({
  category,
  level,
  selectedIds,
  onToggle,
  expandedIds,
  onToggleExpand,
}: {
  category: CategoryWithChildren;
  level: number;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  const hasChildren = category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedIds.has(category.id);

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition cursor-pointer ${
          isSelected
            ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
            : 'hover:bg-white text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onToggle(category.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.id);
            }}
            className="p-0.5 hover:bg-white/20 rounded"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(category.id)}
          className="w-4 h-4 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
        <span className="flex-1 font-medium">{category.name}</span>
        {isSelected && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Выбрано</span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child) => (
            <BulkCategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedIds={selectedIds}
              onToggle={onToggle}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
