import { createWorker, createScheduler, PSM, OEM } from 'tesseract.js';
import { RecognizedText, OCROptions } from '../types';
import { checkNetworkStatus, testNetworkConnection } from './network';
import { processWithGemini } from './geminiOcr';

// Apply image preprocessing to improve OCR accuracy
const preprocessImage = async (image: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Set dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply preprocessing: convert to grayscale and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Increase contrast
          const newValue = avg < 120 ? 0 : 255;
          
          data[i] = newValue;     // R
          data[i + 1] = newValue; // G
          data[i + 2] = newValue; // B
        }
        
        // Put processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob/file
        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], 'processed-' + image.name, { 
              type: 'image/png', 
              lastModified: Date.now() 
            });
            resolve(processedFile);
          } else {
            reject(new Error('Canvas conversion failed'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for preprocessing'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
  });
};

// Local OCR processing using Tesseract.js
export const performLocalOCR = async (
  image: File, 
  options: OCROptions = {}
): Promise<RecognizedText> => {
  // Default options
  const {
    languages = ['eng'],
    preprocess = true,
    medicalTerms = true,
    psm = PSM.AUTO
  } = options;
  
  const startTime = performance.now();
  
  // Create scheduler for potential multiple workers
  const scheduler = createScheduler();
  
  // Process the image if requested
  const imageToProcess = preprocess ? await preprocessImage(image) : image;
  
  try {
    // Create workers for each language
    for (const lang of languages) {
      const worker = await createWorker(lang);
      await worker.setParameters({
        tessedit_pageseg_mode: psm,
        tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
        preserve_interword_spaces: '1',
      });
      
      // Add worker to scheduler
      scheduler.addWorker(worker);
    }
    
    // Perform OCR
    const results = await scheduler.addJob('recognize', imageToProcess);
    
    // Extract text based on highest confidence
    let bestResult = results.data;
    
    // Extract individual words with their confidence
    const words = bestResult.words?.map(word => ({
      text: word.text,
      confidence: word.confidence,
      boundingBox: word.bbox ? {
        x0: word.bbox.x0,
        y0: word.bbox.y0,
        x1: word.bbox.x1,
        y1: word.bbox.y1
      } : undefined
    })) || [];
    
    // Apply medical terminology post-processing if requested
    let text = bestResult.text;
    let detectedMedicalTerms: string[] = [];
    if (medicalTerms) {
      const processed = enhanceMedicalTermsWithDetection(text);
      text = processed.text;
      detectedMedicalTerms = processed.detectedTerms;
    }
    
    const processingTime = (performance.now() - startTime) / 1000;
    
    return {
      text,
      confidence: bestResult.confidence,
      words,
      sourceLanguage: languages[0],
      detectedMedicalTerms,
      processingTime,
      provider: 'local'
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('OCR processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    // Terminate all workers
    await scheduler.terminate();
  }
};

// Main OCR function with enhanced capabilities and smart fallback
export const performOCR = async (
  image: File, 
  options: OCROptions = {}
): Promise<RecognizedText & { usingFallback?: boolean }> => {
  const { preferOnline = true } = options;
  
  // Check if network is available
  const isOnline = checkNetworkStatus();
  
  try {
    // If network is available and online OCR is preferred, try Gemini API first
    if (isOnline && preferOnline) {
      // Double-check connectivity with a real network request
      const hasRealConnection = await testNetworkConnection();
      
      if (hasRealConnection) {
        try {
          console.log('Using Gemini API for OCR processing');
          const result = await processWithGemini(image);
          return result;
        } catch (error) {
          console.warn('Gemini OCR failed, falling back to local OCR:', error);
          // Fall back to local OCR
          const localResult = await performLocalOCR(image, options);
          return { ...localResult, usingFallback: true };
        }
      }
    }
    
    // Default to local OCR (offline or online not preferred)
    console.log('Using local OCR processing');
    return await performLocalOCR(image, options);
    
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('OCR processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Helper function to improve medical term recognition and return detected terms
const enhanceMedicalTermsWithDetection = (text: string): { text: string; detectedTerms: string[] } => {
  // Common medical abbreviations and their full forms
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
  
  // Common OCR errors in medical terms
  const commonErrors: Record<string, string> = {
    'rng': 'mg',
    'rncg': 'mcg',
    'mL': 'ml',
    'rnl': 'ml',
    'tablespaan': 'tablespoon',
    'teaspoan': 'teaspoon'
  };
  
  let processedText = text;
  const detectedTerms: string[] = [];
  
  // Detect medical terms in text
  Object.keys(medicalDict).forEach(term => {
    if (new RegExp(`\\b${term}\\b`, 'i').test(text)) {
      detectedTerms.push(term);
    }
  });
  
  // Correct common OCR errors and detect the original terms
  Object.entries(commonErrors).forEach(([error, correction]) => {
    const regex = new RegExp(error, 'gi');
    if (regex.test(processedText)) {
      processedText = processedText.replace(regex, correction);
      if (!detectedTerms.includes(correction)) {
        detectedTerms.push(correction);
      }
    }
  });
  
  // Look for dosage patterns (numbers followed by units)
  const dosageRegex = /\b(\d+(?:\.\d+)?)\s*(mg|ml|mcg|g|unit|tablet|capsule|dose|pill)s?\b/gi;
  let match;
  while ((match = dosageRegex.exec(processedText)) !== null) {
    // const fullDosage = match[0];
    const unit = match[2].toLowerCase();
    if (!detectedTerms.includes(unit)) {
      detectedTerms.push(unit);
    }
  }
  
  return { text: processedText, detectedTerms };
};

// Batch processing function for multiple images
export const batchProcessOCR = async (
  images: File[], 
  options: OCROptions = {}
): Promise<(RecognizedText & { usingFallback?: boolean })[]> => {
  const results: (RecognizedText & { usingFallback?: boolean })[] = [];
  
  for (const image of images) {
    try {
      const result = await performOCR(image, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process image ${image.name}:`, error);
      results.push({
        text: `Error processing ${image.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        confidence: 0,
        provider: 'local'
      });
    }
  }
  
  return results;
};