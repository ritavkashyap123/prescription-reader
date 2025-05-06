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
              text: "Extract all the text from this prescription or medical document. Return only the raw text content without any comments, formatting or analysis."
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

    console.log(baseUrl);

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
    
    // Process the text to extract medical terms
    const { text, detectedTerms } = extractMedicalTerms(extractedText);

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
      provider: 'gemini'
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