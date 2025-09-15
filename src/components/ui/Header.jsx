import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/user-dashboard',
      icon: 'BarChart3',
      tooltip: 'View your nutrition progress and daily overview'
    },
    {
      label: 'Meal Planning',
      path: '/meal-planning',
      icon: 'Calendar',
      tooltip: 'Plan your weekly meals and discover recipes'
    },
    {
      label: 'Cooking Games',
      path: '/cooking-games',
      icon: 'Gamepad2',
      tooltip: 'Interactive cooking challenges and skill building'
    }
  ];

  const userProfile = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '/assets/images/avatar-placeholder.jpg',
    subscriptionTier: 'Premium',
    dailyProgress: 75
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActivePath = (path) => location?.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/user-dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Utensils" size={20} color="white" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">NutriFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.tooltip}
            >
              <Icon 
                name={item?.icon} 
                size={18} 
                color={isActivePath(item?.path) ? 'white' : 'currentColor'} 
              />
              <span className="font-body font-medium">{item?.label}</span>
              {isActivePath(item?.path) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-caption text-muted-foreground">
              {userProfile?.dailyProgress}% daily goal
            </span>
          </div>

          {/* Subscription Badge */}
          <div className="hidden md:flex items-center px-2 py-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full border border-accent/30">
            <Icon name="Crown" size={14} color="var(--color-accent)" />
            <span className="ml-1 text-xs font-caption font-medium text-accent-foreground">
              {userProfile?.subscriptionTier}
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-heading font-semibold text-primary-foreground">
                  {userProfile?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <Icon name="ChevronDown" size={16} color="currentColor" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated animate-slide-down">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-heading font-semibold text-primary-foreground">
                        {userProfile?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-popover-foreground">{userProfile?.name}</p>
                      <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors">
                    <Icon name="User" size={16} color="currentColor" />
                    <span className="font-body text-popover-foreground">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors">
                    <Icon name="Settings" size={16} color="currentColor" />
                    <span className="font-body text-popover-foreground">Preferences</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors">
                    <Icon name="HelpCircle" size={16} color="currentColor" />
                    <span className="font-body text-popover-foreground">Help & Support</span>
                  </button>
                  <div className="border-t border-border my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                  >
                    <Icon name="LogOut" size={16} color="currentColor" />
                    <span className="font-body">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} color="currentColor" />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-down" ref={menuRef}>
          <nav className="p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  color={isActivePath(item?.path) ? 'white' : 'currentColor'} 
                />
                <div>
                  <span className="font-body font-medium">{item?.label}</span>
                  <p className="text-xs opacity-75 mt-1">{item?.tooltip}</p>
                </div>
              </Link>
            ))}
            
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-caption text-muted-foreground">Daily Progress</span>
                <span className="text-sm font-mono font-medium text-success">{userProfile?.dailyProgress}%</span>
              </div>
              <div className="px-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-300"
                    style={{ width: `${userProfile?.dailyProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;