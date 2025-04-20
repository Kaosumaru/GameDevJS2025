import { alpha, createTheme, darken, getContrastRatio, ThemeProvider } from '@mui/material';
import './index.css';
import '@fontsource/roboto/400.css';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import JoinGamePage from './pages/GamePage/JoinGamePage';
import CreateGamePage from './pages/GamePage/CreateGamePage';

const actionableBase = '#7F00FF';
const actionableMain = alpha(actionableBase, 0.7);

const actionableSelectedBase = darken(actionableBase, 0.8);

const nonactionableBase = '#909090';
const nonactionableMain = alpha(nonactionableBase, 0.5);

const nonactionableSelected = darken(nonactionableBase, 0.8);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    actionable: {
      main: actionableMain,
      light: alpha(actionableBase, 0.5),
      dark: alpha(actionableBase, 0.9),
      contrastText: getContrastRatio(actionableMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    actionableSelected: {
      main: actionableSelectedBase,
      light: alpha(actionableSelectedBase, 0.5),
      dark: alpha(actionableSelectedBase, 0.9),
      contrastText: getContrastRatio(actionableSelectedBase, '#fff') > 4.5 ? '#fff' : '#111',
    },
    nonactionable: {
      main: nonactionableBase,
      light: alpha(nonactionableBase, 0.5),
      dark: alpha(nonactionableBase, 0.9),
      contrastText: getContrastRatio(nonactionableMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    nonactionableSelected: {
      main: nonactionableSelected,
      light: alpha(nonactionableSelected, 0.5),
      dark: alpha(nonactionableSelected, 0.9),
      contrastText: getContrastRatio(nonactionableSelected, '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/joinGame/:id/:password"
            element={
              <LoginPage>
                <JoinGamePage />
              </LoginPage>
            }
          />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/"
            element={
              <LoginPage>
                <CreateGamePage />
              </LoginPage>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </CookiesProvider>
);
