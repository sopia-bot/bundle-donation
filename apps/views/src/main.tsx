import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  createBrowserRouter,
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import theme from './theme';
import Home from './pages/Home';
import Signature from './pages/Signature';
import EffectSound from './pages/EffectSound';
import Settings from './pages/Settings';
import ProminentAppBar from './components/AppBar';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>

        <HashRouter>
          <ProminentAppBar></ProminentAppBar>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signature" element={<Signature />}></Route>
            <Route path="/effect" element={<EffectSound />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Routes>
        </HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);