import React, { useState, useEffect } from 'react';
import { Menu, X, Settings, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGym } from '../context/GymContext';

interface NavbarProps {
  onOpenAssessment: () => void;
}

export default function Navbar({ onOpenAssessment }: NavbarProps) {
  const { gym } = useGym();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Results', href: '#succeed' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Assessment', href: '#', isButton: true },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LogoIcon = gym.logoIcon;
  const gymNameParts = gym.name.split(' ');
  const firstWord = gymNameParts[0];
  const restWords = gymNameParts.slice(1).join(' ');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-black/85 backdrop-blur-md border-b border-brand-orange/10'
            : 'py-5 bg-transparent'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={(e) => handleLinkClick(e, '#')}
            title="Double tap to open Pitch Control Panel"
          >
            <LogoIcon className="w-8 h-8 text-brand-orange transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-bebas text-2xl tracking-wider text-white">
              {firstWord}
              {restWords && <span className="text-brand-orange"> {restWords}</span>}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              link.isButton ? (
                <button
                  key={link.name}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAssessment();
                  }}
                  className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors duration-200"
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenAssessment}
              className="text-xs font-semibold text-gray-300 hover:text-brand-orange transition-colors"
            >
              Take Assessment
            </button>
            <Link
              to="/my-journey"
              className="flex items-center text-xs font-semibold text-gray-300 hover:text-brand-orange transition-colors"
            >
              <UserCircle className="w-4 h-4 mr-1.5" />
              My Portal
            </Link>
            <a
              href="#trial-form"
              onClick={(e) => handleLinkClick(e, '#trial-form')}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-brand-orange rounded-full hover:bg-brand-orange/95 transition-all duration-300 transform hover:scale-105 shadow-md shadow-brand-orange/20"
            >
              Book Free Trial
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event('toggle-ops-center'))}
              className="p-2 ml-2 rounded-full bg-brand-charcoal/50 border border-white/5 text-gray-400 hover:text-white hover:bg-brand-charcoal transition-colors"
              title="Pitch Controls"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <a
              href="#trial-form"
              onClick={(e) => handleLinkClick(e, '#trial-form')}
              className="px-4 py-2 min-h-[44px] flex items-center justify-center text-xs font-bold uppercase tracking-wider text-black bg-brand-orange rounded-full shadow-md"
            >
              Trial
            </a>
            <Link
              to="/my-journey"
              className="p-2 text-gray-400 hover:text-white bg-brand-charcoal/50 border border-white/5 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="My Portal"
            >
              <UserCircle className="w-4 h-4" />
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('toggle-ops-center'))}
              className="p-2 text-gray-400 hover:text-white bg-brand-charcoal/50 border border-white/5 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 -mr-2 text-gray-300 hover:text-white focus:outline-none flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      </header>

      {/* Mobile Drawer Menu (Moved outside header to escape backdrop-blur stacking context) */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-xs bg-brand-charcoal border-l border-brand-orange/10 p-6 shadow-2xl transition-transform duration-300 transform md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-bebas text-xl text-white">Navigation</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-white flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            link.isButton ? (
              <button
                key={link.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssessment();
                }}
                className="text-lg text-left font-bebas tracking-wide text-gray-200 hover:text-brand-orange py-3 border-b border-gray-800"
              >
                {link.name}
              </button>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-bebas tracking-wide text-gray-200 hover:text-brand-orange py-3 border-b border-gray-800"
              >
                {link.name}
              </a>
            )
          ))}
          <div className="flex flex-col space-y-3 pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssessment();
              }}
              className="w-full py-3.5 text-sm text-center text-gray-300 bg-brand-black border border-brand-orange/20 rounded-lg min-h-[44px]"
            >
              Start Free Assessment
            </button>
            <Link
              to="/my-journey"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-sm text-center font-bold text-white bg-brand-charcoal border border-brand-orange/40 hover:bg-brand-orange/10 transition-colors rounded-lg min-h-[44px] flex items-center justify-center gap-2"
            >
              <UserCircle className="w-5 h-5" />
              Access Client Portal
            </Link>
            <a
              href="#trial-form"
              onClick={(e) => handleLinkClick(e, '#trial-form')}
              className="w-full py-3 text-sm text-center font-bold uppercase tracking-wider text-black bg-brand-orange rounded-full shadow-lg"
            >
              Book Free Trial
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
