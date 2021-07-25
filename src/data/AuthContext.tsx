import React, { PropsWithChildren, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { generateSHA256 } from '../utils/crypto';

type AuthContex = {
  isLoggedIn: boolean;
  login: (pass: string) => boolean;
};

const Context = React.createContext<null | AuthContex>(null);

const PASSWORD =
  '115f9a22160b1026a2f0bd9af6ff05b964e25d6eb0a21883656e69459fefa438'; // hello@123#$

export function useAuthContext() {
  return useContext(Context) as NonNullable<AuthContex>;
}

export function AuthContextProvider({ children }: PropsWithChildren<unknown>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  const login = (pass: string) => {
    if (generateSHA256(pass) === PASSWORD) {
      setIsLoggedIn(true);
      history.push('/contacts');
      return true;
    }

    return false;
  };

  return (
    <Context.Provider value={{ isLoggedIn, login }}>
      {children}
    </Context.Provider>
  );
}
