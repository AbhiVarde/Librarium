import React, { Fragment, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Grid,
  Tooltip,
  Divider,
  Link,
  Button,
} from "@mui/material";
import axios from "axios";
import {
  LuAtSign,
  LuMail,
  LuLink,
  LuShieldCheck,
  LuLanguages,
  LuAtom,
  LuCrown,
  LuFilter,
  LuChevronLeft,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const authProvider = localStorage.getItem("authProvider");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const provider = localStorage.getItem("authProvider");

    if (accessToken && provider) {
      setIsLoading(true);
      let apiUrl;
      let headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (provider === "github") {
        apiUrl = "https://api.github.com/user";
      } else if (provider === "google") {
        apiUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
      } else if (provider === "discord") {
        apiUrl = "https://discord.com/api/users/@me";
      }

      axios
        .get(apiUrl, { headers: headers })
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data");
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ marginTop: "50px" }}>
      {isLoading ? (
        <Box
          sx={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      ) : user ? (
        <Fragment>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              startIcon={<LuChevronLeft size={22} />}
              sx={{
                fontWeight: 600,
                padding: "8px 10px",
                backgroundColor: "white",
                color: "black",
              }}
              LinkComponent={Link}
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Typography variant="h5" fontWeight={500} textAlign="center">
              Logged in as{" "}
              {authProvider.charAt(0).toUpperCase() + authProvider.slice(1)}
            </Typography>
          </Box>
          {authProvider === "discord" ? (
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #0000004D",
                boxShadow: "0px 0px 20px 0px #00000012",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
                  alt={user.global_name || "User"}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" fontWeight={500} align="center">
                  Welcome, {user.global_name || "User"}!
                </Typography>
              </CardContent>
              <Divider
                sx={{
                  width: "100%",
                  bgcolor: "#0000004D",
                  boxShadow: "0px 0px 20px 0px #00000012",
                }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Username" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuAtSign size="22" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.username}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="User ID" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuLink size="22" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.id}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Email" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuMail size="22" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Discriminator" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuFilter size="24" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.discriminator != 0
                            ? user.discriminator
                            : "No Discriminator"}
                        </Typography>
                      </Box>
                      <Typography variant="body2" align="center"></Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Locale" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuLanguages size="24" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.locale}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Premium Type" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuCrown size="24" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.premium_type != 0
                            ? user.premium_type
                            : "No Premium Type"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Verify Status" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuShieldCheck
                          size="26"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body1" fontWeight={500}>
                          {user.verified ? "Verified" : "Not Verified"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Clan" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuAtom size="24" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.clan || "No Clan"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : authProvider === "google" ? (
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #0000004D",
                boxShadow: "0px 0px 20px 0px #00000012",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={user.picture}
                  alt={user.name || "User"}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" fontWeight={500} align="center">
                  Welcome, {user.name || "User"}!
                </Typography>
              </CardContent>
              <Divider
                sx={{
                  width: "100%",
                  bgcolor: "#0000004D",
                  boxShadow: "0px 0px 20px 0px #00000012",
                }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Username" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuAtSign size="22" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.name}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="User ID" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuLink size="22" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.id}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Email" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuMail size="22" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Locale" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuLanguages size="24" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight={500}>
                          {user.locale}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Verify Status" arrow>
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <LuShieldCheck
                          size="26"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body1" fontWeight={500}>
                          {user.verified_email ? "Verified" : "Not Verified"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            ""
          )}
        </Fragment>
      ) : (
        <Typography variant="h5" fontWeight={500} align="center">
          No user data available. Please login.
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;
