import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { CheckCircle, Cancel, PersonAdd } from '@mui/icons-material';
import { Avatar } from '../components/Avatar';
import { NavBar } from '../components/NavBar';
import { typedFetch, API_HOST } from '../typedFetch';
import { useUserContext } from '../UserContext';
import { UserType, RelationshipType } from '../../../common/types';

interface PendingInvitationData {
  id: number;
  inviterUser: {
    id: number;
    name: string;
    email: string;
    type: UserType;
  };
  childUser: {
    id: number;
    name: string;
    profilePicture?: {
      image: string;
      background: string;
    };
  };
  inviteeEmail: string;
  relationshipType: RelationshipType;
  status: string;
  createdAt: Date;
  expiresAt?: Date;
  token: string;
  adults: Array<{
    id: number;
    name: string;
    email: string;
    type: UserType;
    relationshipType: RelationshipType;
  }>;
}

export const PendingInvitations = () => {
  const [invitations, setInvitations] = useState<PendingInvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingInvitations, setProcessingInvitations] = useState<Set<number>>(new Set());
  const user = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user.dto) {
        setError('You must be logged in to view invitations');
        setLoading(false);
        return;
      }

      try {
        const response = await typedFetch({
          host: API_HOST,
          endpoint: '/api/invitations',
          method: 'get'
        });

        if ('success' in response && response.success) {
          const invites = response.invitations || [];
          setInvitations(invites);

          if (invites.length === 0) {
            navigate('/');
          }
        } else if ('message' in response) {
          setError(response.message);
        }
      } catch (error) {
        console.error('Error fetching invitations:', error);
        setError('Failed to load pending invitations');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [user.dto]);

  const handleInvitationAction = async (invitationId: number, action: 'accept' | 'reject') => {
    setProcessingInvitations(prev => new Set(prev).add(invitationId));
    setError(null);

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/invitations/:id',
        method: 'post',
        params: { id: String(invitationId) },
        body: { action }
      });

      if ('success' in response && response.success) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));

        if (action === 'accept') {
          window.location.reload();
        }
      } else {
        setError(`Failed to ${action} invitation`);
      }
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error);
      setError(`Failed to ${action} invitation`);
    } finally {
      setProcessingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
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


  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
      }}>
        <NavBar />
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2, color: 'white' }}>Loading pending invitations...</Typography>
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
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Box sx={{
          mb: 4,
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <PersonAdd sx={{ fontSize: 48, color: '#023D54', mb: 2 }} />
          <Typography variant="h4" sx={{ color: '#023D54', mb: 1 }}>
            Pending Invitations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You have been invited to manage the following children. Please accept or decline each invitation.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {invitations.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
              No Pending Invitations
              </Typography>
              <Typography variant="body2" color="text.secondary">
              You don't have any pending invitations at this time.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {invitations.map((invitation, index) => (
              <Card key={invitation.id} data-test="invitation-card" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      userType={UserType.STUDENT}
                      profilePicture={invitation.childUser.profilePicture}
                      size={60}
                    />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#023D54' }} data-test="child-name">
                        {invitation.childUser.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                      Invited by {invitation.inviterUser.name} ({invitation.inviterUser.email})
                      </Typography>
                      <Chip
                        label={`As ${getRelationshipLabel(invitation.relationshipType)}`}
                        color={getRelationshipColor(invitation.relationshipType)}
                        size="small"
                        variant="outlined"
                        data-test="relationship-role"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>

                  {invitation.adults.length > 0 && (
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#023D54' }}>
                      Current Managing Adults:
                      </Typography>
                      <List dense sx={{ mb: 2 }}>
                        {invitation.adults.map((adult, adultIndex) => (
                          <React.Fragment key={adult.id}>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span style={{ fontSize: '0.9rem' }}>{adult.name}</span>
                                    <Chip
                                      label={getRelationshipLabel(adult.relationshipType)}
                                      color={getRelationshipColor(adult.relationshipType)}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Box>
                                }
                                secondary={adult.email}
                              />
                            </ListItem>
                            {adultIndex < invitation.adults.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => handleInvitationAction(invitation.id, 'reject')}
                      disabled={processingInvitations.has(invitation.id)}
                      sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                      data-test="decline-invitation-button"
                    >
                      {processingInvitations.has(invitation.id) ? 'Rejecting...' : 'Decline'}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={() => handleInvitationAction(invitation.id, 'accept')}
                      disabled={processingInvitations.has(invitation.id)}
                      sx={{
                        bgcolor: '#023D54',
                        '&:hover': { bgcolor: '#012A3A' }
                      }}
                      data-test="accept-invitation-button"
                    >
                      {processingInvitations.has(invitation.id) ? 'Accepting...' : 'Accept'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Container>
    </div>
  );
};