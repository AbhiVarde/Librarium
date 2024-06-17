import React, { useEffect } from "react";
import { Container, Box, Typography, Button, Card } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa6";
import { HiMiniRectangleStack } from "react-icons/hi2";

const LoginPage = () => {
  const handleLogin = (provider) => {
    let client_id, scope;
    let redirect_uri = `${window.location.origin}/auth/callback/${provider}`;

    if (provider === "google") {
      client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      scope = "openid profile email";
      window.location.href = `https://accounts.${provider}.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code`;
    } else if (provider === "discord") {
      client_id = process.env.REACT_APP_DISCORD_CLIENT_ID;
      scope = "identify email";
      window.location.href = `https://${provider}.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code`;
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "500px",
          border: "1px solid #0000004D",
          boxShadow: "0px 0px 10px 0px #00000012",
          px: 2,
        }}
      >
        <HiMiniRectangleStack size={50} />
        <Box mt={1}>
          <Typography variant="h5" fontWeight={500} align="center">
            Welcome to Librarium!
          </Typography>
          <Typography mt={0.5} variant="body1" fontWeight={500} align="center">
            Your Personal Book Management Solution
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 4,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<FcGoogle size="28" />}
            onClick={() => handleLogin("google")}
            sx={{
              fontSize: "15px",
              fontWeight: 500,
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FaDiscord size="28" style={{ fill: "#5865F2" }} />}
            onClick={() => handleLogin("discord")}
            sx={{
              fontSize: "15px",
              fontWeight: 500,
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            Sign in with Discord
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;
