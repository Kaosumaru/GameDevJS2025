import { useContext } from 'react';
import { LoginContext } from './LoginContext';

export const useLoginContext = () => useContext(LoginContext);
