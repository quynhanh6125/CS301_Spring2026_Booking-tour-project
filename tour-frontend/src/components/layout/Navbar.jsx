import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Globe, Menu, X, LayoutDashboard, LogOut, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[var(--shadow-navbar)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-2xl font-black tracking-tighter">
                TAMANH<span className="text-gray-800">TRAVEL</span>
              </span>
            </Link>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Tìm kiếm tour, hoạt động..."
                />
              </div>
            </form>

            {/* Right menu */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-primary transition-colors p-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Auth */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="w-7 h-7 gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user?.username?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-text-primary hidden sm:block max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/30">
                            <p className="text-sm font-bold text-text-primary truncate">{user?.username}</p>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{user?.role}</p>
                          </div>

                          <div className="p-1">
                            {/* Link Dashboard: Chỉ hiện cho PROVIDER */}
                            {user?.role === 'PROVIDER' && (
                              <Link
                                to="/provider/dashboard"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                              >
                                <LayoutDashboard size={18} className="text-primary" />
                                Bảng điều khiển
                              </Link>
                            )}

                            {/* CẬP NHẬT: Hiện cho cả CUSTOMER và PROVIDER */}
                            <Link
                              to="/my-bookings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                            >
                              <ClipboardList size={18} className="text-primary" />
                              Đơn hàng của tôi
                            </Link>

                            <div className="border-t border-gray-50 mt-1 pt-1">
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold"
                              >
                                <LogOut size={18} />
                                Đăng xuất
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-gray-700 hover:text-primary text-sm font-semibold px-3 py-1.5 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="gradient-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 shadow-sm transition-all"
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 text-gray-600"
              >
                {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Tìm kiếm..."
                    />
                  </div>
                </form>

                {isLoggedIn && (
                  <div className="space-y-1 py-2">
                     {user?.role === 'PROVIDER' && (
                        <Link to="/provider/dashboard" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700">
                          <LayoutDashboard size={18} /> Bảng điều khiển
                        </Link>
                     )}
                     <Link to="/my-bookings" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700">
                        <ClipboardList size={18} /> Đơn hàng của tôi
                     </Link>
                     <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-600">
                        <LogOut size={18} /> Đăng xuất
                     </button>
                  </div>
                )}

                {!isLoggedIn && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowLogin(true); setShowMobileMenu(false); }}
                      className="flex-1 py-2.5 text-sm font-semibold text-primary border border-primary rounded-xl"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => { setShowRegister(true); setShowMobileMenu(false); }}
                      className="flex-1 py-2.5 text-sm font-bold text-white gradient-primary rounded-xl"
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
      />
    </>
  );
};

export default Navbar;