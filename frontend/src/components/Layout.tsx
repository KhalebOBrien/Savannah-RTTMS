import React, { FC, ReactNode } from 'react';

interface WrapperProps
  extends Omit<React.HTMLAttributes<unknown>, 'style' | 'placeholder'> {
  children?: ReactNode;
  className?: string;
}

const LayoutWrapper: FC<WrapperProps> = ({ children, className }) => {
  return (
    <main className={`bg-black h-screen text-white ${className}`}>
      {children}
    </main>
  );
};

export default LayoutWrapper;
