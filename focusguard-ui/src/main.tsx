import React from "react";
import ReactDOM from "react-dom/client";

import {
  HashRouter,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Toaster,
} from "react-hot-toast";

import {
  ThemeProvider,
} from "./components/common/ThemeProvider";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  LanguageProvider,
} from "./context/LanguageContext";

import "@fontsource/geist-sans";
import "./index.css";

import App from "./App";


const queryClient =
  new QueryClient();


ReactDOM.createRoot(

  document.getElementById(
    "root"
  )!

).render(

  <React.StrictMode>

    <HashRouter>

      <ThemeProvider>

        <QueryClientProvider
          client={queryClient}
        >

          <AuthProvider>

            <LanguageProvider>

              <App />

              <Toaster

                position="top-right"

                reverseOrder={false}

                toastOptions={{

                  duration:
                    3000,

                  style: {

                    borderRadius:
                      "14px",

                    fontSize:
                      "14px",

                  },

                  success: {

                    duration:
                      2500,

                  },

                  error: {

                    duration:
                      3500,

                  },

                }}

              />

            </LanguageProvider>

          </AuthProvider>

        </QueryClientProvider>

      </ThemeProvider>

    </HashRouter>

  </React.StrictMode>

);