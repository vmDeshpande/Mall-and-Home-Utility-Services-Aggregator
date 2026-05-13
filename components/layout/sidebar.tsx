'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Settings, LogOut, Menu, X, VerifiedIcon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  type: 'provider' | 'admin';
}

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems =
    type === 'provider'
      ? [
          { href: '/provider/dashboard', label: 'Dashboard', icon: Home },
          { href: '/provider/requests', label: 'Requests', icon: BarChart3 },
          { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
          { href: '/provider/settings', label: 'Settings', icon: Settings },
        ]
      : [
          { href: '/admin/dashboard', label: 'Overview', icon: Home },
          { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { href: '/admin/verify-providers', label: 'Verify Providers', icon: VerifiedIcon },
          { href: '/admin/settings', label: 'Settings', icon: Settings },
        ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-border bg-sidebar overflow-y-auto transition-transform md:relative md:top-0 md:h-screen md:translate-x-0 md:transform',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-4 p-6">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-sidebar-foreground capitalize">{type} Portal</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border pt-4 mt-8">
            <button className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
