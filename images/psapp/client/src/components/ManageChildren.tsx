import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Badge,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { useUserContext } from '../UserContext';
import { Avatar } from './Avatar';
import { UserType, RelationshipType } from '../../../common/types';

export const ManageChildren = () => {
  const user = useUserContext();

  if (!user.dto || (user.dto.type !== UserType.PARENT && user.dto.type !== UserType.TEACHER)) {
    return (
      <Typography variant="body1">
        This section is only available for parents and teachers.
      </Typography>
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
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#023D54', mb: 3 }}>
        Manage Children
      </Typography>

      <Grid container spacing={3}>
        {children.map((child) => (
          <Grid item xs={12} sm={6} md={4} key={child.id}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardActionArea
                component={Link}
                to={`/settings/child/${child.id}`}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3
                }}>
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
                      color: '#023D54',
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
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              border: '2px dashed #ccc',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#023D54',
                backgroundColor: 'rgba(2, 61, 84, 0.05)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <CardActionArea
              component={Link}
              to="/create-child"
              sx={{ height: '100%' }}
            >
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                minHeight: '200px'
              }}>
                <Add
                  sx={{
                    fontSize: '4rem',
                    color: '#ccc',
                    mb: 2
                  }}
                />
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    textAlign: 'center',
                    color: '#999',
                    fontWeight: 500
                  }}
                >
                  Add Child
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};