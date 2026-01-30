'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
}

export default function FilterSidebar({ categories, brands }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(type, value);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilter = (type: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(type);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const currentCategory = searchParams.get('category');
  const currentBrand = searchParams.get('brand');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => cat === currentCategory ? clearFilter('category') : applyFilter('category', cat)}
              className={`block w-full text-left px-3 py-2 rounded ${
                cat === currentCategory 
                  ? 'bg-black text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.slice(0, 10).map((brand) => (
            <button
              key={brand}
              onClick={() => brand === currentBrand ? clearFilter('brand') : applyFilter('brand', brand)}
              className={`block w-full text-left px-3 py-2 rounded ${
                brand === currentBrand 
                  ? 'bg-black text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
