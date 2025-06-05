import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { buildGraph } from '../dependency-graph';
import { moduleComponents } from '../ModuleContext';
import { NavBar } from '../components/NavBar';
import { useUserContext } from '../UserContext';
import {
  ProgressStatus, KNOWLEDGE_MAP, UserType, ModuleType, ChildInfoWithProgress
} from '../../../common/types';
import { isModuleForAdults } from '../../../common/utils';
import { ActivityCard } from '../components/ActivityCard';
import { Logo } from '../components/Logo';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export let HomePage = () => {
  let user = useUserContext();

  const { reachable, childrenReachableSets } = React.useMemo(() => {
    if (!user.dto) {
      const userPassed = new Set(
        Object.entries(user.progress()).filter(
          ([k, v]) => v.status === ProgressStatus.PASSED
        ).map(([k, v]) => k)
      );

      const result = knowledgeGraph.getReachables('hybrid', userPassed, new Map());

      return {
        reachable: result.reachable,
        childrenReachableSets: new Map<number, Set<string>>()
      };
    }

    const userPassed = new Set(
      Object.entries(user.progress()).filter(
        ([k, v]) => v.status === ProgressStatus.PASSED
      ).map(([k, v]) => k)
    );

    const childrenReachedSets = new Map<number, Set<string>>();
    if (user.dto.children) {
      user.dto.children.forEach(child => {
        const childPassed = new Set(
          Object.entries(child.progress).filter(
            ([k, v]) => v.status === ProgressStatus.PASSED
          ).map(([k, v]) => k)
        );
        childrenReachedSets.set(child.id, childPassed);
      });
    }

    // Self-registered students (no adults) should use 'hybrid' mode to see all module types
    const userType = user.dto.type === UserType.STUDENT && (!user.dto.adults || user.dto.adults.length === 0)
      ? 'hybrid'
      : user.dto.type;

    const result = knowledgeGraph.getReachables(userType, userPassed, childrenReachedSets);

    return {
      reachable: result.reachable,
      childrenReachableSets: result.childrenReachableSets
    };
  }, [user.dto, user, knowledgeGraph]);

  let reachableAndImplemented = React.useMemo(() => {
    return new Set(Array.from(reachable).filter(x => !!moduleComponents[x]));
  }, [reachable]);

  let [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isStudent = user.dto?.type === UserType.STUDENT;
  const moduleCount = reachableAndImplemented.size;

  let containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    gap: '20px',
    justifyContent: moduleCount > 2 ? 'flex-start' : 'center',
    alignItems: 'center',
    flexDirection: isSmallDevice ? 'column' : 'row',
    paddingLeft: moduleCount > 2 && !isSmallDevice ? '20vw' : '0px',
    paddingRight: moduleCount > 2 && !isSmallDevice ? '20vw' : '0px',
    scrollBehavior: 'smooth',
    overflowX: isSmallDevice ? 'hidden' : 'auto',
    overflowY: isSmallDevice ? 'auto' : 'hidden',
    whiteSpace: isSmallDevice ? 'normal' : 'nowrap',
    boxSizing: 'border-box', // Ensure padding and border are included in the element's total width and height
  };

  // Handle vertical scrolling with the mouse to scroll horizontally
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isSmallDevice) {
      event.currentTarget.scrollLeft += event.deltaY;
    }
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 59, 59, 0.3);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 59, 59, 0.5);
          background-clip: content-box;
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #bbfec4, #03dd74)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <NavBar />
        </Box>
        <div
          style={containerStyle}
          onWheel={handleScroll}
          className="custom-scrollbar"
        >
          {moduleCount === 0 && (
            <h1 data-test="no-modules-message" style={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', color: '#fff', maxWidth: '50vw', textAlign: 'center', justifyContent: 'center' }}>
              {isStudent
                ? 'No modules available for you at this time. Check back soon!'
                : 'No modules available yet. Complete student modules to unlock teacher content.'}
            </h1>
          )}

          {Array.from(reachableAndImplemented).map(kmid => {
            let node = knowledgeGraph.getNodeData(kmid);

            // Only filter modules for students who have adults managing them
            const hasAdultManagement = user.dto && isStudent && user.dto.adults && user.dto.adults.length > 0;
            if (hasAdultManagement && isModuleForAdults(node.moduleType)) {
              return null;
            }

            let relevantChildrenSorted: ChildInfoWithProgress[] = [];
            if (node.moduleType === ModuleType.CHILD_DELEGATED && user.dto?.children) {
              relevantChildrenSorted = user.dto.children
                  .filter(child => {
                    const childReachable = childrenReachableSets.get(child.id);
                    return childReachable?.has(kmid) || false;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name));
            }

            return (
              <div
                key={kmid}
                style={{
                  display: 'inline-block',
                  verticalAlign: 'top',
                  margin: '20px 10px',
                  boxSizing: 'border-box',
                  minWidth: `calc(${isSmallDevice ? '70vw' : window.innerWidth > 1000 ? '25vw' : '35vw'})`,
                  maxWidth: '90vw'
                }}>
                <ActivityCard kmid={kmid} user={user} relevantChildrenSorted={relevantChildrenSorted} />
              </div>
            );
          })}
        </div>

        <Logo />
      </div>
    </>
  );
};
