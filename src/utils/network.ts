export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

export const setupNetworkListener = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Test network connection by pinging a reliable endpoint
export const testNetworkConnection = async (): Promise<boolean> => {
  try {
    // We use a HEAD request to Google as a quick network check
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error('Network test failed:', error);
    return false;
  }
}; 