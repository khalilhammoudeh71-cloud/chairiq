import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { ClipboardList, BarChart3, LogOut, Menu, X, Home, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function DentistNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await authService?.signOut();
    navigate('/dentist-login-authentication');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin-home-dashboard',
      icon: Home,
    },
    {
      name: 'Create Plan',
      path: '/create-patient-plan',
      icon: ClipboardList,
    },
    {
      name: 'Analytics',
      path: '/dentist-admin-analytics-dashboard',
      icon: BarChart3,
    },
    {
      name: 'Content Library',
      path: '/procedure-library-management',
      icon: BookOpen,
    },
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <nav className="bg-bg2 border-b border-bd sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-wide"><span className="text-t1">Chair</span><span className="text-accent">IQ</span></h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => navigate(item?.path)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-accent text-t1 font-medium'
                    : 'text-t2 hover:bg-bg1 hover:text-t1 hover:font-medium'
                }`}
              >
                <item.icon size={20} />
                {item?.name}
                {isActivePath(item?.path) && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                )}
              </button>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-2 pl-4 border-l border-bd">
              <ThemeToggle />
            </div>
            
            {/* User Info & Logout */}
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-bd">
              {user?.email && (
                <span className="text-t3 text-sm hidden lg:block">
                  {user?.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg border border-danger/20"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-t1 hover:bg-bg1 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-bd">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => {
                  navigate(item?.path);
                  setMobileMenuOpen(false);
                }}
                className={`relative w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-accent text-t1 font-medium'
                    : 'text-t2 hover:bg-bg1 hover:text-t1 hover:font-medium'
                }`}
              >
                {isActivePath(item?.path) && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-full" />
                )}
                <item.icon size={20} />
                {item?.name}
              </button>
            ))}
            
            {user?.email && (
              <div className="px-4 py-2 text-t3 text-sm border-t border-bd mt-2 pt-4">
                {user?.email}
              </div>
            )}
            
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg border border-danger/20"
            >
              <LogOut size={20} />
              Logout
            </button>
            
            {/* Mobile Theme Toggle */}
            <div className="px-4 py-2 border-t border-bd mt-2 pt-4">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}