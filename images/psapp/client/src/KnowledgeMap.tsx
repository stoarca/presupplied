import React from 'react';


import {moduleComponents} from './ModuleContext';
import {useUserContext} from './UserContext';
import {PanZoomDiv} from './PanZoomDiv';
import {buildGraph, TechTree} from './dependency-graph';
import {AdminToolbar} from './AdminToolbar';
import {Cell} from './types';
import {
  GraphJson, ProgressStatus, KNOWLEDGE_MAP, GraphNodeInfo, ModuleType, ChildInfoWithProgress
} from '../../common/types';
import {ViewBox, visibleViewBoxSize} from './util';
import {NavBar} from './components/NavBar';
import {Avatar} from './components/Avatar';
import {useModuleInteraction} from './components/ModuleInteractionHandler';
import {UserType} from '../../common/types';

let autoIncrementingId = 0;
let genId = () => {
  return ++autoIncrementingId;
};


export const CELL_WIDTH = 300;
export const CELL_W_PADDING = 75;
export const CELL_HEIGHT = 120;
export const CELL_H_PADDING = 30;
export const HOVER_RECT_BACKGROUND_COLOR = 'rgba(0, 204, 238, 0.2)';
let nodePos = (cell: Cell) => {
  let ret = {
    x: cell.j * (CELL_WIDTH + CELL_W_PADDING),
    y: cell.i * (CELL_HEIGHT + CELL_H_PADDING),
  };
  return ret;
};
let cellFromAbsoluteCoords = (x: number, y: number): Cell | null => {
  if (
    y % (CELL_HEIGHT + CELL_H_PADDING) > CELL_HEIGHT ||
    x % (CELL_WIDTH + CELL_W_PADDING) > CELL_WIDTH
  ) {
    return null;
  }
  return {
    i: Math.floor(y / (CELL_HEIGHT + CELL_H_PADDING)),
    j: Math.floor(x / (CELL_WIDTH + CELL_W_PADDING)),
  };
};

interface KnowledgeNodeProps {
  kmid: string,
  knowledgeGraph: TechTree,
  reached?: Set<string>,
  reachable?: Set<string>,
  dependants: string[],
  isSelected?: boolean,
  admin: boolean,
  user: any,
  relevantChildrenSorted?: ChildInfoWithProgress[],
  childrenReachedSets?: Map<number, Set<string>>,
  childrenReachableSets?: Map<number, Set<string>>,
};

let KnowledgeNodeWithInteraction = ({
  kmid,
  knowledgeGraph,
  reached,
  reachable,
  dependants,
  isSelected = false,
  admin,
  user,
  relevantChildrenSorted = [],
  childrenReachedSets = new Map(),
  childrenReachableSets = new Map(),
}: KnowledgeNodeProps) => {
  const { handleModuleClick, ModuleInteractionComponents } = useModuleInteraction(
    kmid,
    user,
    relevantChildrenSorted,
    knowledgeGraph
  );

  return (
    <KnowledgeNode
      kmid={kmid}
      knowledgeGraph={knowledgeGraph}
      reached={reached}
      reachable={reachable}
      dependants={dependants}
      isSelected={isSelected}
      admin={admin}
      user={user}
      relevantChildrenSorted={relevantChildrenSorted}
      childrenReachedSets={childrenReachedSets}
      childrenReachableSets={childrenReachableSets}
      handleModuleClick={handleModuleClick}
      ModuleInteractionComponents={ModuleInteractionComponents}
    />
  );
};

let KnowledgeNode = ({
  kmid,
  knowledgeGraph,
  reached,
  reachable,
  dependants,
  isSelected = false,
  admin,
  user,
  relevantChildrenSorted = [],
  childrenReachedSets = new Map(),
  childrenReachableSets = new Map(),
  handleModuleClick,
  ModuleInteractionComponents,
}: KnowledgeNodeProps & {
  handleModuleClick?: (e: React.MouseEvent) => void,
  ModuleInteractionComponents?: React.ReactNode,
}) => {
  let node = knowledgeGraph.getNodeData(kmid);
  let pos = nodePos(node.cell);

  let backgroundColor: string;
  let opacity = 1;

  if (admin) {
    if (knowledgeGraph.directDependantsOf(kmid).length === 0) {
      backgroundColor = '#F19C9C';
    } else {
      backgroundColor = '#777777';
    }
    if (!moduleComponents[kmid]) {
      opacity = 0.3;
    }
  } else {
    let isUserReached = reached && reached.has(kmid);
    let isUserReachable = reachable && reachable.has(kmid);
    let isChildReached = false;
    let isChildReachable = false;

    for (let childReached of childrenReachedSets.values()) {
      if (childReached.has(kmid)) {
        isChildReached = true;
        break;
      }
    }
    for (let childReachable of childrenReachableSets.values()) {
      if (childReachable.has(kmid)) {
        isChildReachable = true;
        break;
      }
    }

    if (isUserReachable || isChildReachable) {
      backgroundColor = '#F1EB9C';
    } else if (isUserReached || isChildReached) {
      backgroundColor = '#90EE90';
    } else {
      backgroundColor = '#777777';
    }
  }

  let borderColor = isSelected ? '#00ccee' : 'transparent';
  let borderWidth = isSelected ? '3px' : '0px';

  let showChildren = !admin && relevantChildrenSorted.length > 0;

  return (
    <>
      <div
        data-test={`map-module-node-${kmid}`}
        onClick={!admin ? handleModuleClick : undefined}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          opacity,
          border: `${borderWidth} solid ${borderColor}`,
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <div
          data-test="map-module-bg"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            boxSizing: 'border-box',
          }}>
          <div
            data-test="map-module-title"
            style={{
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: showChildren ? '8px' : '0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}>
            {node.title || node.id}
          </div>
          {showChildren && (
            <div
              data-test="map-module-children"
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'nowrap',
                overflow: 'hidden',
              }}>
              {relevantChildrenSorted.slice(0, 3).map(child => (
                <div
                  key={child.id}
                  data-test={`map-module-child-${child.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}>
                  <Avatar
                    userType={UserType.STUDENT}
                    profilePicture={child.profilePicture}
                    size={30}
                    sx={{
                      border: '2px solid white',
                      boxShadow: 'none',
                    }}
                  />
                  <div
                    data-test="map-module-child-name"
                    style={{
                      fontSize: '10px',
                      color: '#333',
                      fontWeight: 'bold',
                      maxWidth: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {child.name}
                  </div>
                </div>
              ))}
              {relevantChildrenSorted.length > 3 && (
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: 'bold',
                }}>
                  +{relevantChildrenSorted.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!admin && ModuleInteractionComponents}
    </>
  );
};


interface BaseKnowledgeMapProps {
  knowledgeGraph: TechTree;
  grid: string[][];
  reached?: Set<string>;
  reachable?: Set<string>;
  selectedCells: Cell[];
  admin: boolean;
  user: any;
  childrenReachableSets?: Map<number, Set<string>>;
  childrenReachedSets?: Map<number, Set<string>>;
  onHoverCellUpdated?: (cell: Cell | null) => void;
  onMouseDown?: (e: MouseEvent, cancelPanZoom: () => void) => void,
  onMouseUp?: (e: MouseEvent, cancelPanZoom: () => void) => void;
  onClick?: (e: MouseEvent, cancelPanZoom: () => void) => void;
}
export let BaseKnowledgeMap = ({
  knowledgeGraph,
  grid,
  reached,
  reachable,
  selectedCells,
  admin,
  user,
  childrenReachableSets = new Map(),
  childrenReachedSets = new Map(),
  onHoverCellUpdated,
  onMouseDown,
  onMouseUp,
  onClick,
}: BaseKnowledgeMapProps) => {
  let divRef = React.useRef<HTMLDivElement | null>(null);
  let [viewBox, setViewBox] = React.useState<ViewBox>({
    x: 0, y: 0, w: 2000, h: 2000
  });
  React.useEffect(() => {
    let url = new URL(window.location.href);
    let scrollTo = url.searchParams.get('scroll');
    let minCell;
    if (scrollTo && knowledgeGraph.hasNode(scrollTo)) {
      minCell = knowledgeGraph.getNodeData(scrollTo).cell;
    } else {
      minCell = {i: 1000, j: 1000};
      let enabledMinCell = {i: 1000, j: 1000};
      if (reachable && reachable.size > 0) {
        for (let kmid of reachable) {
          let nodeCell = knowledgeGraph.getNodeData(kmid).cell;
          if (
            nodeCell.j < minCell.j ||
            nodeCell.j === minCell.j && nodeCell.i < minCell.i
          ) {
            minCell = nodeCell;
          }
          if (
            !!moduleComponents[kmid] && (
              nodeCell.j < enabledMinCell.j ||
              nodeCell.j === enabledMinCell.j && nodeCell.i < enabledMinCell.i
            )
          ) {
            enabledMinCell = nodeCell;
          }
        }
        if (enabledMinCell.i < 1000) {
          minCell = enabledMinCell;
        }
      } else {
        let nodes = knowledgeGraph.overallOrder();
        if (nodes.length > 0) {
          let firstNode = nodes[0];
          minCell = knowledgeGraph.getNodeData(firstNode).cell;
        }
      }
    }
    let pos = nodePos(minCell);
    let {w, h} = visibleViewBoxSize(
      {x: 0, y: 0, w: 2000, h: 2000}, divRef.current!.getBoundingClientRect()
    );
    setViewBox({
      x: pos.x - w / 2 + CELL_WIDTH / 2,
      y: pos.y - h / 2 + CELL_HEIGHT / 2,
      w: w,
      h: h,
    });
  }, []);

  let topSorted = React.useMemo(() => {
    let ret = knowledgeGraph.overallOrder();
    return ret;
  }, [knowledgeGraph]);

  let shownModules = React.useMemo(() => {
    if (admin) {
      return new Map(topSorted.map(kmid => [kmid, true]));
    }

    const shown = new Map<string, boolean>();

    for (const kmid of topSorted) {
      if (!moduleComponents[kmid]) {
        shown.set(kmid, false);
        continue;
      }

      const dependencies = knowledgeGraph.directDependenciesOf(kmid);
      const allDepsShown = dependencies.every(dep => shown.get(dep) === true);

      shown.set(kmid, allDepsShown);
    }

    return shown;
  }, [topSorted, knowledgeGraph, admin]);

  let [hoverCell, _setHoverCell] = React.useState<Cell | null>(null);
  let setHoverCell = React.useCallback((cell: Cell | null) => {
    _setHoverCell(cell);
    if (onHoverCellUpdated) {
      onHoverCellUpdated(cell);
    }
  }, [onHoverCellUpdated]);

  let handleMouseMove = React.useCallback((e: MouseEvent) => {
    let containerRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    let scale = containerRect.width / viewBox.w;

    // Convert mouse position to content coordinates accounting for CSS transforms
    let relativeX = e.clientX - containerRect.left;
    let relativeY = e.clientY - containerRect.top;

    // Apply inverse transform: divide by scale first, then add viewBox offset
    let m = {
      x: (relativeX / scale) + viewBox.x,
      y: (relativeY / scale) + viewBox.y
    };

    let newHoverCell = cellFromAbsoluteCoords(m.x, m.y);
    if (newHoverCell === null) {
      setHoverCell(newHoverCell);
      return;
    }

    if (
      newHoverCell.i < 0 ||
      newHoverCell.j < 0 ||
      newHoverCell.i >= grid.length ||
      newHoverCell.j >= grid[0].length
    ) {
      setHoverCell(null);
      return;
    }

    if (!admin) {
      let hoverNodeId = grid[newHoverCell.i][newHoverCell.j];
      if (!hoverNodeId || !shownModules.get(hoverNodeId)) {
        setHoverCell(null);
        return;
      }
    }

    if (hoverCell === null) {
      setHoverCell(newHoverCell);
      return;
    }

    if (newHoverCell.i !== hoverCell.i || newHoverCell.j !== hoverCell.j) {
      setHoverCell(newHoverCell);
      return;
    }
  }, [hoverCell, grid, admin, viewBox, setHoverCell]);

  let { edges, nodes } = React.useMemo(() => {
    let edges = [];
    let nodes = [];
    for (let i = 0; i < topSorted.length; ++i) {
      let kmid = topSorted[i];
      let node = knowledgeGraph.getNodeData(kmid);

      if (!admin && !shownModules.get(kmid)) {
        continue;
      }

      let pos = nodePos(node.cell);
      let dependants = knowledgeGraph.directDependantsOf(kmid);

      // Create edges first
      for (let depKmid of dependants) {
        if (!admin && !shownModules.get(depKmid)) {
          continue;
        }

        let dependant = knowledgeGraph.getNodeData(depKmid);
        let dependantPos = nodePos(dependant.cell);
        let isSelectedMe = selectedCells.some(
          x => x.i === node.cell.i && x.j === node.cell.j
        );
        let isSelectedDep = selectedCells.some(
          x => x.i === dependant.cell.i && x.j === dependant.cell.j
        );
        let strokeWidth = isSelectedDep || isSelectedMe ? 5 : 2;
        let strokeColor = isSelectedDep || isSelectedMe ? 'blue' : 'black';

        edges.push(
          <div
            key={`dep-${kmid}-${depKmid}`}
            style={{
              position: 'absolute',
              left: pos.x + CELL_WIDTH,
              top: pos.y + CELL_HEIGHT / 2,
              width: Math.sqrt(
                Math.pow(dependantPos.x - pos.x - CELL_WIDTH, 2) +
                Math.pow(dependantPos.y - pos.y, 2)
              ),
              height: strokeWidth,
              backgroundColor: strokeColor,
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(
                dependantPos.y - pos.y,
                dependantPos.x - pos.x - CELL_WIDTH
              )}rad)`,
            }}
          />
        );
      }

      let relevantChildrenSorted: ChildInfoWithProgress[] = [];
      if (!admin && (node.moduleType === ModuleType.CHILD_DELEGATED || node.moduleType === ModuleType.CHILD_OWNED) && user.dto?.children) {
        relevantChildrenSorted = user.dto.children
            .filter((child: ChildInfoWithProgress) => {
              const childReachable = childrenReachableSets.get(child.id);
              return childReachable?.has(kmid) || false;
            })
            .sort((a: ChildInfoWithProgress, b: ChildInfoWithProgress) => a.name.localeCompare(b.name));
      }

      let isSelected = selectedCells.some(
        x => x.i === node.cell.i && x.j === node.cell.j
      );

      if (admin) {
        nodes.push(
          <KnowledgeNode key={kmid}
            kmid={kmid}
            knowledgeGraph={knowledgeGraph}
            reached={reached}
            reachable={reachable}
            dependants={dependants}
            isSelected={isSelected}
            admin={admin}
            user={user}
            relevantChildrenSorted={relevantChildrenSorted}
            childrenReachedSets={childrenReachedSets}
            childrenReachableSets={childrenReachableSets}
            handleModuleClick={undefined}
            ModuleInteractionComponents={null}/>
        );
      } else {
        nodes.push(
          <KnowledgeNodeWithInteraction key={kmid}
            kmid={kmid}
            knowledgeGraph={knowledgeGraph}
            reached={reached}
            reachable={reachable}
            dependants={dependants}
            isSelected={isSelected}
            admin={admin}
            user={user}
            relevantChildrenSorted={relevantChildrenSorted}
            childrenReachedSets={childrenReachedSets}
            childrenReachableSets={childrenReachableSets}/>
        );
      }
    }
    return { edges, nodes };
  }, [topSorted, knowledgeGraph, admin, shownModules, selectedCells, reached, reachable, childrenReachableSets, childrenReachedSets, user]);

  let selectRects = selectedCells.map(x => {
    let pos = nodePos(x);
    return (
      <div key={x.i + '_' + x.j}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          backgroundColor: 'rgba(0, 204, 238, 0.4)',
          pointerEvents: 'none',
        }}/>
    );
  });

  let hoverRect = null;
  if (hoverCell && (admin || (grid[hoverCell.i] && grid[hoverCell.i][hoverCell.j]))) {
    let pos = nodePos(hoverCell);
    hoverRect = (
      <div
        data-test="map-hover-rectangle"
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          backgroundColor: HOVER_RECT_BACKGROUND_COLOR,
          pointerEvents: 'none',
          border: '2px solid rgba(0, 204, 238, 0.5)',
          borderRadius: '8px',
          boxSizing: 'border-box',
        }}/>
    );
  }

  let originMarker = null;
  if (admin) {
    originMarker = (
      <div
        data-test="origin-marker"
        style={{
          position: 'absolute',
          left: -CELL_HEIGHT / 6,
          top: -CELL_HEIGHT / 6,
          width: CELL_HEIGHT / 3,
          height: CELL_HEIGHT / 3,
          backgroundColor: 'red',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}/>
    );
  }

  let divStyle = {
    userSelect: 'none',
    flex: '1 1 0',
  } as React.CSSProperties;
  let viewLimitBox = React.useMemo(() => {
    return {x: -100, y: -100, w: 40000, h: 40000};
  }, []);
  return (
    <PanZoomDiv
      ref={divRef}
      viewBox={viewBox}
      viewLimitBox={viewLimitBox}
      minZoomWidth={1000}
      maxZoomWidth={40000}
      onUpdateViewBox={setViewBox}
      onMouseDown={onMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUp}
      onClick={onClick}
      style={divStyle}>
      {edges}
      {nodes}
      {selectRects}
      {hoverRect}
      {originMarker}
    </PanZoomDiv>
  );
};

interface AdminKnowledgeMapProps {
  knowledgeMap: GraphJson;
  setKnowledgeMap: (knowledgeMap: GraphJson) => void;
  knowledgeGraph: TechTree;
  grid: string[][];
  rows: number;
  cols: number;
  selectedCells: Cell[];
  setSelectedCells: (cells: Cell[]) => void;
}
let AdminKnowledgeMap = ({
  knowledgeMap,
  setKnowledgeMap,
  knowledgeGraph,
  grid,
  rows,
  cols,
  selectedCells,
  setSelectedCells,
}: AdminKnowledgeMapProps) => {
  let user = useUserContext();
  let [mode, setMode] = React.useState<'select' | 'move'>('move');
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let [dragStart, setDragStart] = React.useState<Cell | null>(null);
  let handleMouseDown = React.useCallback((
    e: MouseEvent, cancelPanZoom: () => void
  ) => {
    if (!hoverCell) {
      return;
    }
    setDragStart(hoverCell);
    if (e.shiftKey) {
      setMode('select');
    }

    if (e.shiftKey || e.ctrlKey || e.altKey) {
      cancelPanZoom();
      return;
    }

    let hoverNodeId = grid[hoverCell.i][hoverCell.j];
    if (!hoverNodeId) {
      return;
    }

    cancelPanZoom();
    let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
    if (!selectedNodeIds.includes(hoverNodeId)) {
      setSelectedCells([hoverCell]);
    }
  }, [hoverCell, selectedCells, grid]);
  let handleMouseUp = React.useCallback((e: MouseEvent) => {
    setDragStart(null);
    setMode('move');
    if (!dragStart) {
      return;
    }
    if (!hoverCell) {
      return;
    }

    let di = hoverCell.i - dragStart.i;
    let dj = hoverCell.j - dragStart.j;
    if (di !== 0 || dj !== 0) { // move selection
      let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
      if (mode === 'select') {
        let op = selectedCells.find(
          x => x.i === dragStart!.i && x.j === dragStart!.j
        ) ? 'remove' : 'add';
        let newSelectedCells = [...selectedCells];
        let mini = Math.min(hoverCell.i, dragStart.i);
        let maxi = Math.max(hoverCell.i, dragStart.i);
        let minj = Math.min(hoverCell.j, dragStart.j);
        let maxj = Math.max(hoverCell.j, dragStart.j);
        for (let i = mini; i <= maxi; ++i) {
          for (let j = minj; j <= maxj; ++j) {
            if (grid[i][j]) {
              if (op === 'add') {
                if (!selectedCells.find(x => x.i === i && x.j === j)) {
                  // TODO: slow find ^
                  newSelectedCells.push({i: i, j: j});
                }
              } else {
                let index = newSelectedCells.findIndex(
                  x => x.i === i && x.j === j
                );
                // TODO: slow find ^
                if (index > -1) {
                  newSelectedCells.splice(index, 1);
                }
              }
            }
          }
        }
        setSelectedCells(newSelectedCells);
      } else {
        let isOverlapWithOthers = selectedCells.some(x => {
          let nodeId = grid[x.i + di][x.j + dj];
          return nodeId && !selectedNodeIds.includes(nodeId);
        });
        if (isOverlapWithOthers) {
          console.error('Unable to move due to intersection');
          return;
        }

        let newNodes = knowledgeMap.nodes.map(x => {
          if (!selectedNodeIds.includes(x.id)) {
            return x;
          }
          return {
            ...x,
            cell: {
              i: x.cell.i + di,
              j: x.cell.j + dj,
            },
          };
        });
        let newKnowledgeMap = {
          ...knowledgeMap,
          nodes: newNodes,
        };
        setKnowledgeMap(newKnowledgeMap);
        setSelectedCells(selectedCells.map(x => ({i: x.i + di, j: x.j + dj})));
      }
      return;
    }

    if (e.shiftKey) { // shift = modify selection
      let hoverNodeId = grid[hoverCell.i][hoverCell.j];
      if (!hoverNodeId) {
        return;
      }

      let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
      let indexInSelection = selectedNodeIds.indexOf(hoverNodeId);
      if (indexInSelection === -1) { // not in selection, need to add
        setSelectedCells([
          ...selectedCells,
          hoverCell,
        ]);
      } else { // in selection, need to remove
        let newSelectedCells = [
          ...selectedCells
        ];
        newSelectedCells.splice(indexInSelection, 1);
        setSelectedCells(newSelectedCells);
      }
    } else if (e.ctrlKey) { // ctrl = connect selection to target
      let hoverNodeId = grid[hoverCell.i][hoverCell.j];
      if (!hoverNodeId) {
        return;
      }

      let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
      let alreadyHasAllConnections = selectedNodeIds.every(
        x => knowledgeMap.nodes.find(y => y.id === x)!.deps.includes(hoverNodeId)
      );
      let newNodes;
      if (alreadyHasAllConnections) {
        newNodes = knowledgeMap.nodes.map(x => {
          if (!selectedNodeIds.includes(x.id)) {
            return x;
          }
          return {
            ...x,
            deps: x.deps.filter(y => y !== hoverNodeId),
          };
        });
      } else {
        newNodes = knowledgeMap.nodes.map(x => {
          if (!selectedNodeIds.includes(x.id)) {
            return x;
          }
          if (x.deps.includes(hoverNodeId)) {
            return x;
          }
          return {
            ...x,
            deps: [...x.deps, hoverNodeId],
          };
        });
      }
      let newKnowledgeMap = {
        ...knowledgeMap,
        nodes: newNodes,
      };
      setKnowledgeMap(newKnowledgeMap);
    } else { // create node
      let hoverNodeId = grid[hoverCell.i][hoverCell.j];
      if (hoverNodeId) {
        return;
      }
      setKnowledgeMap({
        ...knowledgeMap,
        nodes: [...knowledgeMap.nodes, {
          id: 'NEW_MODULE_' + genId(),
          title: '',
          description: '',
          studentVideos: [],
          teacherVideos: [],
          moduleType: ModuleType.CHILD_OWNED,
          cell: hoverCell,
          deps: [],
        }],
      });
      setSelectedCells([hoverCell]);
    }
  }, [mode, dragStart, hoverCell, grid, knowledgeMap, selectedCells]);

  let handleChangeNode = React.useCallback((
    oldId: string, newVal: GraphNodeInfo
  ): void => {
    let oldNodeIndex = knowledgeMap.nodes.findIndex(x => x.id === oldId);
    if (oldNodeIndex === -1) {
      throw new Error('Could not find id ' + oldId);
    }
    let newNodeIndex = knowledgeMap.nodes.findIndex(x => x.id === newVal.id);
    if (newNodeIndex !== -1 && newNodeIndex !== oldNodeIndex) {
      throw new Error(newVal.id + ' already exists');
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id === oldId) {
          return {...x, ...newVal};
        } else if (x.deps.includes(oldId)) {
          return {...x, deps: x.deps.map(y => y === oldId ? newVal.id : y)};
        } else {
          return x;
        }
      }),
    });
  }, [knowledgeMap]);

  let handleMoveTreeHorz = React.useCallback((id: string, dir: 'left' | 'right') => {
    let updatedCells: {[id: string]: Cell} = {};
    let bfs = [id];
    let needsNegativeOffset = false;
    while (bfs.length > 0) {
      let curId = bfs.shift()!;
      if (updatedCells[curId]) {
        continue;
      }

      let oldCell = knowledgeGraph.getNodeData(curId).cell;
      let nextJ = dir === 'left' ? oldCell.j - 1 : oldCell.j + 1;
      if (nextJ < 0) {
        needsNegativeOffset = true;
      }
      updatedCells[curId] = {
        i: oldCell.i,
        j: nextJ,
      };
      if (grid[oldCell.i][nextJ]) {
        bfs.push(grid[oldCell.i][nextJ]);
      }
      let deps: string[];
      if (dir === 'left') {
        deps = knowledgeGraph.directDependenciesOf(curId);
      } else {
        deps = knowledgeGraph.directDependantsOf(curId);
      }
      deps.forEach(x => {
        let depCell = knowledgeGraph.getNodeData(x).cell;
        if (depCell.j === nextJ) {
          bfs.push(x);
        }
      });
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id in updatedCells) {
          return {...x, ...updatedCells[x.id]};
        } else {
          return x;
        }
      }).map(x => {
        if (needsNegativeOffset) {
          return {...x, cell: {...x.cell, j: x.cell.j + 1}};
        } else {
          return x;
        }
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap, knowledgeGraph, grid]);
  let handleMoveTreeRight = React.useCallback((id: string) => {
    return handleMoveTreeHorz(id, 'right');
  }, [handleMoveTreeHorz]);
  let handleMoveTreeLeft = React.useCallback((id: string) => {
    return handleMoveTreeHorz(id, 'left');
  }, [handleMoveTreeHorz]);

  let handleMoveTreeVert = React.useCallback((id: string, dir: 'up' | 'down') => {
    let updatedCells: {[id: string]: Cell} = {};
    let lockedCells: string[] = [];
    let idCell = knowledgeGraph.getNodeData(id).cell;
    if (dir === 'up' && idCell.i < rows || dir === 'down' && idCell.i > 0) {
      let lockedCellId = grid[idCell.i + (dir === 'up' ? 1 : -1)][idCell.j];
      if (lockedCellId) {
        let lockedCell = knowledgeGraph.getNodeData(lockedCellId).cell;
        lockedCells.push(lockedCellId);
        let cur: string | undefined = lockedCellId;
        while (cur) {
          cur = knowledgeGraph.directDependantsOf(cur).find(
            x => knowledgeGraph.getNodeData(x).cell.i === lockedCell.i
          );
          if (cur) {
            lockedCells.push(cur);
          }
        }
        cur = lockedCellId;
        while (cur) {
          cur = knowledgeGraph.directDependenciesOf(cur).find(
            x => knowledgeGraph.getNodeData(x).cell.i === lockedCell.i
          );
          if (cur) {
            lockedCells.push(cur);
          }
        }
      }
    }
    let bfs = [id];
    let needsNegativeOffset = false;
    while (bfs.length > 0) {
      let curId = bfs.shift()!;
      if (lockedCells.includes(curId)) {
        throw new Error('Attempted to move locked cell. Should never happen!');
      }
      if (updatedCells[curId]) {
        continue;
      }

      let oldCell = knowledgeGraph.getNodeData(curId).cell;
      let nextI = dir === 'up' ? oldCell.i - 1 : oldCell.i + 1;
      if (nextI < 0) {
        needsNegativeOffset = true;
      }
      updatedCells[curId] = {
        i: nextI,
        j: oldCell.j,
      };
      if (grid[nextI][oldCell.j]) {
        bfs.push(grid[nextI][oldCell.j]);
      }
      for (let j = oldCell.j; j < cols; ++j) {
        // if we intersect a horizontal dependency, push both ends of those down
        if (grid[nextI][j]) {
          let deps = knowledgeGraph.directDependenciesOf(grid[nextI][j]);
          let sameRowDep = deps.find(
            x => knowledgeGraph.getNodeData(x).cell.i === nextI
          );
          if (
            sameRowDep &&
            knowledgeGraph.getNodeData(sameRowDep).cell.j < oldCell.j
          ) {
            bfs.push(sameRowDep);
          }
        }
      }
      let handleDeps = (deps: string[]) => {
        let sameRowDep = deps.find(
          x => knowledgeGraph.getNodeData(x).cell.i === oldCell.i
        );
        if (sameRowDep) {
          bfs.push(sameRowDep);
          let i = oldCell.i;
          while (true) {
            let aboveIds = deps.filter(
              x => knowledgeGraph.getNodeData(x).cell.i === i - 1 &&
                  !lockedCells.includes(x)
            );
            if (aboveIds.length) {
              Array.prototype.push.apply(bfs, aboveIds);
              i -= 1;
            } else {
              break;
            }
          }
          i = oldCell.i;
          while (true) {
            let belowIds = deps.filter(
              x => knowledgeGraph.getNodeData(x).cell.i === i + 1 &&
                  !lockedCells.includes(x)
            );
            if (belowIds.length) {
              Array.prototype.push.apply(bfs, belowIds);
              i += 1;
            } else {
              break;
            }
          }
        }
      };
      handleDeps(knowledgeGraph.directDependantsOf(curId));
      handleDeps(knowledgeGraph.directDependenciesOf(curId));
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id in updatedCells) {
          return {...x, ...updatedCells[x.id]};
        } else {
          return x;
        }
      }).map(x => {
        if (needsNegativeOffset) {
          return {...x, cell: {...x.cell, i: x.cell.i + 1}};
        } else {
          return x;
        }
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap, knowledgeGraph, grid, cols]);
  let handleMoveTreeUp = React.useCallback((id: string) => {
    return handleMoveTreeVert(id, 'up');
  }, [handleMoveTreeVert]);
  let handleMoveTreeDown = React.useCallback((id: string) => {
    return handleMoveTreeVert(id, 'down');
  }, [handleMoveTreeVert]);

  let handleSelectIds = React.useCallback((idsToSelect: string[]) => {
    setSelectedCells(idsToSelect.map(x => knowledgeGraph.getNodeData(x).cell));
  }, [knowledgeGraph]);

  let handleDeleteIds = React.useCallback((idsToDelete: string[]) => {
    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.filter(x => !idsToDelete.includes(x.id)).map(x => {
        return {...x, deps: x.deps.filter(y => !idsToDelete.includes(y))};
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap]);

  return (
    <React.Fragment>
      <BaseKnowledgeMap
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        selectedCells={selectedCells}
        admin={true}
        user={user}
        onHoverCellUpdated={setHoverCell}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}/>
      <AdminToolbar selectedCells={selectedCells}
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        rows={rows}
        cols={cols}
        knowledgeMap={knowledgeMap}
        onChangeNode={handleChangeNode}
        onMoveTreeLeft={handleMoveTreeLeft}
        onMoveTreeRight={handleMoveTreeRight}
        onMoveTreeUp={handleMoveTreeUp}
        onMoveTreeDown={handleMoveTreeDown}
        onSelectIds={handleSelectIds}
        onDeleteIds={handleDeleteIds}/>
    </React.Fragment>
  );
};


interface UserKnowledgeMapProps {
  knowledgeGraph: TechTree;
  grid: string[][],
  rows: number,
  cols: number,
}

let UserKnowledgeMap = ({
  knowledgeGraph,
  grid,
}: UserKnowledgeMapProps) => {
  let user = useUserContext();

  let reached = React.useMemo(() => new Set<string>(
    Object.entries(user.progress()).filter(
      ([k, v]) => v.status === ProgressStatus.PASSED
    ).map(([k, v]) => k)
  ), [user, user.dto]);
  const { reachable, childrenReachableSets, childrenReachedSets } = React.useMemo(() => {
    if (!user.dto) {
      const result = knowledgeGraph.getReachables('hybrid', reached, new Map());
      return {
        reachable: result.reachable,
        childrenReachableSets: new Map<number, Set<string>>(),
        childrenReachedSets: new Map<number, Set<string>>()
      };
    }

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

    const userType = user.dto.type === UserType.STUDENT && (!user.dto.adults || user.dto.adults.length === 0)
      ? 'hybrid'
      : user.dto.type;

    const result = knowledgeGraph.getReachables(userType, reached, childrenReachedSets);

    return {
      reachable: result.reachable,
      childrenReachableSets: result.childrenReachableSets,
      childrenReachedSets
    };
  }, [user, reached, knowledgeGraph]);

  return (
    <React.Fragment>
      <BaseKnowledgeMap
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        reached={reached}
        reachable={reachable}
        selectedCells={[]}
        admin={false}
        user={user}
        childrenReachableSets={childrenReachableSets}
        childrenReachedSets={childrenReachedSets}/>
    </React.Fragment>
  );
};

export let KnowledgeMap = () => {

  let url = new URL(window.location.href);
  let admin = url.searchParams.get('admin') === '1';

  let [knowledgeMap, _setKnowledgeMap] = React.useState(KNOWLEDGE_MAP);
  let setKnowledgeMap = React.useCallback((m: typeof KNOWLEDGE_MAP) => {
    let acc: {[id: string]: number} = {};
    m.nodes.forEach(x => {
      acc[x.id] = (acc[x.id] || 0) + 1;
      if (acc[x.id] !== 1) {
        throw new Error('We tried to set an invalid map! Duplicate id ' + x.id);
      }
    });

    m.nodes.forEach(x => {
      x.deps.forEach(d => {
        if (!acc[d]) {
          throw new Error('Invalid dependency ' + d + ' on ' + x.id);
        }
      });
    });
    _setKnowledgeMap(m);
  }, []);
  let knowledgeGraph = React.useMemo(() => {
    return buildGraph(knowledgeMap);
  }, [knowledgeMap]);
  let {grid, rows, cols} = React.useMemo(() => {
    knowledgeGraph.clearMemo();
    return knowledgeGraph.memoizedGrid();
  }, [knowledgeGraph]);
  let [selectedCells, setSelectedCells] = React.useState<Cell[]>([]);

  let ret;
  if (admin) {
    ret = (
      <AdminKnowledgeMap
        knowledgeMap={knowledgeMap}
        setKnowledgeMap={setKnowledgeMap}
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        rows={rows}
        cols={cols}
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}/>
    );
  } else {
    ret = (
      <UserKnowledgeMap
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        rows={rows}
        cols={cols}/>
    );
  }
  let containerStyle: React.CSSProperties = {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <NavBar/>
      <div style={containerStyle}>
        {ret}
      </div>
    </div>
  );
};

