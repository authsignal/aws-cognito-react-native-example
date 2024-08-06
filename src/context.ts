import React, {useContext} from 'react';

type AuthContextType = {
  isSignedIn: boolean;
  authsignalToken: string | null;
  setIsSignedIn: (value: boolean) => void;
  setAuthsignalToken: (value: string | null) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  isSignedIn: false,
  authsignalToken: null,
  setIsSignedIn: (_value: boolean) => {},
  setAuthsignalToken: (_value: string | null) => {},
});

export const useAuthContext = () => useContext(AuthContext);
