import { RecognizedText } from '../types';

// You should store your API key in an environment variable
// In a real project, you would use a backend proxy to avoid exposing your API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL || '';

const baseUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Convert file to base64 for API transmission
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data URL prefix (e.g., data:image/jpeg;base64,)
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Process image using Gemini API for OCR
 */
export const processWithGemini = async (image: File): Promise<RecognizedText> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const startTime = performance.now();
    const base64Image = await fileToBase64(image);
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Extract prescription details from this medical document. For each medication prescribed, identify: \n1. Medicine name\n2. Doses per day\n3. Duration (in days)\n4. Total quantity\n\nFormat your response as JSON with the following structure:\n{\n  \"medications\": [\n    {\n      \"name\": \"Medicine name\",\n      \"dosesPerDay\": \"X doses\",\n      \"duration\": \"X days\",\n      \"totalQuantity\": \"X tablets/ml\"\n    }\n  ],\n  \"rawText\": \"Full extracted text from the prescription\"\n}\n\nIf certain details are not specified in the prescription, use \"Not specified\" for those fields."
            },
            {
              inline_data: {
                mime_type: image.type,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 800,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    const processingTime = (performance.now() - startTime) / 1000;
    
    // Extract text from Gemini response
    const extractedText = data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Try to parse the JSON response
    let medications = [];
    let rawText = extractedText;
    
    console.log('Gemini raw response:', extractedText);
    
    try {
      // Check if the response is in JSON format
      if (extractedText.trim().startsWith('{') && extractedText.trim().endsWith('}')) {
        console.log('Attempting to parse JSON response');
        const parsedData = JSON.parse(extractedText);
        console.log('Parsed data:', parsedData);
        
        if (parsedData.medications) {
          medications = parsedData.medications;
          console.log('Extracted medications:', medications);
        } else {
          console.warn('No medications found in parsed data');
        }
        
        if (parsedData.rawText) {
          rawText = parsedData.rawText;
        }
      } else {
        console.warn('Response is not in expected JSON format');
        
        // Attempt to find medication information in unstructured text
        console.log('Attempting to extract medication information from unstructured text');
        
        // Improved regex patterns to handle various formats
        const medicineNameRegex = /(?:medicine|medication)(?:\s+name)?:?\s*([^,\n]+)(?:,|\n|$)/gi;
        const dosesRegex = /(?:doses?|dosage)(?:\s+per\s+day)?:?\s*([^,\n]+)(?:,|\n|$)/gi;
        const durationRegex = /(?:duration|for|period):?\s*([^,\n]+)(?:,|\n|$)/gi;
        const quantityRegex = /(?:total\s+)?(?:quantity|amount|count):?\s*([^,\n]+)(?:,|\n|$)/gi;
        
        // JSON property pattern extraction
        const jsonPropertyRegex = /"([^"]+)":\s*"([^"]+)"/g;
        
        const extractRegexMatches = (regex: RegExp, text: string): string[] => {
          const matches = [];
          let match;
          while ((match = regex.exec(text)) !== null) {
            // Clean up the match to remove quotes and JSON syntax
            let cleanMatch = match[1].trim();
            cleanMatch = cleanMatch.replace(/^["']|["']$/g, ''); // Remove quotes
            cleanMatch = cleanMatch.replace(/\\"/g, '"'); // Fix escaped quotes
            
            // Skip if it looks like JSON syntax rather than actual data
            if (cleanMatch.includes('\":') || cleanMatch.includes('PerDay')) {
              continue;
            }
            
            matches.push(cleanMatch);
          }
          return matches;
        };
        
        // Try to extract from unstructured text first
        let medicineNames = extractRegexMatches(medicineNameRegex, extractedText);
        let doses = extractRegexMatches(dosesRegex, extractedText);
        let durations = extractRegexMatches(durationRegex, extractedText);
        let quantities = extractRegexMatches(quantityRegex, extractedText);
        
        // If we found JSON-like properties but couldn't extract properly, try JSON property extraction
        if (medicineNames.length === 0 && extractedText.includes('"name"')) {
          console.log('Attempting to extract from JSON-like format');
          let match;
          
          while ((match = jsonPropertyRegex.exec(extractedText)) !== null) {
            const property = match[1];
            const value = match[2];
            
            console.log('Found JSON property:', property, 'with value:', value);
            
            if (property.toLowerCase().includes('name')) {
              medicineNames.push(value);
            } else if (property.toLowerCase().includes('dose')) {
              doses.push(value);
            } else if (property.toLowerCase().includes('duration')) {
              durations.push(value);
            } else if (property.toLowerCase().includes('quantity')) {
              quantities.push(value);
            }
          }
        }
        
        // Last resort: Try to look for patterns in the text
        if (medicineNames.length === 0) {
          // Try finding capitalized words that might be medicine names
          const capitalsRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
          let matchCapitals;
          while ((matchCapitals = capitalsRegex.exec(extractedText)) !== null) {
            if (!medicineNames.includes(matchCapitals[1]) && 
                !matchCapitals[1].match(/^(Medicine|Name|Duration|Doses|Quantity|Per|Day|Total)$/i)) {
              medicineNames.push(matchCapitals[1]);
            }
          }
        }
        
        console.log('Extracted unstructured data:', { medicineNames, doses, durations, quantities });
        
        // Handle special case for malformed JSON response like in the example
        if (medicineNames.length === 0 && 
            extractedText.includes("medicineNames") && 
            extractedText.includes("doses") && 
            extractedText.includes("durations")) {
          
          console.log("Detected malformed JSON response, attempting special handling");
          
          try {
            // Try to parse the malformed JSON
            let malformedJson = null;
            
            // Clean up common issues in the JSON
            const cleanedText = extractedText
              .replace(/\\"/g, '"') // Fix escaped quotes
              .replace(/,\s*}/g, '}') // Remove trailing commas
              .replace(/([{,])\s*"([^"]+)"\s*:\s*"([^"]+)\\?"/g, '$1"$2":"$3"'); // Fix quote formatting
            
            try {
              malformedJson = JSON.parse(cleanedText);
            } catch (e) {
              // If direct parsing fails, try to extract with regex
              const jsonMatch = extractedText.match(/{[\s\S]*}/);
              if (jsonMatch) {
                try {
                  malformedJson = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                  console.error("Failed to parse extracted JSON:", e2);
                }
              }
            }
            
            if (malformedJson) {
              console.log("Successfully parsed malformed JSON:", malformedJson);
              
              // Extract the arrays
              if (Array.isArray(malformedJson.medicineNames)) {
                medicineNames = malformedJson.medicineNames.filter((name: any) => name && typeof name === 'string');
              }
              
              if (Array.isArray(malformedJson.doses)) {
                doses = malformedJson.doses
                  .filter((dose: any) => dose && typeof dose === 'string')
                  .map((dose: string) => dose.replace(/PerDay\":\s*\"/i, '').replace(/\",?$/, ''));
              }
              
              if (Array.isArray(malformedJson.durations)) {
                durations = malformedJson.durations
                  .filter((duration: any) => duration && typeof duration === 'string')
                  .map((duration: string) => duration.replace(/\":\s*\"/i, '').replace(/\",?$/, ''));
              }
              
              if (Array.isArray(malformedJson.quantities)) {
                quantities = malformedJson.quantities
                  .filter((quantity: any) => quantity && typeof quantity === 'string')
                  .map((quantity: string) => quantity.replace(/\":\s*\"/i, '').replace(/\",?$/, ''));
              }
              
              console.log("Cleaned data arrays:", { medicineNames, doses, durations, quantities });
            }
          } catch (err) {
            console.error("Failed special handling for malformed JSON:", err);
          }
        }
        
        // Ensure we have the same number of items for all properties
        const maxItems = Math.max(
          medicineNames.length || 0, 
          doses.length || 0, 
          durations.length || 0, 
          quantities.length || 0
        );
        
        // If we have medication data but no names, create generic names
        if (maxItems > 0 && medicineNames.length === 0) {
          console.log("Found medication data but no names, creating default names");
          
          // Look for common medicine indicators in the text to improve naming
          const commonMeds = [
            "Aspirin", "Ibuprofen", "Acetaminophen", "Paracetamol", "Naproxen", 
            "Lisinopril", "Atorvastatin", "Metformin", "Amlodipine", "Metoprolol",
            "Levothyroxine", "Simvastatin", "Omeprazole", "Azithromycin", "Amoxicillin"
          ];
          
          for (let i = 0; i < maxItems; i++) {
            // Try to find a relevant medicine name in the text
            let medFound = false;
            
            for (const med of commonMeds) {
              if (extractedText.toLowerCase().includes(med.toLowerCase())) {
                if (!medicineNames.includes(med)) {
                  medicineNames.push(med);
                  medFound = true;
                  break;
                }
              }
            }
            
            // If no medicine found, use a generic name
            if (!medFound) {
              medicineNames.push(`Medication ${i + 1}`);
            }
          }
        }
        
        if (maxItems === 0) {
          console.warn('No medication data could be extracted');
        } else {
          // Create medication objects, ensuring we have enough placeholder values
          for (let i = 0; i < maxItems; i++) {
            const name = medicineNames[i] || `Medication ${i+1}`;
            const dosesPerDay = doses[i] || 'Not specified';
            const duration = durations[i] || 'Not specified';
            const totalQuantity = quantities[i] || 'Not specified';
            
            // Check if this is a confirmed medicine name (not auto-generated)
            const isConfirmedName = name && !name.match(/^Medication \d+$/);
            
            medications.push({
              name,
              dosesPerDay,
              duration,
              totalQuantity,
              isConfirmedName // Add this flag to the medication object
            });
          }
        }
        
        console.log('Created medications from unstructured text:', medications);
      }
    } catch (error) {
      console.warn('Failed to parse structured data from Gemini response:', error);
      console.error('Parse error details:', error);
      // Fall back to treating the entire response as raw text
    }
    
    // Process the text to extract medical terms
    const { text, detectedTerms } = extractMedicalTerms(rawText);

    return {
      text,
      confidence: 95, // Gemini doesn't provide confidence scores, so we use a high default
      processingTime,
      sourceLanguage: 'eng',
      detectedMedicalTerms: detectedTerms,
      words: splitIntoWords(text).map(word => ({ 
        text: word, 
        confidence: 95 
      })),
      provider: 'gemini',
      medications
    };
  } catch (error) {
    console.error('Gemini API processing error:', error);
    throw new Error(`Gemini OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract medical terms from text
 */
const extractMedicalTerms = (text: string): { text: string; detectedTerms: string[] } => {
  const medicalDict: Record<string, string> = {
    'mg': 'mg',
    'ml': 'ml',
    'mcg': 'mcg',
    'tsp': 'teaspoon',
    'tbsp': 'tablespoon',
    'bid': 'twice daily',
    'tid': 'three times daily',
    'qid': 'four times daily',
    'qd': 'once daily',
    'po': 'by mouth',
    'prn': 'as needed'
  };
  
  const detectedTerms: string[] = [];
  
  // Detect medical terms in text
  Object.keys(medicalDict).forEach(term => {
    if (new RegExp(`\\b${term}\\b`, 'i').test(text)) {
      detectedTerms.push(term);
    }
  });
  
  // Look for dosage patterns
  const dosageRegex = /\b(\d+(?:\.\d+)?)\s*(mg|ml|mcg|g|unit|tablet|capsule|dose|pill)s?\b/gi;
  let match;
  while ((match = dosageRegex.exec(text)) !== null) {
    const unit = match[2].toLowerCase();
    if (!detectedTerms.includes(unit)) {
      detectedTerms.push(unit);
    }
  }
  
  return { text, detectedTerms };
};

/**
 * Split text into words for word-level details
 */
const splitIntoWords = (text: string): string[] => {
  return text.trim().split(/\s+/).filter(Boolean);
}; 