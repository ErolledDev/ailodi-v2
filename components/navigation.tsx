'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSheetOpen(false);
    }
  };

  const handleNavClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav className="medium-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="medium-nav-brand">
            AI Lodi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="medium-nav-link">
              Home
            </Link>
            <Link href="/categories" className="medium-nav-link">
              Categories
            </Link>
            <Link href="/about" className="medium-nav-link">
              About
            </Link>
            <Link href="/contact" className="medium-nav-link">
              Contact
            </Link>
            
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="medium-search w-64">
              <Search size={16} className="medium-search-icon" />
              <Input
                type="search"
                placeholder="Search AI & Tech insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border focus:ring-primary focus:border-primary"
                aria-label="Search AI and Tech insights"
              />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  aria-label="Open navigation menu"
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    AI Lodi
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit} className="medium-search">
                    <Search size={16} className="medium-search-icon" />
                    <Input
                      type="search"
                      placeholder="Search AI & Tech insights..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-border focus:ring-primary focus:border-primary"
                      aria-label="Search AI and Tech insights"
                    />
                  </form>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link 
                        href="/" 
                        className="medium-nav-link px-3 py-2 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                        onClick={handleNavClick}
                      >
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/categories" 
                        className="medium-nav-link px-3 py-2 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                        onClick={handleNavClick}
                      >
                        Categories
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/about" 
                        className="medium-nav-link px-3 py-2 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                        onClick={handleNavClick}
                      >
                        About
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/contact" 
                        className="medium-nav-link px-3 py-2 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                        onClick={handleNavClick}
                      >
                        Contact
                      </Link>
                    </SheetClose>
                  </div>

                  {/* Mobile Quick Actions */}
                  <div className="pt-6 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Quick Access</p>
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Link 
                          href="/search" 
                          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          onClick={handleNavClick}
                        >
                          <Search size={16} />
                          Advanced Search
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}