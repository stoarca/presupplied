import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { typedFetch, API_HOST } from '../typedFetch';
import { RelationshipType } from '../../../common/types';

interface InviteAdultProps {
  childId: number;
  childName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteAdult = ({ childId, childName, open, onClose, onSuccess }: InviteAdultProps) => {
  const [email, setEmail] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(RelationshipType.OBSERVER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null);
  };

  const handleRelationshipTypeChange = (event: any) => {
    setRelationshipType(event.target.value as RelationshipType);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/invitations',
        method: 'post',
        body: {
          childId,
          inviteeEmail: email.trim(),
          relationshipType,
        }
      });

      if ('success' in response && response.success) {
        setEmail('');
        setRelationshipType(RelationshipType.OBSERVER);
        onSuccess();
      } else if ('message' in response) {
        setError(response.message);
      } else {
        setError('Failed to send invitation. Please try again.');
      }
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while sending the invitation.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setRelationshipType(RelationshipType.OBSERVER);
      setError(null);
      onClose();
    }
  };

  const getRelationshipDescription = (type: RelationshipType) => {
    switch (type) {
      case RelationshipType.PRIMARY:
        return 'Can manage the child and invite other adults';
      case RelationshipType.SECONDARY:
        return 'Can manage the child but cannot modify relationships';
      case RelationshipType.OBSERVER:
        return 'Can view progress but cannot modify anything';
      default:
        return '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      data-test="invite-dialog"
    >
      <DialogTitle sx={{ color: 'text.primary' }}>
        Invite Adult to Manage {childName}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            inputProps={{ 'data-test': 'invite-email-input' }}
            sx={{ mb: 3 }}
            placeholder="Enter the adult's email address"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Relationship Type</InputLabel>
            <Select
              value={relationshipType}
              onChange={handleRelationshipTypeChange}
              disabled={isLoading}
              label="Relationship Type"
              inputProps={{ 'data-test': 'relationship-type-select' }}
            >
              <MenuItem value={RelationshipType.PRIMARY} data-test="relationship-option-primary">
                Primary Caretaker
              </MenuItem>
              <MenuItem value={RelationshipType.SECONDARY} data-test="relationship-option-secondary">
                Secondary Caretaker
              </MenuItem>
              <MenuItem value={RelationshipType.OBSERVER} data-test="relationship-option-observer">
                Observer
              </MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {getRelationshipDescription(relationshipType)}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !email.trim()}
          data-test="send-invitation-button"
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Sending...
            </>
          ) : (
            'Send Invitation'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
