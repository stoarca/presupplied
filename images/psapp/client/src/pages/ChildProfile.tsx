import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import { PersonAdd, Edit, SwitchAccount } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { InviteAdult } from '../components/InviteAdult';
import { useUserContext } from '../UserContext';
import { typedFetch, API_HOST } from '../typedFetch';
import { UserDTO, UserType, RelationshipType } from '../../../common/types';

export const ChildProfile = () => {
  const { childId } = useParams<{ childId: string }>();
  const user = useUserContext();

  const [childData, setChildData] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

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

  const handleInviteComplete = () => {
    setShowInviteDialog(false);
    // Refresh child data to show new pending invitations
    window.location.reload();
  };

  const handleSwitchToChild = async () => {
    if (!childId) {
      return;
    }

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/auth/switch',
        method: 'post',
        body: { targetId: childId }
      });

      if ('success' in response && response.success) {
        window.location.href = '/';
      } else {
        console.error('Failed to switch to child account');
      }
    } catch (error) {
      console.error('Error switching to child account:', error);
    }
  };


  const getRelationshipColor = (type: RelationshipType) => {
    switch (type) {
      case RelationshipType.PRIMARY:
        return 'primary';
      case RelationshipType.SECONDARY:
        return 'secondary';
      case RelationshipType.OBSERVER:
        return 'default';
      default:
        return 'default';
    }
  };

  const getRelationshipLabel = (type: RelationshipType) => {
    switch (type) {
      case RelationshipType.PRIMARY:
        return 'Primary';
      case RelationshipType.SECONDARY:
        return 'Secondary';
      case RelationshipType.OBSERVER:
        return 'Observer';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
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
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
      }}>
        <NavBar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Child profile not found'}
          </Alert>
        </Container>
      </div>
    );
  }

  const currentUserRelationship = childData.adults?.find(adult => adult.id === user.dto?.id);
  const canManage = currentUserRelationship?.relationshipType === RelationshipType.PRIMARY;
  const canSwitchToChild = currentUserRelationship?.relationshipType === RelationshipType.PRIMARY ||
                          currentUserRelationship?.relationshipType === RelationshipType.SECONDARY;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
    }}>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Avatar
              userType={UserType.STUDENT}
              profilePicture={childData.profilePicture}
              size={100}
            />
            <Box sx={{ ml: { sm: 3 }, mt: { xs: 2, sm: 0 }, flex: 1 }}>
              <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
                {childData.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Student Profile
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' }, mt: { xs: 2, sm: 0 } }}>
              {canManage && (
                <Button
                  component={Link}
                  to={`/settings/child/${childId}/edit`}
                  startIcon={<Edit />}
                  variant="outlined"
                  sx={{
                    borderColor: 'text.primary',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  Edit Profile
                </Button>
              )}
              {canSwitchToChild && (
                <Button
                  onClick={handleSwitchToChild}
                  startIcon={<SwitchAccount />}
                  variant="outlined"
                  data-test="switch-to-child-button"
                  sx={{
                    borderColor: 'text.primary',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  Switch to {childData.name}
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Mentors
              </Typography>
              {canManage && (
                <Button
                  startIcon={<PersonAdd />}
                  onClick={() => setShowInviteDialog(true)}
                  data-test="invite-adult-button"
                  variant="outlined"
                  sx={{
                    borderColor: 'text.primary',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  Invite Mentor
                </Button>
              )}
            </Box>

            <List>
              {childData.adults?.sort((a, b) => a.name.localeCompare(b.name)).map((adult, index) => (
                <React.Fragment key={`adult-${adult.id}`}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        userType={adult.type}
                        profilePicture={adult.profilePicture}
                        size={40}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                              {adult.name}
                            </span>
                            {adult.loggedIn && (
                              <Chip label="You" size="small" color="primary" />
                            )}
                          </Box>
                          <Chip
                            label={getRelationshipLabel(adult.relationshipType)}
                            color={getRelationshipColor(adult.relationshipType)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {adult.type.charAt(0).toUpperCase() + adult.type.slice(1)} • {adult.email}
                        </span>
                      }
                    />
                  </ListItem>
                  {(index < (childData.adults?.length || 0) - 1 || (childData.pendingInvites && childData.pendingInvites.length > 0)) && <Divider />}
                </React.Fragment>
              ))}

              {childData.pendingInvites?.sort((a, b) => a.inviteeEmail.localeCompare(b.inviteeEmail)).map((invite, index) => (
                <React.Fragment key={`invite-${invite.id}`}>
                  <ListItem sx={{ px: 0, opacity: 0.6 }}>
                    <ListItemAvatar>
                      <Avatar
                        userType={UserType.PARENT}
                        profilePicture={{ image: 'default', background: '#e0e0e0' }}
                        size={40}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'rgba(0, 0, 0, 0.6)' }}>
                              {invite.inviteeEmail}
                            </span>
                            <Chip label="Pending" size="small" color="default" variant="outlined" />
                          </Box>
                          <Chip
                            label={getRelationshipLabel(invite.relationshipType)}
                            color="default"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.4)' }}>
                          Invited by {invite.inviterUser.name}
                        </span>
                      }
                    />
                  </ListItem>
                  {index < (childData.pendingInvites?.length || 0) - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Card>
      </Container>

      {showInviteDialog && (
        <InviteAdult
          childId={parseInt(childId!)}
          childName={childData.name}
          open={showInviteDialog}
          onClose={() => setShowInviteDialog(false)}
          onSuccess={handleInviteComplete}
        />
      )}

    </div>
  );
};