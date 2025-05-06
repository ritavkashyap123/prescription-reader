import React from 'react';
import { HeartPulse } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-neutral-500 text-sm mb-2 sm:mb-0">
          © {currentYear} PharmaVision. All rights reserved.
        </p>
        
        <div className="flex items-center">
          <span className="text-neutral-500 text-sm mr-2">Made with</span>
          <HeartPulse size={16} className="text-primary-500 mr-2" />
          <span className="text-neutral-500 text-sm">for pharmacists</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;