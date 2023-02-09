import React from 'react';

import {ModuleContext} from '../../ModuleContext';

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  const TARGET_RADIUS = 30;
  const [numCorrect, setNumCorrect] = React.useState(0);
  const [targetCoords, setTargetCoords] = React.useState({
    x: TARGET_RADIUS + Math.random() * (window.innerWidth - 2 * TARGET_RADIUS),
    y: TARGET_RADIUS + Math.random() * (window.innerHeight - 2 * TARGET_RADIUS),
  });

  const playInstructions = React.useCallback(() => {
    moduleContext.playModuleAudio('instructions.wav');
  }, [moduleContext]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);
  React.useEffect(() => {
    let interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, targetCoords]);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const dx = e.clientX - targetCoords.x;
    const dy = e.clientY - targetCoords.y;
    if (dx*dx + dy*dy < TARGET_RADIUS * TARGET_RADIUS) {
      moduleContext.playSharedModuleAudio('good_job.wav');
      setNumCorrect(numCorrect + 1);
      let newTargetCoords;
      do {
        newTargetCoords = {
          x: TARGET_RADIUS + Math.random() * (window.innerWidth - 2 * TARGET_RADIUS),
          y: TARGET_RADIUS + Math.random() * (window.innerHeight - 2 * TARGET_RADIUS),
        };
        let ndx = newTargetCoords.x - targetCoords.x;
        let ndy = newTargetCoords.y - targetCoords.y;
        if (ndx * ndx + ndy * ndy > TARGET_RADIUS * TARGET_RADIUS * 5 * 5) {
          break;
        }
      } while (true);

      setTargetCoords(newTargetCoords);
    }
  }, [numCorrect, moduleContext]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    moduleContext.playModuleAudio('oh_no_you_clicked.wav');
    setNumCorrect(0);
  }, [moduleContext]);

  const containerStyle = {
    width: '100%',
    height: '100%',
  };
  const svgStyle = {
    width: '100%',
    height: '100%',
  };
  const scoreStyle = {
    position: 'fixed',
    top: 10,
    right: 10,
  } as React.CSSProperties;
  return (
    <div style={containerStyle}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
      <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
        <circle cx={targetCoords.x} cy={targetCoords.y} r={TARGET_RADIUS} fill="blue"/>
      </svg>
      <div style={scoreStyle}>
        Score: {numCorrect}
      </div>
    </div>
  );
};

