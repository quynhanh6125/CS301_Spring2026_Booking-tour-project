import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { serviceApi } from '../api/serviceApi';
import Hero from '../components/home/Hero';
import CategoryBar from '../components/home/CategoryBar';
import ServiceCard from '../components/home/ServiceCard';
import FeaturedSection from '../components/home/FeaturedSection';
import { SkeletonGrid } from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { Search } from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    serviceApi.getAllServices()
      .then((res) => setServices(res.data))
      .catch((err) => console.error('Lỗi tải dịch vụ:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  return (
    <>
      <Hero />
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Trust badges */}
      <FeaturedSection />

      {/* Services grid */}
      <section className="bg-custom-bg py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-text-primary">
                {selectedCategory ? `Dịch vụ ${selectedCategory.toLowerCase()}` : 'Hoạt động nổi bật'}
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Khám phá các dịch vụ được yêu thích nhất
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">
              {filtered.length} kết quả
            </span>
          </div>

          {isLoading ? (
            <SkeletonGrid count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Không tìm thấy dịch vụ"
              description="Hãy thử chọn danh mục khác hoặc quay lại xem tất cả."
              action={() => setSelectedCategory(null)}
              actionLabel="Xem tất cả"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;