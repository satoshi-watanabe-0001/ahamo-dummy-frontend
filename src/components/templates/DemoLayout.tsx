import React from 'react';
import { cn } from '@/lib/utils';

interface DemoLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

const DemoLayout: React.FC<DemoLayoutProps> = ({
  children,
  title,
  description,
  className
}) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DemoLayout;
