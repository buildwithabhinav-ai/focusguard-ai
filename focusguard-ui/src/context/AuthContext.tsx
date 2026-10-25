import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  getCurrentUser,
} from "../api/auth.api";

import {
  getStorageItem,
  removeStorageItem,
  clearAppStorage,
} from "../utils/extensionStorage";


interface User {

  id: number;

  full_name: string;

  email: string;

  age?: number;

  occupation?: string;

  role:
    | "SUPER_ADMIN"
    | "SUB_ADMIN"
    | "USER";

  organization_id?: number | null;

  preferred_language?: string;

}


interface AuthContextType {

  user: User | null;

  loading: boolean;

  login: (
    user: User
  ) => void;

  logout: () => void;

}


const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


interface Props {

  children: ReactNode;

}


export const AuthProvider = ({
  children,
}: Props) => {

  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  useEffect(() => {

    const initialize =
      async () => {

        const token =
          await getStorageItem(
            "access_token"
          );


        if (!token) {

          setLoading(false);

          return;

        }


        try {

          const currentUser =
            await getCurrentUser();


          setUser(
            currentUser
          );

        } catch (error) {

          console.error(
            error
          );


          await clearAppStorage();


          setUser(
            null
          );

        } finally {

          setLoading(
            false
          );

        }

      };


    initialize();

  }, []);


  const login = (
    user: User
  ) => {

    setUser(
      user
    );

  };


  const logout =
    async () => {

      await removeStorageItem(
        "access_token"
      );


      await removeStorageItem(
        "refresh_token"
      );


      await removeStorageItem(
        "user"
      );


      setUser(
        null
      );

    };


  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        login,

        logout,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};


export const useAuth = () => {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(

      "useAuth must be used inside AuthProvider"

    );

  }


  return context;

};