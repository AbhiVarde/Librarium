import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import axios from "axios";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const provider = window.location.pathname.split("/")[3];

    if (code) {
      let tokenUrl, tokenBody;

      switch (provider) {
        case "google":
          tokenUrl = "https://accounts.google.com/o/oauth2/token";
          tokenBody = {
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${window.location.origin}/auth/callback/${provider}`,
            scope: "openid profile email",
          };
          break;
        case "discord":
          tokenUrl = "https://discord.com/api/oauth2/token";
          tokenBody = {
            client_id: process.env.REACT_APP_DISCORD_CLIENT_ID,
            client_secret: process.env.REACT_APP_DISCORD_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${window.location.origin}/auth/callback/${provider}`,
            scope: "identify email",
          };
          break;
        default:
          console.error("Unsupported provider:", provider);
          return;
      }

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      axios
        .post(tokenUrl, new URLSearchParams(tokenBody), config)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("accessToken", response?.data?.access_token);
            localStorage.setItem("authProvider", provider);
            navigate("/booklist");
          } else {
            throw new Error(
              `Failed to exchange authorization code: ${response.statusText}`
            );
          }
        })
        .catch((error) => {
          console.error(
            "Failed to exchange authorization code for access token:",
            error
          );
        });
    } else {
      console.error("Authorization code not found in URL query parameters.");
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="body1">Redirecting...</Typography>
    </Box>
  );
};

export default CallbackPage;
