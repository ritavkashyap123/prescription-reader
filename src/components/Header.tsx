import React, { useState, useEffect } from 'react';
import { Pill, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, isCheckoutSuccess } = useCart();

  // Auto-open cart when checkout success state changes
  useEffect(() => {
    if (isCheckoutSuccess) {
      setIsCartOpen(true);
    }
  }, [isCheckoutSuccess]);

  return (
    <>
      <header className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Pill size={28} className="mr-3" />
            <h1 className="text-2xl font-bold tracking-tight">PharmaVision</h1>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm sm:text-base text-primary-100 mr-6">
              Modern Prescription OCR for Pharmacies
            </p>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;