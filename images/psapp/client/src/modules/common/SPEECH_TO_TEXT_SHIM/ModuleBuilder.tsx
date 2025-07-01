import React from 'react';

import {Module, DoSuccessProps} from '@src/Module';

import {goodDing} from '@modules/common/sounds';

interface ModuleProps {
  children: React.ReactNode,
  doSuccess: (options: DoSuccessProps) => void,
  doFailure: () => void,
  score: number,
  maxScore: number,
}

export let STTModule: React.FC<ModuleProps> = ({
  doSuccess, doFailure, score, maxScore, children,
}) => {
  const [showButtons, setShowButtons] = React.useState(false);

  React.useEffect(() => {
    let listener = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'y') {
        doSuccess({sound: goodDing});
      } else if (e.key.toLowerCase() === 'n') {
        doFailure();
      }
    };
    document.addEventListener('keypress', listener);
    return () => document.removeEventListener('keypress', listener);
  }, [doSuccess, doFailure]);

  const handleTextClick = React.useCallback(() => {
    setShowButtons(!showButtons);
  }, [showButtons]);

  const handleAccept = React.useCallback(() => {
    doSuccess({sound: goodDing});
  }, [doSuccess]);

  const handleReject = React.useCallback(() => {
    doFailure();
  }, [doFailure]);

  let textStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    fill: '#cccccc',
    cursor: 'pointer',
  };

  let buttonStyle: React.CSSProperties = {
    cursor: 'pointer',
  };

  let acceptButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    fill: '#4CAF50',
  };

  let rejectButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    fill: '#f44336',
  };

  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      {children}
      <g onClick={handleTextClick} style={{cursor: 'pointer'}}>
        <text style={textStyle}
          dominantBaseline="central"
          textAnchor="middle"
          y="98%"
          x="50%">
          Teacher: Press y to accept and n to reject
        </text>
      </g>
      {showButtons && (
        <g>
          <g onClick={handleReject} transform="translate(-60, -30)">
            <circle cx="45%" cy="98%" r="24" style={rejectButtonStyle} opacity="0.2"/>
            <text x="45%" y="98%"
              dominantBaseline="central"
              textAnchor="middle"
              style={{...rejectButtonStyle, fontSize: '24px', fontWeight: 'bold'}}>
              ✗
            </text>
          </g>
          <g onClick={handleAccept} transform="translate(60, -30)">
            <circle cx="55%" cy="98%" r="24" style={acceptButtonStyle} opacity="0.2"/>
            <text x="55%" y="98%"
              dominantBaseline="central"
              textAnchor="middle"
              style={{...acceptButtonStyle, fontSize: '24px', fontWeight: 'bold'}}>
              ✓
            </text>
          </g>
        </g>
      )}
    </Module>
  );
};
