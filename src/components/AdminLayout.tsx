
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ShoppingBag, QrCode, Table, ShoppingCart } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: ShoppingBag },
    { href: '/admin/menu', label: 'Menu', icon: ShoppingBag },
    { href: '/admin/tables', label: 'Tables & QR Codes', icon: QrCode },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
      </header>
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white p-4 rounded-lg shadow">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
          
          <main className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">{title}</h2>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
