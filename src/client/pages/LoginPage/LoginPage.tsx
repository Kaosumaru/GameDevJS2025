import './LoginPage.css';
import { Backdrop, CircularProgress, Stack, Theme } from '@mui/material';
import { JSX, useCallback, useEffect, useState } from 'react';
import { useUserIdCookie } from '@client/api/auth';
import { Login } from '../GamePage/Components/Login';
import { LoginContext } from './LoginContext';

export interface LoginProps {
  children?: JSX.Element | JSX.Element[];
}

export type GlobalContent = {
  logout: () => void;
  userId: string;
};

function LoginPage(props: LoginProps) {
  const [error, SetError] = useState<string | undefined>();
  const [checkingSession, SetCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userIdCookieValue, setUserIdCookie, removeUserIdCookie] = useUserIdCookie();

  const handleLogin = useCallback((username: string) => {
    setIsLoading(true);

    if (username.length < 3) {
      SetError('Username must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    setUserIdCookie(username);
    setUserId(username);
    SetError(undefined);

    setIsLoggedIn(true);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cookie = userIdCookieValue;

    if (cookie) {
      setUserId(cookie);
      SetCheckingSession(false);
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      SetCheckingSession(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingSession) {
    return (
      <Backdrop sx={(theme: Theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={checkingSession}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isLoggedIn) {
    return (
      <Stack>
        <Login isLoading={isLoading} onLogin={handleLogin} error={error} />
      </Stack>
    );
  }

  const logout = () => {
    removeUserIdCookie();
    setIsLoggedIn(false);
    setIsLoading(false);
  };

  return <LoginContext.Provider value={{ logout, userId }}>{props.children}</LoginContext.Provider>;
}

export default LoginPage;
