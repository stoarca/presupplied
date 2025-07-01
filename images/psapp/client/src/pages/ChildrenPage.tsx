import React from 'react';
import { Container, Typography, Grid, Box, Badge, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { NavBar } from '../components/NavBar';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Logo } from '../components/Logo';
import { useUserContext } from '../UserContext';
import { UserType, RelationshipType } from '../../../common/types';

export const ChildrenPage = () => {
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
            Please log in to access children management.
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
            Children management is only available for parents and teachers.
          </Typography>
        </Container>
      </div>
    );
  }

  const children = user.dto.children || [];

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
      position: 'relative'
    }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, pb: 8, flex: 1 }}>
        <Grid container spacing={3}>
          {[...children].sort((a, b) => a.name.localeCompare(b.name)).map((child) => (
            <Grid item xs={12} sm={6} md={4} key={child.id}>
              <Card
                onClick={() => window.location.href = `/settings/child/${child.id}`}
                hover
                data-test={`child-card-${child.id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar
                    userType={UserType.STUDENT}
                    profilePicture={child.profilePicture}
                    size={80}
                  />
                  {child.pinRequired && (
                    <Badge
                      badgeContent="🔒"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        '& .MuiBadge-badge': {
                          backgroundColor: 'transparent',
                          fontSize: '1.2rem',
                        }
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    textAlign: 'center',
                    color: 'text.primary',
                    fontWeight: 600
                  }}
                >
                  {child.name}
                </Typography>

                <Chip
                  label={getRelationshipLabel(child.relationshipType)}
                  color={getRelationshipColor(child.relationshipType)}
                  size="small"
                  variant="outlined"
                />
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={() => window.location.href = '/create-child'}
              hover
              data-test="add-child-card"
              sx={{
                height: '100%',
                border: '2px dashed',
                borderColor: 'text.primary',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Add
                sx={{
                  fontSize: '4rem',
                  color: 'text.primary',
                  mb: 2
                }}
              />
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  textAlign: 'center',
                  color: 'text.primary',
                  fontWeight: 500
                }}
              >
                Add Child
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Logo />
    </div>
  );
};