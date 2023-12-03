import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import {moduleComponents} from './ModuleContext';
import {KnowledgeMap} from './KnowledgeMap';
import {List} from './List';
import {Login} from './Login';
import {Register} from './Register';
import {Student, StudentContext} from './StudentContext';
import {typedFetch} from './typedFetch';

interface AppProps {
  student: Student;
};
const defaultTheme = createTheme();
let App = (props: AppProps) => {
  let moduleRoutes = Object.keys(moduleComponents).map(x => {
    return <Route key={x} path={x} element={moduleComponents[x]}/>
  });

  return (
    <StudentContext.Provider value={props.student}>
      <CssBaseline/>
      <ThemeProvider theme={defaultTheme}>
        <Router>
          <React.Suspense fallback={"loading..."}>
            <Routes>
              <Route path="/">
                <Route index element={<List/>}/>
                <Route path="map" element={<KnowledgeMap/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="modules">
                  {moduleRoutes}
                  <Route path="*" element={<div>module not found</div>}/>
                </Route>
                <Route path="*" element={<div>page not found</div>}/>
              </Route>
            </Routes>
          </React.Suspense>
        </Router>
      </ThemeProvider>
    </StudentContext.Provider>
  );
};

(async () => {
  let resp = await typedFetch({
    endpoint: '/api/student',
    method: 'get',
  });
  let student = new Student(resp.student);
  let root = createRoot(document.getElementById('content')!);
  root.render(<App student={student}/>);
})();
