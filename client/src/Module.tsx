import React from 'react';

interface ModuleProps {
  children: React.ReactNode,
  score: number,
  maxScore: number,
  type: 'svg',
  [id: string]: any,
};

export const Module: React.FC<ModuleProps> = (props) => {
  let {children, score, maxScore, type, ...rest} = props;

  const scoreStyle = {
    position: 'fixed',
    top: 10,
    right: 10,
  } as React.CSSProperties;
  let scoreEl = (
    <div style={scoreStyle}>
      Score: {score}/{maxScore}
    </div>
  );

  const containerStyle = {
    width: '100%',
    height: '100%',
    userSelect: 'none',
  } as React.CSSProperties;

  if (type === 'svg') {
    let svgStyle = {
      width: '100%',
      height: '100%',
      display: 'block',
    };
    return (
      <div style={containerStyle} {...rest}>
        <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
          {children}
        </svg>
        {scoreEl}
      </div>
    );
  } else {
    return null;
  }
};
