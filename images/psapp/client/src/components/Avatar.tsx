import React from 'react';
import { Avatar as MuiAvatar, SxProps, Theme } from '@mui/material';
import { UserType, ProfilePicture } from '../../../common/types';
import FaceIcon from '@mui/icons-material/Face';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';

interface AvatarProps {
  userType?: UserType;
  profilePicture?: ProfilePicture;
  text?: string;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
  'data-test'?: string;
  sx?: SxProps<Theme>;
}

export const Avatar: React.FC<AvatarProps> = ({
  userType,
  profilePicture,
  text,
  size = 40,
  selected = false,
  onClick,
  'data-test': dataTest,
  sx: customSx = {}
}) => {
  const getUserIcon = (type?: UserType) => {
    switch (type) {
      case UserType.STUDENT:
        return <SchoolIcon sx={{ fontSize: size * 0.6 }} />;
      case UserType.TEACHER:
        return <SupervisorAccountIcon sx={{ fontSize: size * 0.6 }} />;
      case UserType.PARENT:
        return <FaceIcon sx={{ fontSize: size * 0.6 }} />;
      default:
        return <PersonIcon sx={{ fontSize: size * 0.6 }} />;
    }
  };

  const bgColor = profilePicture?.background ||
    (userType === UserType.STUDENT ? '#4caf50' :
      userType === UserType.TEACHER ? '#2196f3' :
        userType === UserType.PARENT ? '#ff9800' :
          'primary.light');

  return (
    <MuiAvatar
      className={selected ? 'avatar-selected' : ''}
      src={profilePicture?.image}
      onClick={onClick}
      data-test={dataTest}
      sx={{
        width: size,
        height: size,
        bgcolor: bgColor,
        border: selected ? '3px solid #1976d2' : '3px solid white',
        boxShadow: selected
          ? '0 0 0 3px rgba(25, 118, 210, 0.5), 0 4px 8px rgba(0, 0, 0, 0.2)'
          : '0 4px 8px rgba(0, 0, 0, 0.2)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
        '& .MuiAvatar-img': {
          objectFit: 'contain',
          width: '90%',
          height: '90%',
          marginTop: '1px'
        },
        ...customSx
      }}
    >
      {text || (!profilePicture?.image && getUserIcon(userType))}
    </MuiAvatar>
  );
};
