import { MedicineInfo } from '../utils/medicineScraper';

// Common pharmaceutical brands
const brands = [
    'Sun Pharma', 'Cipla', 'Dr. Reddy\'s', 'Lupin',
    'Zydus', 'Intas', 'Mankind', 'Alkem', 'Torrent',
    'GlaxoSmithKline', 'Pfizer', 'Novartis', 'Sanofi',
    'Abbott', 'Bayer', 'Merck', 'AstraZeneca'
];

// Common dosage forms
const forms = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream',
    'Ointment', 'Gel', 'Drops', 'Suspension', 'Powder',
    'Inhaler', 'Patch', 'Spray', 'Solution'
];

// Common medicine names and their details
const medicineNames = [
    { name: 'Paracetamol', category: 'Pain Relief' },
    { name: 'Amoxicillin', category: 'Antibiotic' },
    { name: 'Omeprazole', category: 'Antacid' },
    { name: 'Metformin', category: 'Diabetes' },
    { name: 'Atorvastatin', category: 'Cholesterol' },
    { name: 'Cetirizine', category: 'Antiallergic' },
    { name: 'Azithromycin', category: 'Antibiotic' },
    { name: 'Pantoprazole', category: 'Antacid' },
    { name: 'Metoprolol', category: 'Blood Pressure' },
    { name: 'Amlodipine', category: 'Blood Pressure' },
    { name: 'Montelukast', category: 'Asthma' },
    { name: 'Sertraline', category: 'Antidepressant' },
    { name: 'Escitalopram', category: 'Antidepressant' },
    { name: 'Losartan', category: 'Blood Pressure' },
    { name: 'Metronidazole', category: 'Antibiotic' },
    { name: 'Ciprofloxacin', category: 'Antibiotic' },
    { name: 'Diclofenac', category: 'Pain Relief' },
    { name: 'Ibuprofen', category: 'Pain Relief' },
    { name: 'Prednisolone', category: 'Steroid' },
    { name: 'Levothyroxine', category: 'Thyroid' }
];

// Generate random price between 10 and 1000
const getRandomPrice = () => (Math.random() * 990 + 10).toFixed(2);

// Generate random quantity
const getRandomQuantity = () => {
    const quantities = [
        '10 tablets', '15 tablets', '20 tablets', '30 tablets',
        '10 capsules', '15 capsules', '20 capsules', '30 capsules',
        '100ml', '200ml', '500ml', '1000ml',
        '5g', '10g', '15g', '20g',
        '1 pack', '2 packs', '3 packs'
    ];
    return quantities[Math.floor(Math.random() * quantities.length)];
};

// Generate dummy medicines
export const dummyMedicines: MedicineInfo[] = medicineNames.flatMap(medicine => {
    const variations = Math.floor(Math.random() * 5) + 3; // 3-7 variations per medicine
    const medicines: MedicineInfo[] = [];

    for (let i = 0; i < variations; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const form = forms[Math.floor(Math.random() * forms.length)];
        const strength = Math.floor(Math.random() * 3) + 1; // 1-3 strength variations
        const strengthUnit = form.toLowerCase().includes('tablet') || form.toLowerCase().includes('capsule') ? 'mg' : 'ml';

        medicines.push({
            id: `MED${Math.random().toString(36).substr(2, 9)}`,
            name: `${medicine.name} ${strength * 250}${strengthUnit}`,
            brand,
            price: parseFloat(getRandomPrice()),
            dosageForm: form,
            quantity: getRandomQuantity(),
            //   image: `https://picsum.photos/seed/${medicine.name}${i}/200/200`,
            image: "/medicine.svg",
            originalMedication: {
                name: `${medicine.name} ${strength * 250}${strengthUnit}`,
                dosesPerDay: `${Math.floor(Math.random() * 3) + 1} times daily`,
                duration: `${Math.floor(Math.random() * 7) + 3} days`,
                totalQuantity: getRandomQuantity()
            }
        });
    }

    return medicines;
});

// Add some combination medicines
const combinationMedicines = [
    'Paracetamol + Ibuprofen',
    'Amoxicillin + Clavulanic Acid',
    'Paracetamol + Codeine',
    'Metformin + Glimepiride',
    'Amlodipine + Telmisartan',
    'Paracetamol + Caffeine',
    'Cetirizine + Pseudoephedrine',
    'Azithromycin + Ambroxol',
    'Pantoprazole + Domperidone',
    'Metoprolol + Amlodipine'
];

combinationMedicines.forEach(medicine => {
    const variations = Math.floor(Math.random() * 3) + 2; // 2-4 variations per combination

    for (let i = 0; i < variations; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const form = forms[Math.floor(Math.random() * forms.length)];

        dummyMedicines.push({
            id: `MED${Math.random().toString(36).substr(2, 9)}`,
            name: medicine,
            brand,
            price: parseFloat(getRandomPrice()),
            dosageForm: form,
            quantity: getRandomQuantity(),
            //   image: `https://picsum.photos/seed/${medicine}${i}/200/200`,
            image: "/medicine.svg",
            originalMedication: {
                name: medicine,
                dosesPerDay: `${Math.floor(Math.random() * 3) + 1} times daily`,
                duration: `${Math.floor(Math.random() * 7) + 3} days`,
                totalQuantity: getRandomQuantity()
            }
        });
    }
});

// Export the final array
export default dummyMedicines;
