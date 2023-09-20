import React from 'react';
import {Link} from 'react-router-dom';

import {Cell} from './types';
import {GraphJson} from '../../common/types';
import _KNOWLEDGE_MAP from '../../static/knowledge-map.json';
let KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

export let TOOLBAR_WIDTH = '350px';

interface Progress {
  reached: string[],
}

interface ToolbarForOneProps {
  selectedCell: Cell,
  grid: string[][],
  reached: Set<string>,
  onChangeId: (oldId: string, newId: string) => void,
  onChangeReached: (newReached: Set<string>) => void,
  onMoveTreeLeft: (id: string) => void,
  onMoveTreeRight: (id: string) => void,
  onMoveTreeUp: (id: string) => void,
  onMoveTreeDown: (id: string) => void,
}

let ToolbarForOne = (props: ToolbarForOneProps) => {
  let ref = React.useRef<HTMLInputElement>(null);
  let kmid = props.grid[props.selectedCell.i][props.selectedCell.j];

  let [tempId, setTempId] = React.useState(kmid);
  React.useEffect(() => {
    setTempId(kmid);
    setTimeout(() => {
      ref.current!.focus();
      ref.current!.select();
    }, 0);
  }, [kmid]);
  let handleChangeInput = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTempId(e.target.value);
  }, []);

  let handleSubmit = React.useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onChangeId(kmid, tempId);
  }, [kmid, tempId, props.onChangeId]);

  let handleChangeReached = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let newReached = new Set(props.reached);
    if (e.target.checked) {
      newReached.add(kmid);
    } else {
      newReached.delete(kmid);
    }
    props.onChangeReached(newReached);
  }, [kmid, props.reached, props.onChangeReached]);

  let handleMoveTreeLeft = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeLeft(kmid);
  }, [kmid, props.onMoveTreeLeft]);

  let handleMoveTreeRight = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeRight(kmid);
  }, [kmid, props.onMoveTreeRight]);

  let handleMoveTreeUp = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeUp(kmid);
  }, [kmid, props.onMoveTreeUp]);

  let handleMoveTreeDown = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeDown(kmid);
  }, [kmid, props.onMoveTreeDown]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text"
              ref={ref}
              value={tempId}
              onChange={handleChangeInput}/>
        </div>
        <div>
          <button type="submit">Apply</button>
        </div>
      </form>
      <div>
        <label>
          <input type="checkbox"
              checked={props.reached.has(kmid)}
              onChange={handleChangeReached}/>
          Reached
        </label>
      </div>
      <div>
        <Link to={`/modules/${kmid}`}>
          Go to lesson
        </Link>
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
  selectedCells: Cell[],
  grid: string[][],
  reached: Set<string>,
  onChangeId: (oldId: string, newId: string) => void,
  onChangeReached: (newReached: Set<string>) => void,
  onMoveTreeLeft: (id: string) => void,
  onMoveTreeRight: (id: string) => void,
  onMoveTreeUp: (id: string) => void,
  onMoveTreeDown: (id: string) => void,
  onSelectIds: (ids: string[]) => void,
  onDeleteIds: (ids: string[]) => void,
}

export let AdminToolbar = (props: ToolbarProps) => {
  let size = React.useMemo(() => {
    let maxi = 0;
    let maxj = 0;
    for (let i = 0; i < props.grid.length; ++i) {
      for (let j = 0; j < props.grid[i].length; ++j) {
        if (props.grid[i][j]) {
          maxi = Math.max(i, maxi);
          maxj = Math.max(j, maxj);
        }
      }
    }
    return {rows: maxi + 1, cols: maxj + 1};
  }, [props.grid]);

  let forOne = null;
  if (props.selectedCells.length === 1) {
    forOne = (
      <ToolbarForOne
          selectedCell={props.selectedCells[0]}
          grid={props.grid}
          reached={props.reached}
          onChangeId={props.onChangeId}
          onChangeReached={props.onChangeReached}
          onMoveTreeLeft={props.onMoveTreeLeft}
          onMoveTreeRight={props.onMoveTreeRight}
          onMoveTreeUp={props.onMoveTreeUp}
          onMoveTreeDown={props.onMoveTreeDown}/>
    );
  }

  let handleDelete = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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

  let handleSelectAll = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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

  let uploadJson = React.useCallback(() => {
    return new Promise((resolve) => {
      let input = document.createElement('input');
      input.type='file';
      document.body.appendChild(input);
      input.addEventListener('change', (e) => {
        if (!input.files) {
          throw new Error('No files specified');
        }
        if (input.files.length !==  1) {
          throw new Error('Wrong number of files uploaded');
        }
        let file = input.files[0];
        let reader = new FileReader();
        reader.onload = (e) => { resolve(JSON.parse(e.target!.result as string)); };
        reader.readAsText(file);
      });
      input.click();
      input.remove();
    });
  }, []);

  let handleExportGraph = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    downloadJson(props.knowledgeMap, 'knowledge-map.json');
  }, [props.knowledgeMap, downloadJson]);

  let handleExportProgress = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    downloadJson({
      reached: Array.from(props.reached),
    }, 'progress.json');
  }, [props.reached]);

  let handleImportProgress = React.useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    let newProgress = await uploadJson() as Progress;
    props.onChangeReached(new Set(newProgress.reached));
  }, [props.onChangeReached]);

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
        <button onClick={handleExportProgress}>Export Progress</button>
      </div>
      <div>
        <button onClick={handleImportProgress}>Import Progress</button>
      </div>
      <div>
        {props.knowledgeMap.nodes.length}
      </div>
      <div>
        {size.rows}X{size.cols}
      </div>
    </div>
  );
};
