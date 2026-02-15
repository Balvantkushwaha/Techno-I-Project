import { useState } from 'react';
import { Link } from 'react-router';
import { Search, ShoppingCart, User, Menu, X, Eye, Sun, Package, LogOut, UserCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from '../LoginModal';
import styles from './Navbar.module.css';

export function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  
  const cartCount = getCartCount();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            {/* Logo */}
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <Eye className={styles.logoIconSvg} />
              </div>
              <span className={styles.logoText}>Techno-I</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for eyeglasses, sunglasses..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className={styles.navActions}>
              {/* Search Icon - Mobile */}
              <button className={styles.iconButton} style={{ display: 'flex' }}>
                <Search size={20} style={{ display: 'block' }} className="md:hidden" />
              </button>

              {/* Cart */}
              <Link to="/cart" className={styles.iconButton}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className={styles.badge}>{cartCount}</span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className={styles.userMenu}>
                  <div 
                    className={styles.userButton}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className={styles.userAvatar}>
                      {getUserInitials()}
                    </div>
                    <span className={styles.userName}>{user.name}</span>
                  </div>

                  {showUserMenu && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownItem}>
                        <UserCircle className={styles.dropdownIcon} />
                        <span>My Profile</span>
                      </div>
                      <div className={styles.dropdownItem}>
                        <Package className={styles.dropdownIcon} />
                        <span>Orders</span>
                      </div>
                      <div 
                        className={styles.dropdownItem}
                        onClick={handleLogout}
                      >
                        <LogOut className={styles.dropdownIcon} />
                        <span>Logout</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className={styles.loginButton}
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Icon */}
              {!isAuthenticated && (
                <button 
                  className={styles.iconButton}
                  style={{ display: 'flex' }}
                  onClick={() => setShowLoginModal(true)}
                >
                  <User size={20} style={{ display: 'block' }} className="sm:hidden" />
                </button>
              )}

              <button 
                className={styles.mobileMenuButton}
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuHeader}>
            <Link to="/" className={styles.logo} onClick={() => setShowMobileMenu(false)}>
              <div className={styles.logoIcon}>
                <Eye className={styles.logoIconSvg} />
              </div>
              <span className={styles.logoText}>Technoii</span>
            </Link>
            <button 
              className={styles.mobileMenuClose}
              onClick={() => setShowMobileMenu(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className={styles.mobileSearch}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.mobileMenuItems}>
            <Link 
              to="/products?category=eyeglasses" 
              className={styles.mobileMenuItem}
              onClick={() => setShowMobileMenu(false)}
            >
              <Eye className={styles.mobileMenuIcon} />
              <span>Eyeglasses</span>
            </Link>
            <Link 
              to="/products?category=sunglasses" 
              className={styles.mobileMenuItem}
              onClick={() => setShowMobileMenu(false)}
            >
              <Sun className={styles.mobileMenuIcon} />
              <span>Sunglasses</span>
            </Link>
            <Link 
              to="/products?category=lenses" 
              className={styles.mobileMenuItem}
              onClick={() => setShowMobileMenu(false)}
            >
              <Package className={styles.mobileMenuIcon} />
              <span>Contact Lenses</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  className={styles.mobileMenuItem}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <UserCircle className={styles.mobileMenuIcon} />
                  <span>My Profile</span>
                </Link>
                <div 
                  className={styles.mobileMenuItem}
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  <LogOut className={styles.mobileMenuIcon} />
                  <span>Logout</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
