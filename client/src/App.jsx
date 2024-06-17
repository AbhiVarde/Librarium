import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CallbackPage from "./pages/CallbackPage";
import BookList from "./pages/BookList";
import "./styles/App.css";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
        },
      },
    },
  },
});

const App = () => {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={<HomePage accessToken={accessToken} />}
            />
            <Route path="/auth/callback/discord" element={<CallbackPage />} />
            <Route path="/auth/callback/google" element={<CallbackPage />} />
            <Route path="/booklist" element={<BookList />} />
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
