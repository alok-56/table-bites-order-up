
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-4 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
