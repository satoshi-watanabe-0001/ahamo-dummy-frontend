import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentShowcaseProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  codeExample?: string;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  title,
  description,
  children,
  className,
  codeExample
}) => {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="space-y-4">
          {children}
        </div>
      </div>
      
      {codeExample && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
            コード例を表示
          </summary>
          <div className="mt-2 rounded-md bg-muted p-4">
            <pre className="text-sm">
              <code>{codeExample}</code>
            </pre>
          </div>
        </details>
      )}
    </section>
  );
};

export default ComponentShowcase;
