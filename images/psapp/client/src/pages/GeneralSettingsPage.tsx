import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { NavBar } from '../components/NavBar';
import { Card } from '../components/Card';
import { GeneralSettings } from '../components/GeneralSettings';
import { useUserContext } from '../UserContext';

export const GeneralSettingsPage = () => {
  const user = useUserContext();

  if (!user.dto) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
      }}>
        <NavBar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h5" color="white">
            Please log in to access settings.
          </Typography>
        </Container>
      </div>
    );
  }


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
    }}>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Card sx={{ overflow: 'hidden', p: 0 }}>
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#f5f5f5'
          }}>
            <Typography variant="h4" sx={{ p: 3, color: '#023D54' }}>
              Settings
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <GeneralSettings />
          </Box>
        </Card>
      </Container>
    </div>
  );
};