import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Database, CheckCircle2, ShoppingCart, XCircle } from 'lucide-react';
import { Medication } from '../types';
import { MedicineInfo, directScrapeAndSearch } from '../utils/medicineScraper';
import { useCart } from '../context/CartContext';

interface SearchPopupProps {
  medications: Medication[];
  onClose: () => void;
  onComplete: (found: boolean) => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ medications, onClose, onComplete }) => {
  const [stage, setStage] = useState<'searching' | 'confirmation' | 'success' | 'error'>('searching');
  const [progress, setProgress] = useState({ current: 0, total: 0, medicine: '' });
  const [foundMedicines, setFoundMedicines] = useState<MedicineInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  // Calculate progress percentage
  const progressPercentage = progress.total > 0 
    ? Math.floor((progress.current / progress.total) * 100) 
    : 0;

  useEffect(() => {
    console.log('SearchPopup mounted with medications:', medications);
    
    if (!medications || medications.length === 0) {
      console.error('No medications provided to SearchPopup');
      setStage('error');
      setError('No medications to search for');
      setTimeout(() => onComplete(false), 3000);
      return;
    }

    const searchMedicines = async () => {
      try {
        console.log('Starting search with medications:', medications);
        
        const results = await directScrapeAndSearch(
          medications,
          (searchedCount, totalCount, currentMedicine) => {
            console.log(`Search progress: ${searchedCount}/${totalCount} - ${currentMedicine}`);
            setProgress({ 
              current: searchedCount, 
              total: totalCount, 
              medicine: currentMedicine 
            });
          }
        );
        
        console.log('Search completed with results:', results);
        setFoundMedicines(results);
        
        if (results.length > 0) {
          setStage('confirmation');
        } else {
          setStage('error');
          setError('No medicines found on 1mg');
          setTimeout(() => onComplete(false), 3000);
        }
      } catch (err) {
        console.error('Error in medicine search:', err);
        setStage('error');
        setError('Failed to search for medicines');
        setTimeout(() => onComplete(false), 3000);
      }
    };
    
    searchMedicines();
  }, [medications, onComplete]);

  const handleConfirm = () => {
    // Add all found medicines to cart
    foundMedicines.forEach(medicine => {
      addItem(medicine);
    });
    
    setStage('success');
    
    // Close after delay
    setTimeout(() => {
      onComplete(true);
    }, 2000);
  };

  const handleCancel = () => {
    onComplete(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={() => stage !== 'searching' && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={e => e.stopPropagation()}
        >
          {stage === 'searching' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Database size={48} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Searching 1mg for Your Medicines
              </h3>
              <p className="text-neutral-600 mb-6">
                We're searching for the best matches for your prescription medicines.
              </p>
              
              <div className="mb-4">
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-primary-600 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-neutral-500">
                  <span>{progress.current} of {progress.total}</span>
                  <span>{progressPercentage}% complete</span>
                </div>
              </div>
              
              {progress.medicine && (
                <div className="flex items-center justify-center gap-2 text-neutral-600">
                  <Loader2 size={16} className="animate-spin text-primary-600" />
                  <span>Searching for "{progress.medicine}"</span>
                </div>
              )}
            </div>
          )}
          
          {stage === 'confirmation' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={48} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Medicines Found!
              </h3>
              <p className="text-neutral-600 mb-4">
                We found {foundMedicines.length} {foundMedicines.length === 1 ? 'medicine' : 'medicines'} on 1mg matching your prescription.
              </p>
              
              <div className="border border-neutral-200 rounded-lg p-3 mb-6 max-h-32 overflow-auto">
                <ul className="text-left divide-y divide-neutral-100">
                  {foundMedicines.map((medicine, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <span className="font-medium text-neutral-800">{medicine.name}</span>
                      <span className="text-neutral-500 text-sm">{medicine.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-neutral-600 mb-4">
                Would you like to add these medicines to your cart?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 px-4 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Yes, Add to Cart
                </button>
              </div>
            </div>
          )}
          
          {stage === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Added to Cart!
              </h3>
              <p className="text-neutral-600">
                Your medicines have been added to your cart. You can checkout when ready.
              </p>
            </div>
          )}
          
          {stage === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle size={48} className="text-error-600" />
              </div>
              <h3 className="text-xl font-bold text-error-700 mb-2">
                Search Failed
              </h3>
              <p className="text-neutral-600">
                {error || "We couldn't find your medicines on 1mg. Please try again later."}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchPopup; 