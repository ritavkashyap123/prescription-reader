import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileScan, Settings2, List, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import TextDisplay from './TextDisplay';
import { performOCR, batchProcessOCR } from '../utils/ocr';
import { ProcessingStatus, RecognizedText } from '../types';
import { checkNetworkStatus, setupNetworkListener } from '../utils/network';

interface OCRSettings {
  languages: string[];
  preprocess: boolean;
  medicalTerms: boolean;
  preferOnline: boolean;
}

// Extend RecognizedText with the usingFallback property for our UI
type ExtendedRecognizedText = RecognizedText & { usingFallback?: boolean };

const MainCard: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [recognizedText, setRecognizedText] = useState<ExtendedRecognizedText | null>(null);
  const [batchResults, setBatchResults] = useState<ExtendedRecognizedText[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBatchResults, setShowBatchResults] = useState<boolean>(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(checkNetworkStatus());
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [settings, setSettings] = useState<OCRSettings>({
    languages: ['eng'],
    preprocess: true,
    medicalTerms: true,
    preferOnline: true,
  });

  // Monitor network status
  useEffect(() => {
    const cleanup = setupNetworkListener(
      () => setIsOnline(true),
      () => setIsOnline(false)
    );
    
    return cleanup;
  }, []);

  const handleImageSelect = async (file: File) => {
    try {
      setStatus(ProcessingStatus.LOADING);
      setShowBatchResults(false);
      setBatchResults([]);
      setUsingFallback(false);
      
      const result = await performOCR(file, {
        languages: settings.languages,
        preprocess: settings.preprocess,
        medicalTerms: settings.medicalTerms,
        preferOnline: settings.preferOnline
      });
      
      setRecognizedText(result);
      setUsingFallback(!!result.usingFallback);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error) {
      console.error('OCR processing failed:', error);
      setStatus(ProcessingStatus.ERROR);
    }
  };
  
  const handleBatchSelect = async (files: File[]) => {
    if (files.length === 0) return;
    
    try {
      setStatus(ProcessingStatus.LOADING);
      setUsingFallback(false);
      
      const results = await batchProcessOCR(files, {
        languages: settings.languages,
        preprocess: settings.preprocess,
        medicalTerms: settings.medicalTerms,
        preferOnline: settings.preferOnline
      });
      
      setBatchResults(results);
      
      // Check if any results used fallback
      const anyFallback = results.some(r => r.usingFallback);
      setUsingFallback(anyFallback);
      
      // Display the first result
      if (results.length > 0) {
        setRecognizedText(results[0]);
        setCurrentBatchIndex(0);
        setShowBatchResults(true);
      }
      
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error) {
      console.error('Batch OCR processing failed:', error);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const toggleLanguage = (lang: string) => {
    setSettings(prev => {
      const newLanguages = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      
      // Always ensure at least one language is selected
      return {
        ...prev,
        languages: newLanguages.length > 0 ? newLanguages : ['eng']
      };
    });
  };
  
  const showBatchResult = (index: number) => {
    if (index >= 0 && index < batchResults.length) {
      setRecognizedText(batchResults[index]);
      setCurrentBatchIndex(index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-card p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
        <div className="bg-primary-100 p-2 rounded-full mr-3">
          <FileScan size={24} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Prescription Reader</h2>
          <p className="text-neutral-500 text-sm">Upload a prescription to extract text</p>
        </div>
      </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="text-xs flex items-center text-green-600 bg-green-50 py-1 px-2 rounded-full">
              <Wifi size={14} className="mr-1" />
              <span>Online</span>
            </div>
          ) : (
            <div className="text-xs flex items-center text-amber-600 bg-amber-50 py-1 px-2 rounded-full">
              <WifiOff size={14} className="mr-1" />
              <span>Offline</span>
            </div>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Settings"
          >
            <Settings2 size={20} className="text-neutral-600" />
          </button>
        </div>
      </div>

      {showSettings && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-neutral-50 rounded-lg"
        >
          <h3 className="font-medium text-neutral-800 mb-2">OCR Settings</h3>
          
          <div className="mb-3">
            <p className="text-sm text-neutral-600 mb-1">Languages</p>
            <div className="flex flex-wrap gap-2">
              {['eng', 'spa', 'fra', 'deu'].map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    settings.languages.includes(lang)
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {lang === 'eng' ? 'English' : 
                   lang === 'spa' ? 'Spanish' : 
                   lang === 'fra' ? 'French' : 
                   lang === 'deu' ? 'German' : lang}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="flex items-center text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={settings.preprocess}
                onChange={() => setSettings(prev => ({ ...prev, preprocess: !prev.preprocess }))}
                className="mr-2 h-4 w-4"
              />
              Image Preprocessing
            </label>
            
            <label className="flex items-center text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={settings.medicalTerms}
                onChange={() => setSettings(prev => ({ ...prev, medicalTerms: !prev.medicalTerms }))}
                className="mr-2 h-4 w-4"
              />
              Medical Terms Enhancement
            </label>
            
            <label className="flex items-center text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={settings.preferOnline}
                onChange={() => setSettings(prev => ({ ...prev, preferOnline: !prev.preferOnline }))}
                className="mr-2 h-4 w-4"
                disabled={!isOnline}
              />
              Use Gemini AI OCR when online
              {!isOnline && (
                <span className="ml-2 text-xs text-amber-600">
                  (Unavailable offline)
                </span>
              )}
            </label>
          </div>
        </motion.div>
      )}

      <ImageUploader 
        onImageSelect={handleImageSelect} 
        onBatchSelect={handleBatchSelect}
        status={status} 
      />
      
      <AnimatePresence>
        {usingFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start"
          >
            <AlertTriangle size={18} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Using local OCR (reduced quality)</p>
              <p className="text-xs text-amber-700 mt-1">
                {isOnline 
                  ? "The Gemini AI OCR service couldn't process this image. Using local OCR as fallback."
                  : "You're currently offline. Using local OCR with reduced quality."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showBatchResults && batchResults.length > 0 && (
        <div className="mt-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <List size={16} className="text-neutral-500 mr-2" />
              <span className="text-sm text-neutral-700 font-medium">
                Batch Results ({currentBatchIndex + 1} of {batchResults.length})
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => showBatchResult(currentBatchIndex - 1)}
                disabled={currentBatchIndex === 0}
                className="px-2 py-1 text-xs rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => showBatchResult(currentBatchIndex + 1)}
                disabled={currentBatchIndex === batchResults.length - 1}
                className="px-2 py-1 text-xs rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
          <div className="flex overflow-x-auto py-2 mt-2 -mx-2 px-2 space-x-2">
            {batchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => showBatchResult(index)}
                className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium 
                  ${index === currentBatchIndex 
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-300' 
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }
                  ${result.usingFallback ? 'ring-1 ring-amber-400' : ''}
                `}
              >
                {index + 1}
                {result.usingFallback && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <TextDisplay recognizedText={recognizedText} status={status} />
    </motion.div>
  );
};

export default MainCard;