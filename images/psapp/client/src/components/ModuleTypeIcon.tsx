import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { ModuleType, UserType } from '../../../common/types';
import { User } from '../UserContext';

interface ModuleTypeIconProps {
  moduleType: ModuleType;
  user: User;
  size?: number;
  iconSize?: number;
  admin?: boolean;
}

export const ModuleTypeIcon: React.FC<ModuleTypeIconProps> = ({
  moduleType,
  user,
  size = 36,
  iconSize,
  admin = false
}) => {
  const showModuleTypeIcon = admin || (user.dto && (user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER));

  if (!showModuleTypeIcon) {
    return null;
  }

  let moduleTypeIcon: string | null = null;
  let iconColor: string = '#2E7D32';
  let tooltipText: string = '';

  switch (moduleType) {
    case ModuleType.CHILD_OWNED:
      moduleTypeIcon = '/static/images/icons/child.png';
      iconColor = '#2E7D32';
      tooltipText = 'Child Module: Hand the device to your child to complete this';
      break;
    case ModuleType.CHILD_DELEGATED:
      moduleTypeIcon = '/static/images/icons/teacher_child_together.png';
      iconColor = '#00ACC1';
      tooltipText = 'Guided Module: Complete this together with your child';
      break;
    case ModuleType.ADULT_OWNED:
      moduleTypeIcon = '/static/images/icons/teacher.png';
      iconColor = '#1976D2';
      tooltipText = 'Parent/Teacher Module: For adults only';
      break;
    default:
      return null;
  }

  const calculatedIconSize = iconSize || (moduleType === ModuleType.CHILD_OWNED ? size * 0.6 : size * 0.9);

  return (
    <Tooltip
      title={tooltipText}
      placement="bottom-end"
      enterDelay={0}
      leaveDelay={0}
      arrow
      disableInteractive
      componentsProps={{
        tooltip: {
          sx: {
            pointerEvents: 'none',
          }
        },
        arrow: {
          sx: {
            pointerEvents: 'none',
          }
        },
        popper: {
          sx: {
            pointerEvents: 'none',
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: iconColor,
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          zIndex: 1,
          cursor: 'pointer',
        }}
      >
        <img
          src={moduleTypeIcon}
          alt="Module type"
          style={{
            width: calculatedIconSize,
            height: calculatedIconSize,
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      </Box>
    </Tooltip>
  );
};
