import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { Medication } from '../types';
import { searchAllMedications, MedicineInfo } from '../utils/medicineScraper';
import MedicineCard from './MedicineCard';

interface MedicineSearchProps {
  medications: Medication[] | undefined;
}

const MedicineSearch: React.FC<MedicineSearchProps> = ({ medications }) => {
  const [searchResults, setSearchResults] = useState<MedicineInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!medications || medications.length === 0) {
        return;
      }
      
      // Only use medications with confirmed names
      const confirmedMedications = medications.filter(med => med.isConfirmedName !== false);
      
      if (confirmedMedications.length === 0) {
        console.log("No confirmed medication names available, skipping search");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await searchAllMedications(confirmedMedications);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching medications:', err);
        setError('Failed to search for medicines. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicines();
  }, [medications]);

  // Don't display anything if no confirmed medications
  if (!medications || medications.length === 0 || !medications.some(med => med.isConfirmedName !== false)) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary-600" />
            Available Medicines
          </h3>
          <p className="text-neutral-600 text-sm mt-1">
            We found these medicines based on your prescription
          </p>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>Searching...</span>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-neutral-600">Searching for medicines...</p>
            <p className="text-neutral-500 text-sm mt-1">This may take a moment</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[200px] flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 bg-error-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-error-500" />
            </div>
            <p className="text-error-700 font-medium">{error}</p>
            <p className="text-neutral-500 text-sm mt-1 max-w-md">
              Please check your network connection and try again.
            </p>
          </motion.div>
        ) : searchResults.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[200px] flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-amber-500" />
            </div>
            <p className="text-neutral-700 font-medium">No medicines found</p>
            <p className="text-neutral-500 text-sm mt-1 max-w-md">
              We couldn't find any matches for the medicines in your prescription.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map(medicine => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineSearch; 