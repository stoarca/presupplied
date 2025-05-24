import React from 'react';
import { Container, Typography } from '@mui/material';
import { NavBar } from '../components/NavBar';
import { ChildProfileEditor } from '../components/ChildProfileEditor';
import { useUserContext } from '../UserContext';
import { UserType } from '../../../common/types';

export const CreateChildPage = () => {
  const user = useUserContext();

  const handleComplete = () => {
    window.location.href = '/settings/children';
  };

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
            Please log in to create a child profile.
          </Typography>
        </Container>
      </div>
    );
  }

  if (user.dto.type !== UserType.PARENT && user.dto.type !== UserType.TEACHER) {
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
            Only parents and teachers can create child profiles.
          </Typography>
        </Container>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
    }}>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ChildProfileEditor
          mode="create"
          onComplete={handleComplete}
          showCloseButton={false}
        />
      </Container>
    </div>
  );
};