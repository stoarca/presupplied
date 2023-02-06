import React from 'react';
import {createRoot} from 'react-dom/client';

export const buildLesson = (component: React.ReactNode) => {
  let root = createRoot(document.getElementById('content')!);
  root.render(component);
};
