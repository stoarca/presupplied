import React from 'react';

export const Module = (props: any) => {
  let {children, score, maxScore, ...rest} = props;
  const containerStyle = {
    width: '100%',
    height: '100%',
  };
  const scoreStyle = {
    position: 'fixed',
    top: 10,
    right: 10,
  } as React.CSSProperties;
  return (
    <div style={containerStyle} {...rest}>
      {children}
      <div style={scoreStyle}>
        Score: {score}/{maxScore}
      </div>
    </div>
  );
};
