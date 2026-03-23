import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Tractor, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'Tractors', to: '/tractors' },
  { name: 'Inquiry', to: '/inquiry' },
  { name: 'Admin', to: '/admin' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl',
      scrolled ? 'bg-white/80 shadow-lg' : 'bg-white/60'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Tractor className="h-8 w-8 text-red-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Agristar
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-600',
                  location.pathname === link.to ? 'bg-red-100 text-red-600 shadow-md' : 'text-gray-700'
                )}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'block px-3 py-2 text-base font-medium rounded-lg transition-colors',
                  location.pathname === link.to ? 'bg-red-100 text-red-600' : 'text-gray-700 hover:bg-red-100'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-red-100"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}