import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Maximize, Minimize, BookOpen, CloudLightning, CloudOff } from 'lucide-react';
import { ProcessingStatus, RecognizedText } from '../types';
import { generatePDF } from '../utils/pdf';

interface TextDisplayProps {
  recognizedText: (RecognizedText & { usingFallback?: boolean }) | null;
  status: ProcessingStatus;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ recognizedText, status }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [highlightMedical, setHighlightMedical] = useState(true);

  if (status === ProcessingStatus.IDLE) {
    return null;
  }

  const handleCopyText = () => {
    if (recognizedText?.text) {
      navigator.clipboard.writeText(recognizedText.text);
    }
  };

  const handleDownloadPDF = () => {
    if (recognizedText?.text) {
      generatePDF(recognizedText.text);
    }
  };

  // Helper function to highlight medical terms in text
  const highlightMedicalTerms = (text: string): JSX.Element => {
    if (!recognizedText?.detectedMedicalTerms || !highlightMedical) {
      return <>{text}</>;
    }

    // Sort terms by length (longest first) to prevent partial matches
    const terms = [...(recognizedText.detectedMedicalTerms || [])].sort(
      (a, b) => b.length - a.length
    );
    
    if (terms.length === 0) return <>{text}</>;
    
    const parts: { text: string; isMedical: boolean }[] = [{ text, isMedical: false }];
    
    terms.forEach(term => {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.isMedical) continue;
        
        const termLower = term.toLowerCase();
        const textLower = part.text.toLowerCase();
        const index = textLower.indexOf(termLower);
        
        if (index !== -1) {
          const before = part.text.substring(0, index);
          const match = part.text.substring(index, index + term.length);
          const after = part.text.substring(index + term.length);
          
          const newParts = [];
          if (before) newParts.push({ text: before, isMedical: false });
          newParts.push({ text: match, isMedical: true });
          if (after) newParts.push({ text: after, isMedical: false });
          
          // Replace the current part with the new parts
          parts.splice(i, 1, ...newParts);
          
          // Adjust index to account for the new parts
          i += newParts.length - 1;
        }
      }
    });
    
    // Filter out null entries and render with highlighting
    return (
      <>
        {parts.filter(Boolean).map((part, i) => 
          part.isMedical ? (
            <span key={i} className="bg-primary-100 text-primary-800 px-1 rounded">
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </>
    );
  };

  const getContentByStatus = () => {
    switch (status) {
      case ProcessingStatus.LOADING:
        return (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-primary-400 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-neutral-600 font-medium">Processing your prescription...</p>
            <p className="text-neutral-500 text-sm mt-2">This may take a few moments</p>
          </div>
        );
      
      case ProcessingStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-error-50 flex items-center justify-center mb-4">
              <span className="text-2xl text-error-500">!</span>
            </div>
            <h3 className="text-error-700 font-medium">Failed to process image</h3>
            <p className="text-neutral-600 text-sm mt-2 max-w-md">
              We couldn't extract text from this image. Try uploading a clearer image with good lighting and contrast.
            </p>
          </div>
        );
      
      case ProcessingStatus.SUCCESS:
        if (!recognizedText || !recognizedText.text.trim()) {
          return (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-warning-50 flex items-center justify-center mb-4">
                <span className="text-xl text-warning-500">?</span>
              </div>
              <h3 className="text-warning-700 font-medium">No text detected</h3>
              <p className="text-neutral-600 text-sm mt-2 max-w-md">
                We couldn't find any text in this image. Try uploading a clearer image with visible text.
              </p>
            </div>
          );
        }
        
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-neutral-800">Extracted Text</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-neutral-500">
                    Confidence: {Math.round(recognizedText.confidence)}%
                  </p>
                  {recognizedText.processingTime && (
                    <p className="text-xs text-neutral-500">
                      • Processed in {recognizedText.processingTime.toFixed(2)}s
                    </p>
                  )}
                  {recognizedText.sourceLanguage && (
                    <p className="text-xs text-neutral-500">
                      • Language: {recognizedText.sourceLanguage}
                    </p>
                  )}
                  {recognizedText.provider && (
                    <p className={`text-xs flex items-center gap-1 ${
                      recognizedText.provider === 'gemini' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-amber-600 bg-amber-50'
                      } px-2 py-0.5 rounded-full`}>
                      {recognizedText.provider === 'gemini' ? (
                        <>
                          <CloudLightning size={12} />
                          <span>AI-Powered</span>
                        </>
                      ) : (
                        <>
                          <CloudOff size={12} />
                          <span>Local Processing</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {recognizedText.detectedMedicalTerms && recognizedText.detectedMedicalTerms.length > 0 && (
                  <button
                    onClick={() => setHighlightMedical(!highlightMedical)}
                    className={`p-2 rounded-full ${
                      highlightMedical 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-neutral-100 text-neutral-700'
                    } hover:bg-primary-200 transition-colors`}
                    title={highlightMedical ? 'Hide medical terms' : 'Highlight medical terms'}
                  >
                    <BookOpen size={18} />
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  title={showDetails ? 'Hide details' : 'Show details'}
                >
                  {showDetails ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
                <button
                  onClick={handleCopyText}
                  className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  title="Copy text"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="p-2 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
                  title="Download as PDF"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-neutral-800 min-h-[200px] max-h-[400px] overflow-y-auto">
              {highlightMedical && recognizedText.detectedMedicalTerms
                ? highlightMedicalTerms(recognizedText.text)
                : recognizedText.text}
            </div>

            {showDetails && recognizedText.words && recognizedText.words.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Word Details</h4>
                <div className="bg-white border border-neutral-200 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-3 text-left font-medium text-neutral-600">Word</th>
                        <th className="py-2 px-3 text-right font-medium text-neutral-600">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recognizedText.words.map((word, index) => (
                        <tr key={index} className="border-b border-neutral-100">
                          <td className="py-2 px-3 text-neutral-800">{word.text}</td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end">
                              <span className={`inline-block mr-2 ${
                                word.confidence >= 90 ? 'text-green-600' :
                                word.confidence >= 70 ? 'text-primary-600' :
                                'text-error-600'
                              }`}>
                                {Math.round(word.confidence)}%
                              </span>
                              <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    word.confidence >= 90 ? 'bg-green-500' :
                                    word.confidence >= 70 ? 'bg-primary-500' :
                                    'bg-error-500'
                                  }`}
                                  style={{ width: `${Math.round(word.confidence)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-neutral-50 rounded-lg shadow-card overflow-hidden mt-6"
    >
      {getContentByStatus()}
    </motion.div>
  );
};

export default TextDisplay;