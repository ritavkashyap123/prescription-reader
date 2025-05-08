import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ShoppingCart, SlidersHorizontal, Sparkles, Pill } from 'lucide-react';
import { dummyMedicines } from '../types/data';
import { MedicineInfo } from '../utils/medicineScraper';
import { useCart } from '../context/CartContext';

const MedicineListing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState<MedicineInfo[]>(dummyMedicines);
  const { addItem, items } = useCart();

  // Get unique brands and forms
  const brands = Array.from(new Set(dummyMedicines.map(med => med.brand)));
  const forms = Array.from(new Set(dummyMedicines.map(med => med.dosageForm)));

  useEffect(() => {
    let filtered = dummyMedicines;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(med => med.brand === selectedBrand);
    }

    // Apply form filter
    if (selectedForm) {
      filtered = filtered.filter(med => med.dosageForm === selectedForm);
    }

    // Apply price range filter
    filtered = filtered.filter(med => 
      med.price >= priceRange[0] && med.price <= priceRange[1]
    );

    setFilteredMedicines(filtered);
  }, [searchQuery, selectedBrand, selectedForm, priceRange]);

  const handleAddToCart = (medicine: MedicineInfo) => {
    addItem(medicine);
  };

  const isInCart = (medicineId: string) => {
    return items.some(item => item.id === medicineId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with animated gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-purple-50 to-primary-50 rounded-3xl opacity-50" />
        <div className="relative p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 shadow-sm"
          >
            <span className="text-primary-600 font-medium">✨ Find Your Medicines</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Browse <span className="text-primary-600">Medicines</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Discover and order your medicines with ease. We've got everything you need! 🏥
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5 group-focus-within:text-primary-600 transition-colors" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
          {showFilters && <X className="h-5 w-5 ml-2" />}
        </motion.button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Brand
                </label>
                <div className="relative group">
                  <select
                    value={selectedBrand || ''}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                    className="w-full pl-3 pr-10 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none transition-all duration-300 shadow-sm group-hover:shadow-md"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5 group-focus-within:text-primary-600 transition-colors" />
                </div>
              </div>

              {/* Form Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Dosage Form
                </label>
                <div className="relative group">
                  <select
                    value={selectedForm || ''}
                    onChange={(e) => setSelectedForm(e.target.value || null)}
                    className="w-full pl-3 pr-10 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none transition-all duration-300 shadow-sm group-hover:shadow-md"
                  >
                    <option value="">All Forms</option>
                    {forms.map(form => (
                      <option key={form} value={form}>{form}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5 group-focus-within:text-primary-600 transition-colors" />
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price Range (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full pl-3 pr-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    min="0"
                  />
                  <span className="text-neutral-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full pl-3 pr-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-neutral-600">
          Found {filteredMedicines.length} medicines {searchQuery && `for "${searchQuery}"`}
        </p>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMedicines.map((medicine, index) => (
            <motion.div
              key={medicine.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-w-4 aspect-h-3">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 text-lg mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {medicine.name}
                </h3>
                <p className="text-neutral-500 text-sm mb-2">{medicine.brand}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">
                    {medicine.dosageForm}
                  </span>
                  <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">
                    {medicine.quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-neutral-900">
                    ₹{medicine.price.toFixed(2)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(medicine)}
                    disabled={isInCart(medicine.id)}
                    className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                      isInCart(medicine.id)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isInCart(medicine.id) ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Pill className="h-4 w-4 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredMedicines.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Sparkles className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600 text-lg mb-4">No medicines found matching your criteria</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand(null);
              setSelectedForm(null);
              setPriceRange([0, 1000]);
            }}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all filters
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MedicineListing; 