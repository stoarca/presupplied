import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';

export const GeneralSettings = () => {
  const user = useUserContext();
  const [name, setName] = useState(user.dto?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user.dto) {
      return;
    }

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    if (name.trim() === user.dto.name) {
      setMessage({ type: 'error', text: 'Please enter a different name' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/users/:id',
        method: 'post',
        params: { id: String(user.dto.id) },
        body: {
          name: name.trim()
        }
      });

      if ('success' in response && response.success) {
        setMessage({ type: 'success', text: 'Name updated successfully!' });
        await user.refreshUser();
      } else {
        setMessage({ type: 'error', text: 'Failed to update name. Please try again.' });
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user.dto) {
    return (
      <Typography variant="body1">
        Please log in to view your settings.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#023D54', mb: 3 }}>
        General Settings
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Your Name"
            value={name}
            onChange={handleNameChange}
            variant="outlined"
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !name.trim() || name.trim() === user.dto.name}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Updating...
                </>
              ) : (
                'Update Name'
              )}
            </Button>
          </Box>
        </Box>

        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
      </form>
    </Box>
  );
};