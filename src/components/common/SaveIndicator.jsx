import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

const SaveIndicator = ({ isSaving, hasError, errorMessage }) => {
  const [displayStatus, setDisplayStatus] = useState(null); // null, 'saving', 'saved', 'error'
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (isSaving) {
      setDisplayStatus('saving');
      setDisplayMessage('Saving changes...');
    } else if (hasError && errorMessage) {
      setDisplayStatus('error');
      setDisplayMessage(errorMessage);
    } else if (!isSaving && !hasError && displayStatus === 'saving') {
      // Saving just completed successfully
      setDisplayStatus('saved');
      setDisplayMessage('All changes saved!');
      const timer = setTimeout(() => {
        setDisplayStatus(null);
        setDisplayMessage('');
      }, 1000); // Display "Saved!" for 1 seconds
      return () => clearTimeout(timer);
    } else if (!isSaving && !hasError && displayStatus === 'error') {
        // Error was cleared, hide after a short delay
        const timer = setTimeout(() => {
            setDisplayStatus(null);
            setDisplayMessage('');
        }, 1000); // Hide error message faster
        return () => clearTimeout(timer);
    } else {
      setDisplayStatus(null);
      setDisplayMessage('');
    }
  }, [isSaving, hasError, errorMessage]);

  if (!displayStatus) {
    return <div className="min-h-[40px] flex items-center justify-center"></div>; // Maintain space
  }

  return (
    <div className="min-h-[40px] flex items-center justify-center">
      {displayStatus === 'saving' && (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center">
          <FaSpinner className="mr-2 text-blue-600 animate-spin" />
          <p className="text-sm text-blue-600">{displayMessage}</p>
        </div>
      )}

      {displayStatus === 'saved' && (
        <div className="p-2 bg-green-50 border border-green-200 rounded-md flex items-center">
          <p className="text-sm text-green-600">{displayMessage}</p>
        </div>
      )}

      {displayStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <FaSpinner className="mr-2 text-red-600 animate-spin" />
          <p className="text-sm text-red-600">{displayMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SaveIndicator;