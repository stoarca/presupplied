import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface ErrorInfo {
  code?: string;
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

interface ErrorContextType {
  showError: (error: ErrorInfo | string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [open, setOpen] = useState(false);

  const showError = useCallback((error: ErrorInfo | string) => {
    if (typeof error === 'string') {
      setError({ message: error, severity: 'error' });
    } else {
      setError({ ...error, severity: error.severity || 'error' });
    }
    setOpen(true);
  }, []);

  const clearError = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    clearError();
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={error?.severity || 'error'}
          sx={{ width: '100%' }}
        >
          {error?.code && (
            <AlertTitle>Error Code: {error.code}</AlertTitle>
          )}
          {error?.message}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
};