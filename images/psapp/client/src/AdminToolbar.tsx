import React from 'react';
import {Link} from 'react-router-dom';

import {Cell} from './types';
import {TechTree} from './dependency-graph';
import {
  GraphJson, KNOWLEDGE_MAP, VideoInfo, GraphNodeInfo
} from '../../common/types';

export let TOOLBAR_WIDTH = '550px';

type C = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type M = React.MouseEvent<HTMLButtonElement>;

let mapToMdLinks = (videoInfos: VideoInfo[]): string => {
  return videoInfos.map(({title, url}) => {
    return `[${title}](${url})`; // markdown format
  }).join('\n');
};

let mapFromMdLinks = (str: string): VideoInfo[] => {
  let ret: VideoInfo[] = [];
  let lines = str.split('\n').map(x => x.trim()).filter(x => !!x);
  for (let line of lines) {
    let match = line.match(/^\[([^\[\]]+)\]\(([^\(\)]+)\)$/);
    if (!match) {
      throw new Error('md links not valid');
    }
    ret.push({
      title: match[1],
      url: match[2],
    });
  }
  return ret;
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
  React.useEffect(() => {
    setTempStudentVids(mapToMdLinks(node.studentVideos));
    setTempTeacherVids(mapToMdLinks(node.teacherVideos));
  }, [node]);
  React.useEffect(() => {
    setTempId(kmid);
    setTimeout(() => {
      ref.current!.focus();
      ref.current!.select();
    }, 0);
  }, [kmid]);
  let handleChangeId = React.useCallback((e: C) => {
    setTempId(e.target.value);
  }, []);
  let handleChangeTitle = React.useCallback((e: C) => {
    setTempTitle(e.target.value);
  }, []);
  let handleChangeDesc = React.useCallback((e: C) => {
    setTempDesc(e.target.value);
  }, []);
  let handleChangeStudentVids = React.useCallback((e: C) => {
    setTempStudentVids(e.target.value);
  }, []);
  let handleChangeTeacherVids = React.useCallback((e: C) => {
    setTempTeacherVids(e.target.value);
  }, []);

  let handleSubmit = React.useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newStudentVids;
    try {
      newStudentVids = mapFromMdLinks(tempStudentVids);
    } catch (e) {
      if (!(e instanceof Error && e.message.includes('md links not valid'))) {
        throw e;
      }
      alert('Student video links were not valid');
      return;
    }

    let newTeacherVids;
    try {
      newTeacherVids = mapFromMdLinks(tempTeacherVids);
    } catch (e) {
      if (!(e instanceof Error && e.message.includes('md links not valid'))) {
        throw e;
      }
      alert('Teacher video links were not valid');
      return;
    }

    props.onChangeNode(kmid, {
      id: tempId,
      title: tempTitle,
      description: tempDesc,
      studentVideos: newStudentVids,
      teacherVideos: newTeacherVids,
    });
  }, [
    kmid,
    tempId,
    tempTitle,
    tempDesc,
    tempStudentVids,
    tempTeacherVids,
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text"
              style={{width: '100%'}}
              ref={ref}
              value={tempId}
              placeholder="id"
              onChange={handleChangeId}/>
        </div>
        <div>
          <input type="text"
              style={{width: '100%'}}
              value={tempTitle}
              placeholder="title"
              onChange={handleChangeTitle}/>
        </div>
        <div>
          <textarea
              style={{width: '100%'}}
              value={tempDesc}
              placeholder="description"
              onChange={handleChangeDesc}/>
        </div>
        Learning videos:
        <div>
          <textarea
              style={{width: '100%'}}
              value={tempStudentVids}
              placeholder="videos for learning"
              onChange={handleChangeStudentVids}/>
        </div>
        Teaching videos:
        <div>
          <textarea
              style={{width: '100%'}}
              value={tempTeacherVids}
              placeholder="videos for teaching"
              onChange={handleChangeTeacherVids}/>
        </div>
        <div>
          <button type="submit">Apply</button>
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
          onMoveTreeDown={props.onMoveTreeDown}/>
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

  let downloadJson = React.useCallback((data: any, filename: string) => {
    let blob = new Blob(
      [JSON.stringify(data, undefined, 2)],
      {type: 'text/json'}
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
    downloadJson(props.knowledgeMap, 'knowledge-map.json');
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
        <button onClick={handleSelectAll}>Select All</button>
      </div>
      <div>
        <button onClick={handleExportGraph}>Export Graph</button>
      </div>
      <div>
        {props.knowledgeMap.nodes.length}
      </div>
      <div>
        {props.rows + 1}X{props.cols + 1}
      </div>
    </div>
  );
};

