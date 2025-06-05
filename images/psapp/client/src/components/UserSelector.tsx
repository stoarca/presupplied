import React from 'react';
import { UserType, ProfilePicture } from '../../../common/types';
import { Avatar } from './Avatar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export interface UserOption {
  id: number;
  name: string;
  userType: UserType;
  profilePicture?: ProfilePicture;
  subtitle?: string;
  caption?: string;
  isSelected?: boolean;
}

interface UserSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (userId: number) => void;
  title: string;
  users: UserOption[];
  wasShiftClick?: boolean;
}

export const UserSelector = ({ open, onClose, onSelect, title, users, wasShiftClick = false }: UserSelectorProps) => {
  const handleUserSelect = (userId: number) => {
    onSelect(userId);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {wasShiftClick && (
            <Chip
              label="Forcing completion"
              size="small"
              color="error"
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 275, maxWidth: 600, mx: 'auto' }}>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            my: 4
          }}>
            {users.map((user) => (
              <Box
                key={user.id}
                data-test={`account-avatar-${user.id}`}
                onClick={() => !user.isSelected && handleUserSelect(user.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: user.isSelected ? 'default' : 'pointer',
                  padding: 2,
                  minWidth: 140,
                  '&:hover': !user.isSelected ? {
                    transform: 'scale(1.05)',
                  } : {},
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <Avatar
                  userType={user.userType}
                  profilePicture={user.profilePicture}
                  size={100}
                  selected={user.isSelected}
                />
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mt: 1, fontWeight: 'bold' }}
                >
                  {user.name}
                </Typography>
                {user.subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {user.subtitle}
                  </Typography>
                )}
                {user.caption && (
                  <Typography variant="caption" color="text.secondary">
                    {user.caption}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};