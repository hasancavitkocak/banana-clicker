import React from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col items-center pt-4 px-4 md:pt-8">
      {children}
    </div>
  );
}