import React from 'react';
import { Pill } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Pill size={28} className="mr-3" />
          <h1 className="text-2xl font-bold tracking-tight">PharmaVision</h1>
        </div>
        <p className="text-sm sm:text-base text-primary-100">
          Modern Prescription OCR for Pharmacies
        </p>
      </div>
    </header>
  );
};

export default Header;