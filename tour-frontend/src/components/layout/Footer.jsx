import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-black text-white">
                TAMANH<span className="text-primary">TRAVEL</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Nền tảng đặt tour và trải nghiệm du lịch hàng đầu tại Việt Nam.
              Khám phá hàng ngàn hoạt động thú vị với giá ưu đãi.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <ExternalLink size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Heart size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                <Play size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-2.5">
              {['Tour du lịch', 'Khách sạn', 'Di chuyển', 'Ẩm thực', 'Chụp ảnh', 'Giải trí'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {['Trung tâm trợ giúp', 'Chính sách hoàn tiền', 'Điều khoản sử dụng', 'Chính sách bảo mật', 'Trở thành đối tác'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">Hạ Long, Quảng Ninh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">0123 456 789</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm text-gray-400">hello@tamanhtravel.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © 2026 Tâm Anh Travel. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Điều khoản</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Bảo mật</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
