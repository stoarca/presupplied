import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import { UserType } from '../../../common/types';

interface ChildCreatorStep1Props {
  childData: {
    name: string;
    pinRequired: boolean;
    pin: string;
  };
  onDataChange: (field: string, value: string | boolean) => void;
  onNext: () => void;
  error: string | null;
  userType: UserType;
}

export const ChildCreatorStep1: React.FC<ChildCreatorStep1Props> = ({
  childData,
  onDataChange,
  onNext,
  error,
  userType,
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
        Create Your Child's Account
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        As a {userType === UserType.PARENT ? 'parent' : 'teacher'}, please provide a name and optional PIN for your child.
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
        helperText={childData.name !== '' && !isNameValid ? "Name must be at least 2 characters" : ""}
        inputProps={{ 'data-test': 'child-name-input' }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={childData.pinRequired}
            onChange={handleChange('pinRequired')}
            name="pinRequired"
            inputProps={{ 'data-test': 'pin-required-checkbox' }}
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
          helperText={childData.pin !== '' && !isPinValid ? "PIN must be at least 4 digits (numbers only)" : ""}
          inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*', 'data-test': 'pin-input' }}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!canProceed}
          onClick={onNext}
          data-test="next-button"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};