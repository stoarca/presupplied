import React from 'react';

export let useInstructions = (
  fn: () => Promise<void>,
  exerciseDep: any,
  deps: any[]
) => {
  let [playingInstructions, setPlayingInstructions] = React.useState(false);
  let playInstructions = React.useCallback(fn, deps);
  React.useEffect(() => {
    (async () => {
      setPlayingInstructions(true);
      await playInstructions();
      setPlayingInstructions(false);
    })();
  }, [playInstructions]);
  React.useEffect(() => {
    let interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, exerciseDep]);
  return playingInstructions;
};

interface ModuleProps {
  children: React.ReactNode,
  score: number,
  maxScore: number,
  type: 'svg',
  [id: string]: any,
};

export let Module: React.FC<ModuleProps> = (props) => {
  let {children, score, maxScore, type, ...rest} = props;

  let ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    console.log(ref.current);
    let preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };
    let el = ref.current!;
    el.addEventListener('touchmove', preventDefault);
    return () => el.removeEventListener('touchmove', preventDefault);
  }, []);

  let handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  let scoreStyle = {
    position: 'fixed',
    top: 10,
    right: 10,
    fontSize: '20px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  } as React.CSSProperties;
  let scoreEl = (
    <div style={scoreStyle}>
      Score: {score} / {maxScore}
    </div>
  );

  let containerStyle = {
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
      <div style={containerStyle}
          ref={ref}
          onContextMenu={handleContextMenu}
          {...rest}>
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
