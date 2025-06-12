import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { NavBar } from '../components/NavBar';
import { ChildProfileEditor } from '../components/ChildProfileEditor';
import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { UserDTO, RelationshipType, Gender } from '../../../common/types';

export const EditChildPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const user = useUserContext();

  const [childData, setChildData] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    pinRequired: false,
    pin: '',
    avatarPath: '',
    avatarColor: '',
    birthday: null as string | null,
    gender: null as Gender | null
  });

  useEffect(() => {
    const fetchChildData = async () => {
      if (!childId || !user.dto) {
        setError('Invalid child ID or not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await typedFetch({
          host: API_HOST,
          endpoint: '/api/users/:id',
          method: 'get',
          params: { id: childId },
        });

        if ('user' in response && response.user) {
          setChildData(response.user);
          setEditData({
            name: response.user.name,
            pinRequired: response.user.pinRequired,
            pin: '',
            avatarPath: response.user.profilePicture!.image,
            avatarColor: response.user.profilePicture!.background,
            birthday: response.user.birthday || null,
            gender: response.user.gender || null
          });
        } else {
          setError('Child not found or access denied');
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
        setError('Failed to load child profile');
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [childId, user.dto]);

  const handleComplete = () => {
    navigate(`/settings/child/${childId}`);
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
            Please log in to edit child profiles.
          </Typography>
        </Container>
      </div>
    );
  }

  if (loading) {
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
            Loading child profile...
          </Typography>
        </Container>
      </div>
    );
  }

  if (error || !childData) {
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
            {error || 'Child profile not found'}
          </Typography>
        </Container>
      </div>
    );
  }

  // Check if user has permission to edit this child
  const currentUserRelationship = childData.adults?.find(adult => adult.id === user.dto?.id);
  const canManage = currentUserRelationship?.relationshipType === RelationshipType.PRIMARY;

  if (!canManage) {
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
            You don't have permission to edit this child's profile.
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
          mode="edit"
          initialData={editData}
          childId={childId}
          onComplete={handleComplete}
          showCloseButton={false}
        />
      </Container>
    </div>
  );
};