
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Início', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Categorias', href: '/categorias' },
    { name: 'Sobre', href: '/sobre' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://i.postimg.cc/g0pT0DVz/PONTO-DE-VISTA-1.png" 
              alt="Ponto de Vista" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-blog-secondary ${
                  isActive(item.href)
                    ? 'text-blog-primary border-b-2 border-blog-primary pb-1'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Link to="/newsletter">
              <Button size="sm" className="bg-blog-primary hover:bg-blog-secondary">
                Newsletter
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-in">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-blog-primary bg-blue-50'
                      : 'text-gray-600 hover:text-blog-secondary hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Link to="/newsletter" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-blog-primary hover:bg-blog-secondary">
                    Newsletter
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
