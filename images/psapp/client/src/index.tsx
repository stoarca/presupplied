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
import {User} from './UserContext';
import {typedFetch, API_HOST} from './typedFetch';
import { buildGraph } from './dependency-graph';
import { KNOWLEDGE_MAP } from '../../common/types';
import { KnowledgeGraphContext } from './KnowledgeGraphContext';
import { HomePage } from './pages/HomePage';
import { Debug } from './pages/Debug';
import { Settings } from './pages/Settings';
import { GeneralSettingsPage } from './pages/GeneralSettingsPage';
import { ChildrenPage } from './pages/ChildrenPage';
import { CreateChildPage } from './pages/CreateChildPage';
import { ChildProfile } from './pages/ChildProfile';
import { EditChildPage } from './pages/EditChildPage';
import { PendingInvitations } from './pages/PendingInvitations';
import { SyncProgressPage } from './pages/SyncProgressPage';
import { OnboardingManager } from './components/OnboardingManager';
import { ErrorProvider } from './ErrorContext';
import { UserProvider } from './UserProvider';

interface AppProps {
  user: User;
};

const primaryColor = '#3B3B3B';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    text: {
      primary: primaryColor,
    },
    action: {
      hover: 'rgba(59, 59, 59, 0.08)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: primaryColor,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2B2B2B',
          },
        },
        outlined: {
          borderColor: primaryColor,
          color: primaryColor,
          '&:hover': {
            backgroundColor: 'rgba(59, 59, 59, 0.08)',
            borderColor: primaryColor,
          },
        },
        text: {
          color: primaryColor,
          '&:hover': {
            backgroundColor: 'rgba(59, 59, 59, 0.08)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: primaryColor,
          textDecorationColor: primaryColor,
          '&:hover': {
            color: primaryColor,
          },
        },
      },
    },
  },
});
const knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

let App = (props: AppProps) => {
  let moduleRoutes = Object.keys(moduleComponents).map(x => {
    return <Route key={x} path={x} element={moduleComponents[x]}/>;
  });

  return (
    <ErrorProvider>
      <UserProvider initialUser={props.user}>
        <KnowledgeGraphContext.Provider value={knowledgeGraph}>
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
                      <Route path="children" element={<ChildrenPage/>}/>
                      <Route path="create-child" element={<CreateChildPage/>}/>
                      <Route path="invitations" element={<PendingInvitations/>}/>
                      <Route path="sync-progress" element={<SyncProgressPage/>}/>
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
        </KnowledgeGraphContext.Provider>
      </UserProvider>
    </ErrorProvider>
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
