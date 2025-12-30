'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Move, X, Package } from 'lucide-react';
import CategoryModal from './CategoryModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
  _count: { products: number };
}

// Функция для построения дерева категорий
function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // Создаем карту всех категорий
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Строим дерево
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(category);
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}

// Модальное окно для перемещения товаров из категории
function MoveProductsModal({
  category,
  allCategories,
  onClose,
  onMove,
}: {
  category: Category;
  allCategories: Category[];
  onClose: () => void;
  onMove: (targetCategoryId: string | null) => void;
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const categoryTree = useMemo(() => {
    return buildCategoryTree(allCategories);
  }, [allCategories]);

  useEffect(() => {
    // Раскрываем все категории для удобства выбора
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

  const handleMove = () => {
    if (!selectedCategoryId) {
      alert('Выберите целевую категорию');
      return;
    }
    onMove(selectedCategoryId);
  };

  const selectedCategory = allCategories.find(c => c.id === selectedCategoryId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Переместить товары
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Из категории: <span className="font-semibold">{category.name}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Товаров в категории: <span className="font-semibold">{category._count.products}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите целевую категорию для перемещения товаров
            </label>
            <div className="border border-gray-200 rounded-xl bg-gray-50 max-h-96 overflow-y-auto">
              {/* Дерево категорий */}
              <div className="space-y-1 p-2">
                {categoryTree.map((cat) => (
                  <CategoryTreeItem
                    key={cat.id}
                    category={cat}
                    level={0}
                    selectedId={selectedCategoryId}
                    excludeId={category.id}
                    onSelect={(id) => setSelectedCategoryId(id)}
                    expandedIds={expandedIds}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Информация о перемещении */}
          {selectedCategory && (
            <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="text-sm">
                <div className="text-green-700 font-semibold mb-1">Будет перемещено:</div>
                <div className="text-green-900">
                  Все товары из категории <span className="font-bold">&ldquo;{category.name}&rdquo;</span> будут перемещены в категорию <span className="font-bold">&ldquo;{selectedCategory.name}&rdquo;</span>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  Всего товаров: {category._count.products}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleMove}
            disabled={!selectedCategoryId}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Переместить товары
          </button>
        </div>
      </div>
    </div>
  );
}

// Модальное окно для перемещения категории
function MoveCategoryModal({
  category,
  allCategories,
  onClose,
  onMove,
}: {
  category: Category;
  allCategories: Category[];
  onClose: () => void;
  onMove: (newParentId: string | null) => void;
}) {
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const categoryTree = useMemo(() => {
    return buildCategoryTree(allCategories);
  }, [allCategories]);

  // Раскрываем путь к текущей родительской категории
  useEffect(() => {
    const expandPath = (parentId: string | null) => {
      if (!parentId) return;
      setExpandedIds(prev => new Set(prev).add(parentId));
      const parent = allCategories.find(c => c.id === parentId);
      if (parent?.parentId) {
        expandPath(parent.parentId);
      }
    };
    expandPath(category.parentId);
    setSelectedParentId(category.parentId || '');
  }, [category, allCategories]);

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

  const handleMove = () => {
    onMove(selectedParentId || null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Переместить категорию
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {category.name}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите новую родительскую категорию
            </label>
            <div className="border border-gray-200 rounded-xl bg-gray-50 max-h-96 overflow-y-auto">
              {/* Опция "Корневая категория" */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition mb-2 ${
                  selectedParentId === ''
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'hover:bg-white text-gray-700'
                }`}
                onClick={() => setSelectedParentId('')}
              >
                <span className="flex-1 font-medium">📁 Корневая категория</span>
                {selectedParentId === '' && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Выбрано</span>
                )}
              </div>

              {/* Дерево категорий */}
              <div className="space-y-1 p-2">
                {categoryTree.map((cat) => (
                  <CategoryTreeItem
                    key={cat.id}
                    category={cat}
                    level={0}
                    selectedId={selectedParentId}
                    excludeId={category.id}
                    onSelect={(id) => setSelectedParentId(id)}
                    expandedIds={expandedIds}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Текущая и новая позиция */}
          <div className="space-y-2 mt-4">
            <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="text-xs text-gray-600 mb-1">Текущая позиция:</div>
              <div className="text-sm font-medium text-gray-900">
                {category.parentId ? (
                  <>
                    {allCategories.find(c => c.id === category.parentId)?.name || 'Неизвестно'} →{' '}
                    <span className="text-purple-600">{category.name}</span>
                  </>
                ) : (
                  <span className="text-purple-600">{category.name} (корневая)</span>
                )}
              </div>
            </div>
            {selectedParentId !== (category.parentId || '') && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-xs text-blue-600 mb-1">Новая позиция:</div>
                <div className="text-sm font-medium text-blue-900">
                  {selectedParentId ? (
                    <>
                      {allCategories.find(c => c.id === selectedParentId)?.name || 'Неизвестно'} →{' '}
                      <span className="text-purple-600">{category.name}</span>
                    </>
                  ) : (
                    <span className="text-purple-600">{category.name} (корневая)</span>
                  )}
                </div>
              </div>
            )}
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
            onClick={handleMove}
            disabled={selectedParentId === (category.parentId || '')}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Переместить
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент для отображения дерева категорий в модальном окне перемещения
function CategoryTreeItem({
  category,
  level,
  selectedId,
  excludeId,
  onSelect,
  expandedIds,
  onToggleExpand,
}: {
  category: Category;
  level: number;
  selectedId: string;
  excludeId: string | null;
  onSelect: (id: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedId === category.id;
  const isExcluded = excludeId === category.id;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
          isSelected
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
            : isExcluded
            ? 'opacity-50 cursor-not-allowed bg-gray-100'
            : 'hover:bg-white hover:shadow-sm cursor-pointer text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => !isExcluded && onSelect(category.id)}
        title={isExcluded ? 'Нельзя выбрать эту категорию' : `Выбрать "${category.name}" как родительскую`}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.id);
            }}
            className={`p-0.5 rounded transition ${
              isSelected ? 'hover:bg-white/20' : 'hover:bg-gray-100'
            }`}
            title={isExpanded ? 'Свернуть' : 'Развернуть'}
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
        <span className="flex-1 font-medium">
          {level > 0 && <span className="text-xs opacity-60 mr-1">└─</span>}
          {category.name}
        </span>
        {isSelected && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-semibold">Выбрано</span>
        )}
        {isExcluded && (
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-500">Текущая</span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              excludeId={excludeId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент для отображения категории в дереве
function CategoryTreeCard({
  category,
  level,
  onEdit,
  onDelete,
  onMove,
  onMoveProducts,
  expandedIds,
  onToggleExpand,
}: {
  category: Category;
  level: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  onMove: (cat: Category) => void;
  onMoveProducts: (cat: Category) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);

  return (
    <div>
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all p-4 mb-3"
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            {hasChildren ? (
              <button
                onClick={() => onToggleExpand(category.id)}
                className="p-1 hover:bg-gray-100 rounded-lg transition mt-0.5"
              >
                {isExpanded ? (
                  <ChevronDown size={18} className="text-gray-600" />
                ) : (
                  <ChevronRight size={18} className="text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-7" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <span className="text-xs font-semibold text-blue-700">
                  {category._count.products} {category._count.products === 1 ? 'товар' : 'товаров'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4 flex-wrap">
            <button
              onClick={() => onEdit(category)}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              title="Редактировать"
            >
              <Edit2 size={18} />
            </button>
            {category._count.products > 0 && (
              <button
                onClick={() => onMoveProducts(category)}
                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                title={`Переместить все товары (${category._count.products}) в другую категорию`}
              >
                <Package size={18} />
              </button>
            )}
            <button
              onClick={() => onMove(category)}
              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
              title="Переместить категорию"
            >
              <Move size={18} />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              title="Удалить"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeCard
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onMoveProducts={onMoveProducts}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [token, setToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [moveCategory, setMoveCategory] = useState<Category | null>(null);
  const [moveProductsCategory, setMoveProductsCategory] = useState<Category | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Строим дерево категорий
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch {
      alert('Ошибка загрузки категорий');
    }
  }, [token]);

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t || '');
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchCategories();
  }, [token, fetchCategories]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch {
      alert('Ошибка удаления');
    }
  };

  const handleMove = async (categoryId: string, newParentId: string | null) => {
    try {
      await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: moveCategory?.name || '',
          slug: moveCategory?.slug || '',
          parentId: newParentId,
        }),
      });
      setMoveCategory(null);
      fetchCategories();
    } catch {
      alert('Ошибка перемещения категории');
    }
  };

  const handleMoveProducts = async (sourceCategoryId: string, targetCategoryId: string | null) => {
    if (!targetCategoryId) {
      alert('Выберите целевую категорию');
      return;
    }

    if (!confirm(`Переместить все товары из категории "${moveProductsCategory?.name}" в выбранную категорию?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${sourceCategoryId}/move-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetCategoryId }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Ошибка перемещения товаров');
        return;
      }

      alert(`Успешно перемещено товаров: ${data.moved} из ${data.total}`);
      setMoveProductsCategory(null);
      fetchCategories();
    } catch {
      alert('Ошибка перемещения товаров');
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Категории
          </h1>
          <p className="text-gray-600 mt-1">
            Всего категорий: {categories.length}
          </p>
        </div>
        <button
          onClick={() => {
            setEditCategory(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
        >
          <Plus size={20} /> Новая категория
        </button>
      </div>

      {/* Список категорий */}
      {categories.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">📂</span>
            <h3 className="text-xl font-semibold text-gray-700">Нет категорий</h3>
            <p className="text-gray-500">Создайте первую категорию для организации товаров</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryTree.map((cat) => (
            <CategoryTreeCard
              key={cat.id}
              category={cat}
              level={0}
              onEdit={(cat) => {
                setEditCategory(cat);
                setShowModal(true);
              }}
              onMove={(cat) => {
                setMoveCategory(cat);
              }}
              onMoveProducts={(cat) => {
                setMoveProductsCategory(cat);
              }}
              onDelete={handleDelete}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CategoryModal
          category={editCategory}
          allCategories={categories}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchCategories();
          }}
          token={token}
        />
      )}

      {/* Модальное окно для перемещения категории */}
      {moveCategory && (
        <MoveCategoryModal
          category={moveCategory}
          allCategories={categories}
          onClose={() => setMoveCategory(null)}
          onMove={(newParentId) => {
            handleMove(moveCategory.id, newParentId);
          }}
        />
      )}

      {/* Модальное окно для перемещения товаров */}
      {moveProductsCategory && (
        <MoveProductsModal
          category={moveProductsCategory}
          allCategories={categories}
          onClose={() => setMoveProductsCategory(null)}
          onMove={(targetCategoryId) => {
            handleMoveProducts(moveProductsCategory.id, targetCategoryId);
          }}
        />
      )}
    </div>
  );
}
