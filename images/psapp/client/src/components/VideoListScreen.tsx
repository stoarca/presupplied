import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { VideoInfo, ProgressVideoStatus, VideoProgressDTO } from '../../../common/types';

interface VideoListScreenProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  videos: VideoInfo[];
  watchedVideos: VideoProgressDTO;
  onVideoSelect: (video: VideoInfo) => void;
  wasShiftClick?: boolean;
}

export const VideoListScreen = ({
  open,
  onClose,
  title,
  description,
  videos,
  watchedVideos,
  onVideoSelect,
  wasShiftClick = false,
}: VideoListScreenProps) => {
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getVideoDurationFromYouTube = (videoId: string): string => {
    return 'Unknown';
  };

  const getLastWatchedDate = (videoId: string): string | null => {
    const videoProgress = watchedVideos[videoId];
    if (videoProgress?.updatedAt) {
      return new Date(videoProgress.updatedAt).toLocaleDateString();
    }
    return null;
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      data-test="video-list-dialog"
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
            {title}
          </Typography>
          {wasShiftClick && (
            <Chip
              label="Forcing completion"
              size="small"
              color="error"
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <List sx={{ pt: 0 }}>
          {videos.map((video, index) => {
            const isWatched = watchedVideos[video.id]?.status === ProgressVideoStatus.WATCHED;
            const youtubeId = extractYouTubeId(video.url);
            const duration = getVideoDurationFromYouTube(youtubeId || '');
            const lastWatched = getLastWatchedDate(video.id);

            return (
              <ListItem key={video.id} disablePadding>
                <ListItemButton
                  onClick={() => onVideoSelect(video)}
                  data-test={`video-item-${video.id}`}
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>
                    {isWatched ? (
                      <CheckIcon sx={{ color: 'success.main' }} />
                    ) : (
                      <PlayIcon sx={{ color: 'text.primary' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" component="div" sx={{ color: 'text.primary' }}>
                          {video.title}
                        </Typography>
                        {isWatched ? (
                          <Chip
                            label="Watched"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="Unwatched"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" component="div" color="text.secondary">
                          Duration: {duration}
                        </Typography>
                        {lastWatched && (
                          <Typography variant="body2" component="div" color="text.secondary">
                            Last watched: {lastWatched}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};