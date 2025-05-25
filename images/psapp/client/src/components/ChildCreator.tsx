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
import { ChildCreatorStep1 } from './ChildCreatorStep1';
import { ChildCreatorStep2 } from './ChildCreatorStep2';

interface ChildCreatorProps {
  onComplete: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const ChildCreator = ({ onComplete, showCloseButton = false, onClose }: ChildCreatorProps) => {
  const [step, setStep] = useState(1); // Step 1: Name and PIN, Step 2: Avatar and Color
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childData, setChildData] = useState({
    name: '',
    pinRequired: false,
    pin: '',
    avatarPath: '/static/images/avatars/elephant.png', // Default avatar
    avatarColor: '#88D8B0' // Default green color
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

  const handleCreateChild = async () => {
    if (!user.dto) {return;}

    setLoading(true);
    setError(null);

    // Prepare profile picture information with image and background
    const profilePicture = {
      image: childData.avatarPath,
      background: childData.avatarColor
    };

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/user/children',
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
    } catch (err) {
      console.error('Error creating child account:', err);
      setError('Failed to create child account. Please try again.');
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
          <ChildCreatorStep1
            childData={childData}
            onDataChange={handleDataChange}
            onNext={handleNextStep}
            error={error}
            userType={user.dto?.type || UserType.PARENT}
          />
        ) : (
          <ChildCreatorStep2
            childData={childData}
            onDataChange={handleDataChange}
            onBack={handleBackStep}
            onSubmit={handleCreateChild}
            loading={loading}
            error={error}
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