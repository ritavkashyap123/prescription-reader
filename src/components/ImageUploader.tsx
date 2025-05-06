import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProcessingStatus } from '../types';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onBatchSelect?: (files: File[]) => void;
  status: ProcessingStatus;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onBatchSelect, status }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchFiles, setBatchFiles] = useState<{ file: File; preview: string }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    if (batchMode) {
      // Handle batch mode
      const newBatchFiles = [...batchFiles];
      
      acceptedFiles.forEach(file => {
        // Create previews for each new file
        const preview = URL.createObjectURL(file);
        newBatchFiles.push({ file, preview });
      });
      
      setBatchFiles(newBatchFiles);
    } else {
      // Handle single file mode
      const file = acceptedFiles[0];
      onImageSelect(file);
      
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }, [onImageSelect, batchMode, batchFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: batchMode ? undefined : 1,
    disabled: status === ProcessingStatus.LOADING
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
  };
  
  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    if (batchFiles.length > 0) {
      // Clean up previews
      batchFiles.forEach(item => URL.revokeObjectURL(item.preview));
      setBatchFiles([]);
    }
  };
  
  const removeBatchFile = (index: number) => {
    const newBatchFiles = [...batchFiles];
    URL.revokeObjectURL(newBatchFiles[index].preview);
    newBatchFiles.splice(index, 1);
    setBatchFiles(newBatchFiles);
  };
  
  const clearAllBatchFiles = () => {
    batchFiles.forEach(item => URL.revokeObjectURL(item.preview));
    setBatchFiles([]);
  };
  
  const processBatchFiles = () => {
    if (onBatchSelect && batchFiles.length > 0) {
      onBatchSelect(batchFiles.map(item => item.file));
    }
  };
  
  // Clean up URLs on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      batchFiles.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [previewUrl, batchFiles]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-neutral-600">
          Upload {batchMode ? 'Multiple Images' : 'Image'}
        </div>
        <button
          onClick={toggleBatchMode}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            batchMode 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {batchMode ? 'Single Mode' : 'Batch Mode'}
        </button>
      </div>
      
      {!batchMode && (
        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-lg p-6 transition-all duration-300
            ${isDragActive 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-neutral-300 hover:border-primary-300 hover:bg-primary-50/30'
            }
            ${status === ProcessingStatus.LOADING ? 'opacity-70 pointer-events-none' : ''}
            ${previewUrl ? 'h-64 md:h-80' : 'h-40 md:h-48'}
          `}
        >
          <input {...getInputProps()} />
          
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <button 
                onClick={clearImage}
                className="absolute right-3 top-3 bg-neutral-800/70 text-white rounded-full p-1 z-10
                  hover:bg-error-500 transition-colors duration-200"
              >
                <X size={16} />
              </button>
              <img 
                src={previewUrl} 
                alt="Prescription preview" 
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className={`
                rounded-full p-3 mb-4
                ${isDragActive ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}
              `}>
                <Upload size={24} />
              </div>
              <p className="text-lg font-medium text-neutral-700">
                {isDragActive ? 'Drop your prescription here' : 'Drag & drop prescription image'}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                or click to browse files
              </p>
              <p className="text-xs text-neutral-400 mt-4 max-w-md">
                Accepted formats: JPG, PNG, WEBP, GIF, BMP
              </p>
            </div>
          )}
        </div>
      )}
      
      {batchMode && (
        <div className="space-y-3">
          <div
            {...getRootProps()}
            className={`
              relative cursor-pointer border-2 border-dashed rounded-lg p-4 transition-all duration-300
              ${isDragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-neutral-300 hover:border-primary-300 hover:bg-primary-50/30'
              }
              ${status === ProcessingStatus.LOADING ? 'opacity-70 pointer-events-none' : ''}
              h-24
            `}
          >
            <input {...getInputProps()} />
            <div className="h-full flex items-center justify-center text-center">
              <div className={`
                rounded-full p-2 mr-3
                ${isDragActive ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}
              `}>
                <Plus size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  {isDragActive ? 'Drop to add images' : 'Add prescription images'}
                </p>
                <p className="text-xs text-neutral-500">
                  or click to browse files
                </p>
              </div>
            </div>
          </div>
          
          {batchFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-neutral-600">{batchFiles.length} images selected</p>
                <div className="flex gap-2">
                  <button
                    onClick={clearAllBatchFiles}
                    className="text-xs px-2 py-1 rounded flex items-center gap-1 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                  <button
                    onClick={processBatchFiles}
                    disabled={status === ProcessingStatus.LOADING}
                    className="text-xs px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Process All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                {batchFiles.map((item, index) => (
                  <div key={index} className="relative h-24 border rounded overflow-hidden group">
                    <img 
                      src={item.preview} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeBatchFile(index)}
                      className="absolute top-1 right-1 bg-neutral-800/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-neutral-800/70 text-white text-xs py-1 px-2 truncate">
                      {item.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ImageUploader;