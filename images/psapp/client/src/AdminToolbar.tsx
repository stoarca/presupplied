import React from 'react';
import { Link } from 'react-router-dom';

import { Cell } from './types';
import { TechTree } from './dependency-graph';
import {
  KNOWLEDGE_MAP, VideoId, GraphNodeInfo, ModuleType
} from '../../common/types';
import { moduleComponents } from './ModuleContext';

export let TOOLBAR_WIDTH = '550px';

type CI = React.ChangeEvent<HTMLInputElement>;
type CT = React.ChangeEvent<HTMLTextAreaElement>;
type M = React.MouseEvent<HTMLButtonElement>;

let mapToVideoIds = (videoIds: VideoId[]): string => {
  return videoIds.join(', ');
};

let mapFromVideoIds = (str: string): VideoId[] => {
  return str.split(',').map(x => x.trim()).filter(x => !!x) as VideoId[];
};

let getUnimplementedDependencies = (
  moduleId: string,
  knowledgeGraph: TechTree
): string[] => {
  const visited = new Set<string>();
  const unimplemented: string[] = [];

  const collectDependencies = (nodeId: string) => {
    if (visited.has(nodeId)) {
      return;
    }
    visited.add(nodeId);

    try {
      const dependencies = knowledgeGraph.directDependenciesOf(nodeId);
      for (const dep of dependencies) {
        if (!moduleComponents[dep]) {
          unimplemented.push(dep);
        }
        collectDependencies(dep);
      }
    } catch {
      // Module doesn't exist in graph, skip
    }
  };

  collectDependencies(moduleId);
  return [...new Set(unimplemented)];
};

interface ToolbarForOneProps {
  selectedCell: Cell,
  grid: string[][],
  knowledgeGraph: TechTree,
  onChangeNode: (oldId: string, newVal: GraphNodeInfo) => void,
  onMoveTreeLeft: (id: string) => void,
  onMoveTreeRight: (id: string) => void,
  onMoveTreeUp: (id: string) => void,
  onMoveTreeDown: (id: string) => void,
}

let ToolbarForOne = (props: ToolbarForOneProps) => {
  let ref = React.useRef<HTMLInputElement>(null);
  let kmid = props.grid[props.selectedCell.i][props.selectedCell.j];
  let node = props.knowledgeGraph.getNodeData(kmid);
  let [tempId, setTempId] = React.useState(kmid);
  let [tempTitle, setTempTitle] = React.useState(node.title);
  let [tempDesc, setTempDesc] = React.useState(node.description);
  let [tempStudentVids, setTempStudentVids] = React.useState('');
  let [tempTeacherVids, setTempTeacherVids] = React.useState('');
  let [tempModuleType, setTempModuleType] = React.useState(node.moduleType);
  React.useEffect(() => {
    setTempTitle(node.title);
    setTempDesc(node.description);
    setTempStudentVids(mapToVideoIds(node.studentVideos));
    setTempTeacherVids(mapToVideoIds(node.teacherVideos));
    setTempModuleType(node.moduleType);
  }, [node]);
  React.useEffect(() => {
    setTempId(kmid);
    setTimeout(() => {
      ref.current!.focus();
      ref.current!.select();
    }, 0);
  }, [kmid]);
  let handleChangeId = React.useCallback((e: CI) => {
    setTempId(e.target.value);
  }, []);
  let handleChangeTitle = React.useCallback((e: CI) => {
    setTempTitle(e.target.value);
  }, []);
  let handleChangeDesc = React.useCallback((e: CT) => {
    setTempDesc(e.target.value);
  }, []);
  let handleChangeStudentVids = React.useCallback((e: CT) => {
    setTempStudentVids(e.target.value);
  }, []);
  let handleChangeTeacherVids = React.useCallback((e: CT) => {
    setTempTeacherVids(e.target.value);
  }, []);
  let handleChangeModuleType = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === ModuleType.ADULT_OWNED ||
        value === ModuleType.CHILD_DELEGATED ||
        value === ModuleType.CHILD_OWNED) {
      setTempModuleType(value);
    } else {
      throw new Error(`Invalid module type: ${value}`);
    }
  }, []);


  let handleSubmit = React.useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newStudentVids = mapFromVideoIds(tempStudentVids);
    const newTeacherVids = mapFromVideoIds(tempTeacherVids);

    props.onChangeNode(kmid, {
      id: tempId,
      title: tempTitle,
      description: tempDesc,
      studentVideos: newStudentVids,
      teacherVideos: newTeacherVids,
      moduleType: tempModuleType,
    });
  }, [
    kmid,
    tempId,
    tempTitle,
    tempDesc,
    tempStudentVids,
    tempTeacherVids,
    tempModuleType,
    props.onChangeNode,
  ]);

  let handleMoveTreeLeft = React.useCallback((e: M) => {
    props.onMoveTreeLeft(kmid);
  }, [kmid, props.onMoveTreeLeft]);

  let handleMoveTreeRight = React.useCallback((e: M) => {
    props.onMoveTreeRight(kmid);
  }, [kmid, props.onMoveTreeRight]);

  let handleMoveTreeUp = React.useCallback((e: M) => {
    props.onMoveTreeUp(kmid);
  }, [kmid, props.onMoveTreeUp]);

  let handleMoveTreeDown = React.useCallback((e: M) => {
    props.onMoveTreeDown(kmid);
  }, [kmid, props.onMoveTreeDown]);

  const unimplementedDeps = React.useMemo(() => {
    return getUnimplementedDependencies(kmid, props.knowledgeGraph);
  }, [kmid, props.knowledgeGraph]);

  return (
    <div data-test="module-edit-dialog">
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text"
            data-test="module-id-input"
            style={{ width: '100%' }}
            ref={ref}
            value={tempId}
            placeholder="id"
            onChange={handleChangeId} />
        </div>
        <div>
          <input type="text"
            style={{ width: '100%' }}
            value={tempTitle}
            placeholder="title"
            onChange={handleChangeTitle} />
        </div>
        <div>
          <textarea
            style={{ width: '100%' }}
            value={tempDesc}
            placeholder="description"
            onChange={handleChangeDesc} />
        </div>
        Learning videos:
        <div>
          <textarea
            style={{ width: '100%' }}
            value={tempStudentVids}
            placeholder="video IDs for learning (comma-separated)"
            onChange={handleChangeStudentVids} />
        </div>
        Teaching videos:
        <div>
          <textarea
            style={{ width: '100%' }}
            value={tempTeacherVids}
            placeholder="video IDs for teaching (comma-separated)"
            onChange={handleChangeTeacherVids} />
        </div>
        <div>
          <label>
            Module Type:
            <select
              value={tempModuleType}
              onChange={handleChangeModuleType}
              style={{ width: '100%' }}>
              <option value={ModuleType.CHILD_OWNED}>Child Owned - Completed by child, tracked per child</option>
              <option value={ModuleType.CHILD_DELEGATED}>Child Delegated - Completed by adult on behalf of child, tracked per child</option>
              <option value={ModuleType.ADULT_OWNED}>Adult Owned - Completed by adult, tracked per adult</option>
            </select>
          </label>
        </div>
        <div>
          <button type="submit" data-test="apply-button">Apply</button>
        </div>
      </form>
      <div>
        <Link to={`/modules/${kmid}`}>
          Go to lesson
        </Link>
      </div>
      <div>
        {JSON.stringify(props.selectedCell)}
      </div>
      <div>
        <button onClick={handleMoveTreeLeft}>Move Tree Left</button>
      </div>
      <div>
        <button onClick={handleMoveTreeRight}>Move Tree Right</button>
      </div>
      <div>
        <button onClick={handleMoveTreeUp}>Move Tree Up</button>
      </div>
      <div>
        <button onClick={handleMoveTreeDown}>Move Tree Down</button>
      </div>
      {unimplementedDeps.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          <strong>Unimplemented Dependencies:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {unimplementedDeps.slice(0, 5).map(dep => (
              <li key={dep} style={{ color: '#cc0000' }}>{dep}</li>
            ))}
            {unimplementedDeps.length > 5 && (
              <li style={{ color: '#666', fontStyle: 'italic' }}>
                ... and {unimplementedDeps.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

interface ToolbarProps {
  knowledgeMap: typeof KNOWLEDGE_MAP,
  knowledgeGraph: TechTree,
  selectedCells: Cell[],
  grid: string[][],
  rows: number,
  cols: number,
  onChangeNode: (oldId: string, newVal: GraphNodeInfo) => void,
  onMoveTreeLeft: (id: string) => void,
  onMoveTreeRight: (id: string) => void,
  onMoveTreeUp: (id: string) => void,
  onMoveTreeDown: (id: string) => void,
  onSelectIds: (ids: string[]) => void,
  onDeleteIds: (ids: string[]) => void,
}

export let AdminToolbar = (props: ToolbarProps) => {
  let forOne = null;
  if (props.selectedCells.length === 1) {
    forOne = (
      <ToolbarForOne
        selectedCell={props.selectedCells[0]}
        knowledgeGraph={props.knowledgeGraph}
        grid={props.grid}
        onChangeNode={props.onChangeNode}
        onMoveTreeLeft={props.onMoveTreeLeft}
        onMoveTreeRight={props.onMoveTreeRight}
        onMoveTreeUp={props.onMoveTreeUp}
        onMoveTreeDown={props.onMoveTreeDown} />
    );
  }

  let handleDelete = React.useCallback((e: M) => {
    props.onDeleteIds(props.selectedCells.map(x => props.grid[x.i][x.j]));
  }, [props.selectedCells, props.grid, props.onDeleteIds]);
  let forSelected = null;
  if (props.selectedCells.length > 0) {
    forSelected = (
      <div>
        <button onClick={handleDelete}>Delete Selected</button>
      </div>
    );
  }

  let handleSelectAll = React.useCallback((e: M) => {
    props.onSelectIds(props.knowledgeMap.nodes.map(x => x.id));
  }, [props.onSelectIds]);

  let handleSelectClosureOfDependencies = React.useCallback((e: M) => {
    if (props.selectedCells.length === 0) {
      return;
    }

    const selectedIds = props.selectedCells.map(cell => props.grid[cell.i][cell.j]);
    const closure = new Set<string>();

    const collectDependencies = (nodeId: string) => {
      if (closure.has(nodeId)) {
        return;
      }
      closure.add(nodeId);

      try {
        const dependencies = props.knowledgeGraph.directDependenciesOf(nodeId);
        for (const dep of dependencies) {
          collectDependencies(dep);
        }
      } catch {
        // Node doesn't exist in graph, skip
      }
    };

    for (const id of selectedIds) {
      collectDependencies(id);
    }

    props.onSelectIds(Array.from(closure));
  }, [props.selectedCells, props.grid, props.knowledgeGraph, props.onSelectIds]);

  let handleSelectClosureOfDependents = React.useCallback((e: M) => {
    if (props.selectedCells.length === 0) {
      return;
    }

    const selectedIds = props.selectedCells.map(cell => props.grid[cell.i][cell.j]);
    const closure = new Set<string>();

    const collectDependents = (nodeId: string) => {
      if (closure.has(nodeId)) {
        return;
      }
      closure.add(nodeId);

      try {
        const dependents = props.knowledgeGraph.directDependentsOf(nodeId);
        for (const dep of dependents) {
          collectDependents(dep);
        }
      } catch {
        // Node doesn't exist in graph, skip
      }
    };

    for (const id of selectedIds) {
      collectDependents(id);
    }

    props.onSelectIds(Array.from(closure));
  }, [props.selectedCells, props.grid, props.knowledgeGraph, props.onSelectIds]);

  let downloadJson = React.useCallback((data: any, filename: string) => {
    let blob = new Blob(
      [JSON.stringify(data, undefined, 2)],
      { type: 'text/json' }
    );
    let a = document.createElement('a');
    //a.style = 'display: none';
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(a.href);
    a.remove();
  }, []);

  let handleExportGraph = React.useCallback((e: M) => {
    // Filter out test modules and their dependencies/dependents
    const filteredNodes = props.knowledgeMap.nodes.filter(node => {
      return !node.id.startsWith('PS_TESTING_');
    });

    // Remove dependencies on test modules from remaining nodes
    const cleanedNodes = filteredNodes.map(node => ({
      ...node,
      deps: node.deps.filter(dep => !dep.startsWith('PS_TESTING_'))
    }));

    const exportMap = {
      ...props.knowledgeMap,
      nodes: cleanedNodes
    };

    downloadJson(exportMap, 'knowledge-map.json');
  }, [props.knowledgeMap, downloadJson]);

  let toolbarStyle = {
    position: 'fixed',
    width: TOOLBAR_WIDTH,
    height: '100%',
    background: 'red',
    top: 0,
    right: 0,
  } as React.CSSProperties;
  return (
    <div style={toolbarStyle}>
      {forOne}
      {forSelected}
      <div>
        <button onClick={handleSelectClosureOfDependencies}>Select closure of dependencies</button>
      </div>
      <div>
        <button onClick={handleSelectClosureOfDependents}>Select closure of dependents</button>
      </div>
      <div>
        <button onClick={handleSelectAll}>Select All</button>
      </div>
      <div>
        <button onClick={handleExportGraph}>Export Graph</button>
      </div>
      <div>
        {(() => {
          const total = props.knowledgeMap.nodes.length;
          const implemented = props.knowledgeMap.nodes.filter(node => {
            return moduleComponents[node.id] !== undefined;
          }).length;
          return `${implemented}/${total}`;
        })()}
      </div>
      <div>
        {props.rows + 1}X{props.cols + 1}
      </div>
    </div>
  );
};

