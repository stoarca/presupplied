import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { setupTestMode } from './testMode';

import {moduleComponents} from './ModuleContext';
import {KnowledgeMap} from './KnowledgeMap';
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import {User, UserContext} from './UserContext';
import {typedFetch, API_HOST} from './typedFetch';
import { HomePage } from './pages/HomePage';
import { Debug } from './pages/Debug';
import { Settings } from './pages/Settings';
import { GeneralSettingsPage } from './pages/GeneralSettingsPage';
import { ManageChildrenPage } from './pages/ManageChildrenPage';
import { CreateChildPage } from './pages/CreateChildPage';
import { ChildProfile } from './pages/ChildProfile';
import { EditChildPage } from './pages/EditChildPage';
import { PendingInvitations } from './pages/PendingInvitations';
import { OnboardingManager } from './components/OnboardingManager';

interface AppProps {
  user: User;
};
const defaultTheme = createTheme();
let App = (props: AppProps) => {
  let moduleRoutes = Object.keys(moduleComponents).map(x => {
    return <Route key={x} path={x} element={moduleComponents[x]}/>;
  });

  return (
    <UserContext.Provider value={props.user}>
      <CssBaseline/>
      <ThemeProvider theme={defaultTheme}>
        <Router>
          <React.Suspense fallback={'loading...'}>
            <OnboardingManager>
              <Routes>
                <Route path="/">
                  <Route index element={<HomePage/>}/>
                  <Route path="map" element={<KnowledgeMap/>}/>
                  <Route path="login" element={<Login/>}/>
                  <Route path="register" element={<Register/>}/>
                  <Route path="debug" element={<Debug/>}/>
                  <Route path="settings" element={<Settings/>}/>
                  <Route path="settings/general" element={<GeneralSettingsPage/>}/>
                  <Route path="settings/children" element={<ManageChildrenPage/>}/>
                  <Route path="create-child" element={<CreateChildPage/>}/>
                  <Route path="invitations" element={<PendingInvitations/>}/>
                  <Route path="settings/child/:childId" element={<ChildProfile/>}/>
                  <Route path="settings/child/:childId/edit" element={<EditChildPage/>}/>
                  <Route path="modules">
                    {moduleRoutes}
                    <Route path="*" element={<div>module not found</div>}/>
                  </Route>
                  <Route path="*" element={<div>page not found</div>}/>
                </Route>
              </Routes>
            </OnboardingManager>
          </React.Suspense>
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
};


// Initialize test mode instrumentation
setupTestMode();

(async () => {
  let resp = await typedFetch({
    host: API_HOST,
    endpoint: '/api/user',
    method: 'get',
  });
  let user = new User(resp.user);
  let root = createRoot(document.getElementById('content')!);
  root.render(<App user={user}/>);
})();
