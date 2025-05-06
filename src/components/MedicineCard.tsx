import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { MedicineInfo } from '../utils/medicineScraper';
import { useCart } from '../context/CartContext';

interface MedicineCardProps {
  medicine: MedicineInfo;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const { items, addItem } = useCart();
  const isInCart = items.some(item => item.id === medicine.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
    >
      <div className="p-4 pb-0 flex-grow">
        <div className="w-full h-32 bg-neutral-100 rounded-lg overflow-hidden mb-4">
          <img 
            src={medicine.image} 
            alt={medicine.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <h3 className="font-medium text-neutral-800 text-lg line-clamp-1">{medicine.name}</h3>
        <p className="text-neutral-500 text-sm mb-1">{medicine.brand}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">
            {medicine.dosageForm}
          </span>
          <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">
            {medicine.quantity}
          </span>
        </div>
        
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-neutral-900">₹{medicine.price.toFixed(2)}</span>
          {medicine.originalMedication && (
            <span className="text-xs text-neutral-500">
              {medicine.originalMedication.dosesPerDay} | {medicine.originalMedication.duration}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 pt-3">
        <button
          onClick={() => !isInCart && addItem(medicine)}
          disabled={isInCart}
          className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
            isInCart 
              ? 'bg-green-100 text-green-700' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          } transition-colors`}
        >
          {isInCart ? (
            <>
              <Check size={16} />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MedicineCard; 