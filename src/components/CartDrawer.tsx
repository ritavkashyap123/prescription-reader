import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, Check, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    totalItems, 
    totalPrice,
    clearCart, 
    isCheckoutSuccess,
    setCheckoutSuccess
  } = useCart();

  const handleCheckout = () => {
    // Simulate checkout process
    setCheckoutSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      clearCart();
      setCheckoutSuccess(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-primary-600" />
                <h2 className="text-lg font-semibold text-neutral-800">Your Medicines</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-grow overflow-auto p-4">
              {isCheckoutSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Purchase Successful!</h3>
                  <p className="text-neutral-600 max-w-xs">
                    Your order has been placed successfully. You'll receive your medicines soon.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart size={24} className="text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">Your cart is empty</h3>
                  <p className="text-neutral-500 max-w-xs">
                    Add prescription medicines to your cart to order them easily.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(item => (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-3 p-3 bg-white rounded-lg border border-neutral-200"
                    >
                      <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-medium text-neutral-800 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-neutral-500">{item.brand} • {item.dosageForm}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm font-bold text-neutral-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
                            >
                              <Minus size={14} />
                            </button>
                            
                            <span className="w-6 text-center text-sm">
                              {item.quantity}
                            </span>
                            
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
                            >
                              <Plus size={14} />
                            </button>
                            
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-1 rounded-full text-error-500 hover:bg-error-50 ml-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && !isCheckoutSuccess && (
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-600">Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="text-lg font-bold text-neutral-900">₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  <span>Checkout</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer; 