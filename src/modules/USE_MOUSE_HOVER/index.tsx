import React from 'react';

import {buildLesson} from '../LessonBuilder';

interface LessonProps {
}

let playInstructions = () => {
  let audio = new Audio('./instructions.wav');
  audio.play();
};
playInstructions();
let interval = setInterval(playInstructions, 15000);

export const Lesson = (props: LessonProps) => {
  const TARGET_RADIUS = 75;
  const [numCorrect, setNumCorrect] = React.useState(0);
  const [targetCoords, setTargetCoords] = React.useState({
    x: TARGET_RADIUS + Math.random() * (window.innerWidth - 2 * TARGET_RADIUS),
    y: TARGET_RADIUS + Math.random() * (window.innerHeight - 2 * TARGET_RADIUS),
  });

  React.useEffect(() => {
  }, []);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const dx = e.clientX - targetCoords.x;
    const dy = e.clientY - targetCoords.y;
    if (dx*dx + dy*dy < TARGET_RADIUS * TARGET_RADIUS) {
      clearInterval(interval);
      interval = setInterval(playInstructions, 15000);

      let audio = new Audio('./good_job.wav');
      audio.play();
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
  }, [numCorrect]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    let audio = new Audio('./oh_no_you_clicked.wav');
    audio.play();
    setNumCorrect(0);
  }, []);

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
        <circle cx={targetCoords.x} cy={targetCoords.y} r={TARGET_RADIUS} fill="red"/>
      </svg>
      <div style={scoreStyle}>
        Score: {numCorrect}
      </div>
    </div>
  );
};

buildLesson(<Lesson/>);

