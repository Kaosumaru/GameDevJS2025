import { createContext } from 'react';
import { GlobalContent } from './LoginPage';

export const LoginContext = createContext<GlobalContent>({
  logout: () => {
    // do nothing
  },
  userId: '',
});
