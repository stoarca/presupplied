import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add, Delete, School, ChildCare } from '@mui/icons-material';
import { useUserContext } from '../UserContext';
import { useKnowledgeGraph } from '../KnowledgeGraphContext';
import { UserType } from '../../../common/types';
import { Avatar } from '../components/Avatar';
import { typedLocalStorage } from '../typedLocalStorage';

export const SyncProgressPage = () => {
  const user = useUserContext();
  const knowledgeGraph = useKnowledgeGraph();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{
    adultModuleCount: number;
    childModuleCount: number;
  } | null>(null);

  const handleSyncToSelf = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      await user.mergeToServer();
      await user.refreshUser();
      navigate(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSyncing(false);
    }
  }, [user, navigate, returnTo]);

  useEffect(() => {
    if (!user.dto) {
      navigate('/login');
      return;
    }

    if (!user.hasLocalProgress()) {
      navigate(returnTo);
      return;
    }

    // Calculate progress info
    const progress = typedLocalStorage.getJson('progress') || {};
    const { adultProgress, childProgress } = user.separateProgressByModuleType(knowledgeGraph, progress);

    setProgressInfo({
      adultModuleCount: Object.keys(adultProgress).length,
      childModuleCount: Object.keys(childProgress).length,
    });

    if (user.dto.type === UserType.STUDENT) {
      handleSyncToSelf();
    }
  }, [user, navigate, knowledgeGraph, returnTo, handleSyncToSelf]);

  const handleSyncToChild = useCallback(async (childId: number) => {
    setSyncing(true);
    setError(null);
    try {
      await user.mergeSplitToServer(knowledgeGraph, childId);
      await user.refreshUser();
      navigate(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSyncing(false);
    }
  }, [user, knowledgeGraph, navigate, returnTo]);

  const handleDiscardProgress = useCallback(() => {
    setShowDiscardDialog(true);
  }, []);

  const confirmDiscardProgress = useCallback(() => {
    typedLocalStorage.removeJson('progress');
    typedLocalStorage.removeJson('progressVideo');
    setShowDiscardDialog(false);
    navigate(returnTo);
  }, [navigate, returnTo]);

  const handleCloseDiscardDialog = useCallback(() => {
    setShowDiscardDialog(false);
  }, []);

  const handleCreateChild = useCallback(() => {
    navigate(`/create-child?returnTo=${encodeURIComponent('/sync-progress')}`);
  }, [navigate]);

  if (!user.dto || syncing || !progressInfo) {
    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            {syncing ? 'Syncing your progress...' : 'Loading...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  const children = user.dto.children || [];
  const hasAdultProgress = progressInfo.adultModuleCount > 0;
  const hasChildProgress = progressInfo.childModuleCount > 0;

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sync Your Progress
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          We found progress saved on this device. Please select where you'd like to save it.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {(hasAdultProgress || hasChildProgress) && (
          <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            {hasAdultProgress && (
              <Chip
                icon={<School />}
                label={`${progressInfo.adultModuleCount} adult modules`}
                color="primary"
                variant="outlined"
              />
            )}
            {hasChildProgress && (
              <Chip
                icon={<ChildCare />}
                label={`${progressInfo.childModuleCount} child modules`}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}

        <Stack spacing={2}>
          {hasAdultProgress && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your adult module progress will be automatically saved to your account.
            </Alert>
          )}

          {hasChildProgress && (
            <>
              {children.length === 0 ? (
                <>
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 2 }}>
                    You have child module progress, but no children set up yet. Would you like to create one?
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add />}
                    onClick={handleCreateChild}
                    fullWidth
                  >
                    Create a Child Profile
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Select a child to sync progress to:
                  </Typography>

                  {children.map((child) => (
                    <Card
                      key={child.id}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                      onClick={() => handleSyncToChild(child.id)}
                      data-test={`sync-child-card-${child.id}`}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar profilePicture={child.profilePicture} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{child.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click to sync child module progress to this profile
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleCreateChild}
                    fullWidth
                    data-test="create-new-child-profile"
                  >
                    Create a New Child Profile
                  </Button>
                </>
              )}
            </>
          )}

          {!hasChildProgress && (
            <Button
              variant="contained"
              size="large"
              onClick={handleSyncToSelf}
              fullWidth
            >
              Continue
            </Button>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="text"
            color="error"
            startIcon={<Delete />}
            onClick={handleDiscardProgress}
            fullWidth
          >
            Discard All Progress
          </Button>
        </Stack>
      </Box>

      <Dialog
        open={showDiscardDialog}
        onClose={handleCloseDiscardDialog}
        aria-labelledby="discard-dialog-title"
        aria-describedby="discard-dialog-description"
      >
        <DialogTitle id="discard-dialog-title">
          Discard Progress?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="discard-dialog-description">
            Are you sure you want to discard your progress? This action cannot be undone and all your completed modules will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiscardDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDiscardProgress} color="error" variant="contained">
            Discard Progress
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
