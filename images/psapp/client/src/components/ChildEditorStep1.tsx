import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { UserType, Gender } from '../../../common/types';

interface ChildEditorStep1Props {
  childData: {
    name: string;
    pinRequired: boolean;
    pin: string;
    birthday?: string | null;
    gender?: Gender | null;
  };
  onDataChange: (field: string, value: string | boolean | Gender | null) => void;
  onNext: () => void;
  error: string | null;
  userType: UserType;
  editMode: boolean;
}

export const ChildEditorStep1: React.FC<ChildEditorStep1Props> = ({
  childData,
  onDataChange,
  onNext,
  error,
  userType,
  editMode,
}) => {
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'pinRequired' ? event.target.checked : event.target.value;
    onDataChange(field, value);
  };

  const isNameValid = childData.name.trim().length >= 2;
  const isPinValid = !childData.pinRequired || (childData.pin.length >= 4 && /^\d+$/.test(childData.pin));
  const canProceed = isNameValid && isPinValid;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && canProceed) {
      onNext();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canProceed, onNext]);

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        {editMode ? 'Edit Child\'s Profile' : 'Create Your Child\'s Account'}
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {editMode ? 'Update your child\'s name and PIN settings.' : 'Please provide a name and optional PIN for your child.'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="childName"
        label="Child's Name"
        name="childName"
        autoFocus
        value={childData.name}
        onChange={handleChange('name')}
        error={childData.name !== '' && !isNameValid}
        helperText={childData.name !== '' && !isNameValid ? 'Name must be at least 2 characters' : ''}
        inputProps={{ 'data-test': 'child-name-input' }}
      />

      <TextField
        margin="normal"
        fullWidth
        id="birthday"
        label="Birthday (optional)"
        name="birthday"
        type="date"
        value={childData.birthday || ''}
        onChange={(e) => onDataChange('birthday', e.target.value || null)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ 'data-test': 'birthday-input' }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="gender-label">Gender (optional)</InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          value={childData.gender || ''}
          onChange={(e) => onDataChange('gender', e.target.value ? e.target.value as Gender : null)}
          label="Gender (optional)"
          data-test="gender-select"
        >
          <MenuItem value="" data-test="gender-prefer-not-to-disclose">Prefer not to disclose</MenuItem>
          <MenuItem value={Gender.MALE} data-test="gender-male">Male</MenuItem>
          <MenuItem value={Gender.FEMALE} data-test="gender-female">Female</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={childData.pinRequired}
            onChange={handleChange('pinRequired')}
            name="pinRequired"
            inputProps={{ 'data-test': 'pin-required-checkbox' } as any}
          />
        }
        label="Require PIN for access"
      />

      {childData.pinRequired && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="pin"
          label="PIN Code (numbers only)"
          name="pin"
          type="password"
          value={childData.pin}
          onChange={handleChange('pin')}
          error={childData.pin !== '' && !isPinValid}
          helperText={childData.pin !== '' && !isPinValid ? 'PIN must be at least 4 digits (numbers only)' : ''}
          inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*', 'data-test': 'pin-input' }}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!canProceed}
          onClick={onNext}
          data-test="create-child-next-button"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};