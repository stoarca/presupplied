import React from 'react';

import {Module, useExercise, Ex, DoSuccessProps} from '@src/Module';

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
  React.useEffect(() => {
    let listener = async (e: KeyboardEvent) => {
      if (e.key === 'y') {
        doSuccess({sound: goodDing});
      } else if (e.key === 'n') {
        doFailure();
      }
    };
    document.addEventListener('keypress', listener);
    return () => document.removeEventListener('keypress', listener);
  }, [doSuccess, doFailure]);

  let textStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    fill: '#cccccc',
  };

  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      {children}
      <text style={textStyle}
          dominantBaseline="central"
          textAnchor="middle"
          y="98%"
          x="50%">
        Teacher: Press y to accept and n to reject
      </text>
    </Module>
  );
};
