import React from 'react';
import { CATEGORIES as LOCAL_CATEGORIES } from '../../constants/categories';
import React, { useEffect, useState } from 'react';

const TransactionFilter = ({ filterCategory, setFilterCategory }) => {
  const [categoryOptions, setCategoryOptions] = useState(Array.isArray(LOCAL_CATEGORIES) ? LOCAL_CATEGORIES : []);

  useEffect(() => {
    (async () => {
      try {
        const { default: api } = await import('../../utils/api');
        const res = await api.get('/categories');
        if (res?.data?.categories) setCategoryOptions(res.data.categories.map(c => c.name));
      } catch (err) {
        // fallback to local categories
      }
    })();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Filter by Category</label>

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">All Categories</option>

        {categoryOptions.map((cat, index) => (
          <option
            key={index}
            value={typeof cat === 'string' ? cat : cat.value || cat.name}
          >
            {typeof cat === 'string' ? cat : cat.label || cat.name || cat.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TransactionFilter;
