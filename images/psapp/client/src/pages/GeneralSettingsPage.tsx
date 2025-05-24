import React from 'react';
import { Box, Container, Typography, Tab, Tabs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { GeneralSettings } from '../components/GeneralSettings';
import { useUserContext } from '../UserContext';
import { UserType } from '../../../common/types';

const a11yProps = (index: number) => {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
};

export const GeneralSettingsPage = () => {
  const user = useUserContext();
  const location = useLocation();

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

  const isAdult = user.dto.type === UserType.PARENT || user.dto.type === UserType.TEACHER;
  const currentTab = location.pathname === '/settings/children' ? 1 : 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
    }}>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#f5f5f5'
          }}>
            <Typography variant="h4" sx={{ p: 3, color: '#023D54' }}>
              Settings
            </Typography>
            <Tabs
              value={currentTab}
              aria-label="settings tabs"
              sx={{ px: 3 }}
            >
              <Tab
                label="General Settings"
                component={Link}
                to="/settings/general"
                {...a11yProps(0)}
              />
              {isAdult && (
                <Tab
                  label="Manage Children"
                  component={Link}
                  to="/settings/children"
                  {...a11yProps(1)}
                />
              )}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <GeneralSettings />
          </Box>
        </Box>
      </Container>
    </div>
  );
};