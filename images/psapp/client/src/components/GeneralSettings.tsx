import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { UserType } from '../../../common/types';

interface SettingChange {
  field: string;
  value: any;
  needsPassword: boolean;
}

export const GeneralSettings = () => {
  const user = useUserContext();
  const [name, setName] = useState(user.dto?.name || '');
  const [newPin, setNewPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [pendingChanges, setPendingChanges] = useState<SettingChange[]>([]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setMessage(null);
  };

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    setNewPin(value);
    setMessage(null);
  };

  const collectChanges = (): SettingChange[] => {
    const changes: SettingChange[] = [];

    if (!user.dto) {
      return changes;
    }

    // Name change doesn't require password
    if (name.trim() && name.trim() !== user.dto.name) {
      changes.push({
        field: 'name',
        value: name.trim(),
        needsPassword: false
      });
    }

    // PIN change requires password
    if (newPin) {
      changes.push({
        field: 'pin',
        value: newPin,
        needsPassword: true
      });
    }

    return changes;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user.dto) {
      return;
    }

    const changes = collectChanges();

    if (changes.length === 0) {
      setMessage({ type: 'error', text: 'No changes to save' });
      return;
    }

    // Validate PIN if it's being changed
    const pinChange = changes.find(c => c.field === 'pin');
    if (pinChange) {
      if (!newPin || !/^\d{4,6}$/.test(newPin)) {
        setMessage({ type: 'error', text: 'PIN must be 4-6 digits' });
        return;
      }
    }

    // Check if any changes require password
    const needsPassword = changes.some(c => c.needsPassword);

    if (needsPassword) {
      setPendingChanges(changes);
      setPasswordDialogOpen(true);
    } else {
      await submitChanges(changes, undefined);
    }
  };

  const submitChanges = async (changes: SettingChange[], password?: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const body: any = {};

      // Add all changes to the body
      changes.forEach(change => {
        body[change.field] = change.value;
      });

      // Add password if required
      if (password) {
        body.password = password;
      }

      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/users/:id',
        method: 'post',
        params: { id: String(user.dto!.id) },
        body
      });

      if ('success' in response && response.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });

        // Clear PIN field if PIN was changed
        if (changes.some(c => c.field === 'pin')) {
          setNewPin('');
        }

        await user.refreshUser();
      } else if ('errorCode' in response) {
        if (response.errorCode === 'users.update.invalidPassword') {
          setMessage({ type: 'error', text: 'Incorrect password' });
          // Reopen password dialog
          setPasswordDialogOpen(true);
        } else {
          setMessage({ type: 'error', text: response.message });
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      return;
    }

    setPasswordDialogOpen(false);
    await submitChanges(pendingChanges, password);
    setPassword('');
    setPendingChanges([]);
  };

  const handlePasswordCancel = () => {
    setPasswordDialogOpen(false);
    setPassword('');
    setPendingChanges([]);
  };

  if (!user.dto) {
    return (
      <Typography variant="body1">
        Please log in to view your settings.
      </Typography>
    );
  }

  const isAdult = user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER;
  const hasChanges = collectChanges().length > 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#023D54', mb: 3 }}>
        General Settings
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#023D54', mb: 2 }}>
            Profile
          </Typography>

          <TextField
            fullWidth
            label="Your Name"
            value={name}
            onChange={handleNameChange}
            variant="outlined"
            disabled={isLoading}
            sx={{ mb: 2 }}
            data-test="settings-name-input"
          />
        </Box>

        {isAdult && (
          <>
            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#023D54', mb: 2 }}>
                Security
              </Typography>

              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Your PIN is used when switching between accounts. The default PIN is 4000.
              </Typography>

              <TextField
                fullWidth
                label="New PIN (4-6 digits)"
                value={newPin}
                onChange={handlePinChange}
                variant="outlined"
                disabled={isLoading}
                sx={{ mb: 2 }}
                data-test="settings-pin-input"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 6
                }}
              />
            </Box>
          </>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !hasChanges}
            data-test="settings-save-button"
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Box>

        {message && (
          <Alert
            severity={message.type}
            sx={{ mt: 2 }}
            data-test="settings-alert"
          >
            {message.text}
          </Alert>
        )}
      </form>

      <Dialog open={passwordDialogOpen} onClose={handlePasswordCancel} data-test="settings-password-dialog">
        <DialogTitle>Password Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter your password to confirm these changes.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Current Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password) {
                handlePasswordSubmit();
              }
            }}
            variant="outlined"
            data-test="settings-password-input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordCancel} data-test="settings-password-cancel">Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" disabled={!password} data-test="settings-password-confirm">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};