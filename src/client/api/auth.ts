import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

type Options = Parameters<ReturnType<typeof useCookies>[1]>[2];

export function useUserIdCookie(): [string, (value: string, options?: Options) => void, () => void] {
  const key = 'userId';
  const [cookie, setCookie, removeCookie] = useCookies([key]);

  const userIdCookieValue = cookie[key] as string;
  const setUserIdCookie = useCallback(
    (value: string, options?: Options) => {
      setCookie(key, value, options);
    },
    [setCookie]
  );
  const removeUserIdCookie = useCallback(() => {
    removeCookie(key);
  }, [removeCookie]);

  return [userIdCookieValue, setUserIdCookie, removeUserIdCookie];
}
