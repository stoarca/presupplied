import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { typedFetch, API_HOST } from '../typedFetch';
import { useUserContext } from '../UserContext';
import { UserType } from '../../../common/types';
import { ChildEditorStep1 } from './ChildEditorStep1';
import { ChildEditorStep2 } from './ChildEditorStep2';

interface ChildProfileEditorProps {
  mode: 'create' | 'edit';
  initialData?: {
    name: string;
    pinRequired: boolean;
    pin: string;
    avatarPath: string;
    avatarColor: string;
  };
  childId?: string;
  onComplete: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const ChildProfileEditor = ({
  mode,
  initialData,
  childId,
  onComplete,
  showCloseButton = false,
  onClose
}: ChildProfileEditorProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childData, setChildData] = useState(initialData || {
    name: '',
    pinRequired: false,
    pin: '',
    avatarPath: '/static/images/avatars/elephant.png',
    avatarColor: '#88D8B0'
  });
  const user = useUserContext();

  const handleDataChange = (field: string, value: string | boolean) => {
    setChildData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!user.dto) {
      return;
    }

    setLoading(true);
    setError(null);

    const profilePicture = {
      image: childData.avatarPath,
      background: childData.avatarColor
    };

    try {
      if (mode === 'create') {
        const response = await typedFetch({
          host: API_HOST,
          endpoint: '/api/children',
          method: 'post',
          body: {
            name: childData.name,
            pin: childData.pin || undefined,
            pinRequired: childData.pinRequired,
            profilePicture
          }
        });

        if ('success' in response && response.success) {
          onComplete();
        } else if ('errorCode' in response) {
          setError(response.message);
        }
      } else {
        const response = await typedFetch({
          host: API_HOST,
          endpoint: '/api/users/:id',
          method: 'post',
          params: { id: childId! },
          body: {
            name: childData.name.trim(),
            profilePicture
          }
        });

        if ('success' in response && response.success) {
          onComplete();
        } else {
          setError('Failed to update child profile. Please try again.');
        }
      }
    } catch (err) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} child profile:`, err);
      setError(`Failed to ${mode === 'create' ? 'create' : 'update'} child profile. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 0, my: 0 }}>
      <Paper elevation={3} sx={{ p: 4, position: 'relative', my: 0 }}>
        {showCloseButton && onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {step === 1 ? (
          <ChildEditorStep1
            childData={childData}
            onDataChange={handleDataChange}
            onNext={handleNextStep}
            error={error}
            userType={user.dto?.type || UserType.PARENT}
            editMode={mode === 'edit'}
          />
        ) : (
          <ChildEditorStep2
            childData={childData}
            onDataChange={handleDataChange}
            onBack={handleBackStep}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            editMode={mode === 'edit'}
          />
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <div>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box
                sx={{
                  width: 30,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: step === 1 ? 'primary.main' : 'grey.300',
                  transition: 'background-color 0.3s'
                }}
              />
              <Box
                sx={{
                  width: 30,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: step === 2 ? 'primary.main' : 'grey.300',
                  transition: 'background-color 0.3s'
                }}
              />
            </Box>
          </div>
        </Box>
      </Paper>
    </Container>
  );
};