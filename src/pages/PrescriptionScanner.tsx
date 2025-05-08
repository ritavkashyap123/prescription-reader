import { motion } from 'framer-motion';
import MainCard from '../components/MainCard';

const PrescriptionScanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
          Extract Text from Prescriptions
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Our AI-powered OCR tool helps pharmacists digitize prescriptions quickly and accurately.
          Upload an image, and we'll convert it to editable text.
        </p>
      </motion.section>
      
      <MainCard />
    </div>
  );
};

export default PrescriptionScanner; 