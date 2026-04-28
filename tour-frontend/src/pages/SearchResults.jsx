import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { serviceApi } from '../api/serviceApi';
import ServiceCard from '../components/home/ServiceCard';
import { SkeletonGrid } from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const CATEGORIES = [
  { key: 'TOUR', label: 'Tour' },
  { key: 'HOTEL', label: 'Khách sạn' },
  { key: 'TRANSPORT', label: 'Di chuyển' },
  { key: 'PHOTOGRAPHY', label: 'Chụp ảnh' },
  { key: 'FOOD', label: 'Ẩm thực' },
  { key: 'ENTERTAINMENT', label: 'Giải trí' },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;
    setIsLoading(true);
    serviceApi.searchServices(query)
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [query]);

  const filtered = filterCategory
    ? results.filter((s) => s.category === filterCategory)
    : results;

  return (
    <div className="min-h-screen bg-custom-bg">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-primary font-medium">Tìm kiếm: "{query}"</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={18} className="text-primary" />
                <h3 className="font-bold text-text-primary">Bộ lọc</h3>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-3">Danh mục</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilterCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !filterCategory ? 'bg-primary-50 text-primary font-semibold' : 'text-text-secondary hover:bg-gray-50'
                    }`}
                  >
                    Tất cả ({results.length})
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = results.filter((s) => s.category === cat.key).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setFilterCategory(cat.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filterCategory === cat.key
                            ? 'bg-primary-50 text-primary font-semibold'
                            : 'text-text-secondary hover:bg-gray-50'
                        }`}
                      >
                        {cat.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-text-primary">
                Kết quả cho "{query}"
                <span className="text-text-secondary font-normal text-base ml-2">
                  ({filtered.length} dịch vụ)
                </span>
              </h1>
            </div>

            {isLoading ? (
              <SkeletonGrid count={6} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Không tìm thấy kết quả"
                description={`Không có dịch vụ nào phù hợp với "${query}". Thử tìm kiếm với từ khóa khác.`}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
