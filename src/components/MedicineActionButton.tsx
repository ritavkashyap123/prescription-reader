import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Medication } from '../types';
import SearchPopup from './SearchPopup';
import { useCart } from '../context/CartContext';

interface MedicineActionButtonProps {
  medications: Medication[];
}

const MedicineActionButton: React.FC<MedicineActionButtonProps> = ({ medications }) => {
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setCheckoutSuccess } = useCart();

  const handleSearchClick = () => {
    console.log('MedicineActionButton: Search clicked with medications:', medications);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSearchPopup(true);
    }, 100); // Small delay to ensure state updates
  };

  const handleSearchComplete = (found: boolean) => {
    console.log('MedicineActionButton: Search completed, found:', found);
    setShowSearchPopup(false);
    
    // If medicines were found and added to cart, open the cart drawer
    if (found) {
      // Trigger cart open by simulating a checkout in cart context
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 100);
    }
  };

  if (!medications || medications.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleSearchClick}
        disabled={isLoading}
        className={`px-3 py-1 text-xs ${
          isLoading ? 'bg-neutral-300' : 'bg-blue-600 hover:bg-blue-700'
        } text-white rounded-full flex items-center gap-1 transition-colors`}
      >
        {isLoading ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Search size={12} />
            <span>Quick Search on 1mg</span>
          </>
        )}
      </button>

      {showSearchPopup && (
        <SearchPopup
          medications={medications}
          onClose={() => setShowSearchPopup(false)}
          onComplete={handleSearchComplete}
        />
      )}
    </>
  );
};

export default MedicineActionButton; 