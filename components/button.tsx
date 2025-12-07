import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'link';
  asLink?: boolean;
  href?: string;
}

export default function Button({
  children,
  variant = 'default',
  asLink = false,
  href,
  className = '',
  ...props
}: ButtonProps) {
  const baseClass = variant === 'default' ? 'button-33' : '';
  
  if (asLink && href) {
    return (
      <a href={href} className={`${baseClass} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
