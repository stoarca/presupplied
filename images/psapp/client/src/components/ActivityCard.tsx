import React from 'react';
import { Box, Typography } from '@mui/material';
import { KNOWLEDGE_MAP, ChildInfoWithProgress, ModuleType, UserType } from '../../../common/types';
import { User } from '../UserContext';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { useModuleInteraction } from './ModuleInteractionHandler';
import { buildGraph } from '../dependency-graph';
import { ModuleTypeIcon } from './ModuleTypeIcon';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

interface ActivityCardProps {
    kmid: string;
    user: User;
    relevantChildrenSorted?: ChildInfoWithProgress[];
    mapMode?: boolean;
}

export let ActivityCard = ({ kmid, user, relevantChildrenSorted = [], mapMode = false }: ActivityCardProps) => {
  let node = React.useMemo(() => knowledgeGraph.getNodeData(kmid), [kmid]);

  const { handleModuleClick, ModuleInteractionComponents } = useModuleInteraction(
    kmid,
    user,
    relevantChildrenSorted,
    knowledgeGraph
  );

  return (
    <>
      <div data-test="module-card" data-test-module={kmid} onClick={handleModuleClick}>
        <Card
          hover={!mapMode}
          elevation={mapMode ? 0 : 3}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
            p: 0,
            userSelect: 'none',
            position: 'relative',
          }}
        >
          <ModuleTypeIcon moduleType={node.moduleType} user={user} />
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#f5f5f5'
          }}>
            <Box sx={{
              py: 2,
              px: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography variant="h6" data-test="module-title" sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 'bold' }}>
                {node.title || node.id}
              </Typography>
              {node.moduleType === ModuleType.CHILD_DELEGATED && relevantChildrenSorted.length > 0 && (
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(4, relevantChildrenSorted.length > 3 ? 4 : relevantChildrenSorted.length)}, 1fr)`,
                  gap: 1,
                  marginTop: 1,
                  justifyItems: 'center',
                  alignItems: 'start',
                  width: '100%',
                  maxWidth: '240px',
                }}>
                  {relevantChildrenSorted.slice(0, 3).map(child => (
                    <Box key={child.id} sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      width: '100%',
                      minWidth: 0,
                    }}>
                      <Avatar
                        data-test={`child-avatar-${child.id}`}
                        userType={UserType.STUDENT}
                        profilePicture={child.profilePicture}
                        size={45}
                        sx={mapMode ? {
                          boxShadow: 'none !important',
                          '&:hover': {
                            transform: 'none !important',
                          }
                        } : {}}
                      />
                      <Typography sx={{
                        fontSize: '0.75rem',
                        color: 'text.primary',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{child.name}</Typography>
                    </Box>
                  ))}
                  {relevantChildrenSorted.length > 3 && (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      width: '100%',
                      minWidth: 0,
                    }}>
                      <Avatar
                        userType={UserType.STUDENT}
                        text={`+${relevantChildrenSorted.length - 3}`}
                        size={45}
                        sx={{
                          bgcolor: '#ddd',
                          fontSize: '14px',
                          color: '#666',
                          fontWeight: 'bold',
                          ...(mapMode ? {
                            boxShadow: 'none !important',
                            '&:hover': {
                              transform: 'none !important',
                            }
                          } : {})
                        }}
                      />
                      <Typography sx={{
                        fontSize: '0.75rem',
                        color: 'transparent',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>more</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Imagine there was an amazing picture here
            </Typography>
          </Box>
        </Card>
      </div>
      {ModuleInteractionComponents}
    </>
  );
};