// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-grow p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;
