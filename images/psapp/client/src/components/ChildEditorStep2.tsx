import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Avatar } from './Avatar';
import { ColorSelector } from './ColorSelector';

const AVATAR_OPTIONS = [
  { id: 'bear', path: '/static/images/avatars/bear.png' },
  { id: 'cat', path: '/static/images/avatars/cat.png' },
  { id: 'cow', path: '/static/images/avatars/cow.png' },
  { id: 'dog', path: '/static/images/avatars/dog.png' },
  { id: 'elephant', path: '/static/images/avatars/elephant.png' },
  { id: 'hippo', path: '/static/images/avatars/hippo.png' },
  { id: 'lion', path: '/static/images/avatars/lion.png' },
  { id: 'pig', path: '/static/images/avatars/pig.png' },
  { id: 'platypus', path: '/static/images/avatars/platypus.png' },
  { id: 'sheep', path: '/static/images/avatars/sheep.png' },
  { id: 'tiger', path: '/static/images/avatars/tiger.png' },
  { id: 'zebra', path: '/static/images/avatars/zebra.png' }
];

interface ChildEditorStep2Props {
  childData: {
    avatarPath: string;
    avatarColor: string;
  };
  onDataChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  editMode: boolean;
}

export const ChildEditorStep2: React.FC<ChildEditorStep2Props> = ({
  childData,
  onDataChange,
  onBack,
  onSubmit,
  loading,
  error,
  editMode,
}) => {
  const handleSelectAvatar = (avatarPath: string) => {
    onDataChange('avatarPath', avatarPath);
  };

  const handleSelectColor = (color: string) => {
    onDataChange('avatarColor', color);
  };

  const isAvatarValid = !!childData.avatarPath;

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        {editMode ? 'Update Avatar' : 'Choose an Avatar'}
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {editMode ? 'Change your child\'s avatar and background color.' : 'Personalize your child\'s account by selecting an avatar and background color.'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar
          profilePicture={{
            image: childData.avatarPath,
            background: childData.avatarColor
          }}
          size={120}
        />
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Select Character
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {AVATAR_OPTIONS.map((avatar) => (
          <Grid item xs={2} sm={3} md={2} key={avatar.id}>
            <Box data-test={`avatar-option-${avatar.id}`}>
              <Avatar
                profilePicture={{
                  image: avatar.path,
                  background: 'white'
                }}
                size={65}
                selected={childData.avatarPath === avatar.path}
                onClick={() => handleSelectAvatar(avatar.path)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Select Background Color
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ColorSelector
          selectedColor={childData.avatarColor}
          onColorSelect={handleSelectColor}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading || !isAvatarValid}
          onClick={onSubmit}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
          data-test="create-child-button"
        >
          {loading
            ? (editMode ? 'Updating...' : 'Creating...')
            : (editMode ? 'Update Profile' : 'Create Profile')
          }
        </Button>
      </Box>
    </Box>
  );
};