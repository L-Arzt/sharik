'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

interface CategoryModalProps {
  category: Category | null;
  allCategories: Category[];
  onClose: () => void;
  onSave: () => void;
  token: string;
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

// Компонент для отображения дерева категорий
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
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
          isSelected
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : isExcluded
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-50 text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => !isExcluded && onSelect(category.id)}
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
        <span className="flex-1 font-medium">{category.name}</span>
        {isSelected && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Выбрано</span>
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

export default function CategoryModal({
  category,
  allCategories,
  onClose,
  onSave,
  token,
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
  });
  const [saving, setSaving] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Строим дерево категорий
  const categoryTree = useMemo(() => {
    return buildCategoryTree(allCategories);
  }, [allCategories]);

  // Автоматически раскрываем путь к текущей категории
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || '',
      });

      // Раскрываем путь к родительской категории
      const expandPath = (parentId: string | null) => {
        if (!parentId) return;
        setExpandedIds(prev => new Set(prev).add(parentId));
        const parent = allCategories.find(c => c.id === parentId);
        if (parent?.parentId) {
          expandPath(parent.parentId);
        }
      };
      expandPath(category.parentId);
    } else {
      setFormData({
        name: '',
        slug: '',
        parentId: '',
      });
    }
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

  const handleSave = async () => {
    setSaving(true);

    const method = category ? 'PUT' : 'POST';
    const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          parentId: formData.parentId || null,
        }),
      });
      setSaving(false);
      onSave();
    } catch {
      alert('Ошибка сохранения');
      setSaving(false);
    }
  };

  // Находим выбранную категорию для отображения
  const selectedCategory = allCategories.find(c => c.id === formData.parentId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {category ? 'Редактировать категорию' : 'Новая категория'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Форма */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Левая колонка - основные поля */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  placeholder="Введите название категории"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  placeholder="url-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Текущая иерархия */}
              {category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Текущая иерархия</label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="text-sm text-gray-600">
                      {category.parentId ? (
                        <span>
                          {allCategories.find(c => c.id === category.parentId)?.name || 'Неизвестно'} →{' '}
                          <span className="font-semibold text-gray-900">{category.name}</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-900">{category.name} (корневая)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка - дерево категорий */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите родительскую категорию
              </label>
              <div className="border border-gray-200 rounded-xl bg-gray-50 max-h-96 overflow-y-auto">
                {/* Опция "Корневая категория" */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition mb-2 ${
                    formData.parentId === ''
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'hover:bg-white text-gray-700'
                  }`}
                  onClick={() => setFormData({ ...formData, parentId: '' })}
                >
                  <span className="flex-1 font-medium">📁 Корневая категория</span>
                  {formData.parentId === '' && (
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
                      selectedId={formData.parentId}
                      excludeId={category?.id || null}
                      onSelect={(id) => setFormData({ ...formData, parentId: id })}
                      expandedIds={expandedIds}
                      onToggleExpand={toggleExpand}
                    />
                  ))}
                </div>
              </div>

              {/* Выбранная категория */}
              {selectedCategory && (
                <div className="mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-sm">
                    <span className="text-gray-600">Выбрано: </span>
                    <span className="font-semibold text-blue-700">{selectedCategory.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition font-medium"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
