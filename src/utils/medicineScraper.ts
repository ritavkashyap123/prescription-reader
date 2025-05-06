import { Medication } from '../types';

export interface MedicineInfo {
  id: string;
  name: string;
  brand: string;
  price: number;
  dosageForm: string;
  quantity: string;
  image: string;
  originalMedication: Medication;
}

// Mock API to simulate scraping from 1mg (since actual scraping would require a backend)
export const searchMedicine = async (medicineName: string): Promise<MedicineInfo | null> => {
  try {
    // In a real implementation, this would be an API call to a backend service
    // that handles the actual scraping
    console.log(`Searching for medicine: ${medicineName}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    // Generate a deterministic but random-looking result based on the medicine name
    const hash = stringToHash(medicineName);
    
    // Return null for ~5% of searches to simulate not found
    if (hash % 20 === 0) {
      return null;
    }
    
    // Common pharmaceutical brands
    const brands = [
      'Sun Pharma', 'Cipla', 'Dr. Reddy\'s', 'Lupin', 
      'Zydus', 'Intas', 'Mankind', 'Alkem', 'Torrent'
    ];
    
    // Common dosage forms
    const forms = [
      'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 
      'Ointment', 'Gel', 'Drops', 'Suspension'
    ];
    
    // Generate deterministic but varied data
    const brand = brands[hash % brands.length];
    const form = forms[hash % forms.length];
    const price = 10 + (hash % 990); // Price between 10 and 999
    
    // If a medication has quantity, try to use that information
    const originalQuantity = medicineName.match(/\d+\s*(tablets?|capsules?|ml|mg|g)/i);
    const quantity = originalQuantity ? originalQuantity[0] : '1 Pack';
    
    return {
      id: `MED${hash}`,
      name: medicineName,
      brand,
      price: price / 10, // Get a decimal price
      dosageForm: form,
      quantity,
      image: `https://picsum.photos/seed/${hash}/200/200`, // Random but deterministic image
      originalMedication: null as any // Will be set by the caller
    };
  } catch (error) {
    console.error('Error searching for medicine:', error);
    return null;
  }
};

export const searchAllMedications = async (medications: Medication[]): Promise<MedicineInfo[]> => {
  const results: MedicineInfo[] = [];
  
  for (const medication of medications) {
    const result = await searchMedicine(medication.name);
    if (result) {
      // Add the original medication data for reference
      result.originalMedication = medication;
      
      // If a quantity was specified in the prescription, use it to modify the quantity
      if (medication.totalQuantity && medication.totalQuantity !== 'Not specified') {
        result.quantity = medication.totalQuantity;
      }
      
      results.push(result);
    }
  }
  
  return results;
};

// Direct 1mg scraper that returns a promise with search progress
export const directScrapeAndSearch = async (
  medications: Medication[],
  onProgress?: (searchedCount: number, totalCount: number, currentMedicine: string) => void
): Promise<MedicineInfo[]> => {
  const results: MedicineInfo[] = [];
  const total = medications.length;
  
  for (let i = 0; i < medications.length; i++) {
    const medication = medications[i];
    
    // Call the progress callback if provided
    if (onProgress) {
      onProgress(i, total, medication.name);
    }
    
    const result = await searchMedicine(medication.name);
    if (result) {
      // Add the original medication data for reference
      result.originalMedication = medication;
      
      // If a quantity was specified in the prescription, use it to modify the quantity
      if (medication.totalQuantity && medication.totalQuantity !== 'Not specified') {
        result.quantity = medication.totalQuantity;
      }
      
      results.push(result);
    }
  }
  
  // Final callback with completion
  if (onProgress && medications.length > 0) {
    onProgress(total, total, '');
  }
  
  return results;
};

// Helper function to generate a numeric hash from a string
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}; 