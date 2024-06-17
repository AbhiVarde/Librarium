import React, { Fragment, forwardRef, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Link,
  Button,
  Stack,
  Slide,
  InputLabel,
  Dialog,
  DialogContent,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { LuChevronLeft, LuPlus, LuImage } from "react-icons/lu";
import { HiMiniRectangleStack } from "react-icons/hi2";
import { MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import { useFormik } from "formik";
import * as yup from "yup";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const validationSchema = yup.object({
  imageLink: yup.mixed().required("* Image is required"),
  title: yup
    .string()
    .typeError("* Title must be a string")
    .required("* Title is required"),
  author: yup
    .string()
    .typeError("* Author must be a string")
    .required("* Author is required"),
});

const BookList = () => {
  const navigate = useNavigate();
  const authProvider = localStorage.getItem("authProvider");

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booklist, setBooklist] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isOpenAddDialog, setOpenAddDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const ImageFilesType = ["image/png", "image/jpg", "image/jpeg"];

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/books");
      setBooklist(response?.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddBook = () => {
    setOpenAddDialog(true);
    setSelectedId(null);
    setSelectedImage(null);
    formik.resetForm();
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      imageLink: "",
      title: "",
      author: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("author", values.author.trim());

      if (selectedImage) {
        formData.append("imageLink", selectedImage);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        let response;
        if (selectedId) {
          response = await axios.put(
            `http://localhost:5000/books/${selectedId}`,
            formData,
            config
          );
        } else {
          response = await axios.post(
            "http://localhost:5000/books",
            formData,
            config
          );
        }
        enqueueSnackbar(response.data.message);
        await fetchBooks();
        handleCloseAddDialog();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleEditBook = async (id) => {
    setOpenAddDialog(true);
    setSelectedId(id);

    try {
      const response = await axios.get(`http://localhost:5000/books/${id}`);
      const data = response.data;

      const imageLink = data?.imageLink.includes("/uploads/")
        ? `http://localhost:5000${data?.imageLink}`
        : data?.imageLink;

      setSelectedImage(imageLink);

      formik.setValues({
        ...formik.values,
        imageLink: imageLink,
        title: data?.title,
        author: data?.author,
      });
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteBook = (id) => {
    setOpenDeleteDialog(true);
    setSelectedId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    setIsSubmitting(true);
    axios
      .delete(`http://localhost:5000/books/${selectedId}`)
      .then((resource) => {
        setIsSubmitting(false);
        enqueueSnackbar(resource?.data?.message);
        handleCloseDeleteDialog();
        fetchBooks();
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile || !ImageFilesType.includes(selectedFile.type)) {
      setSnackbarOpen(true);
      return;
    }

    formik.setFieldValue("imageLink", selectedFile);
    setSelectedImage(selectedFile);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const provider = localStorage.getItem("authProvider");

    if (accessToken && provider) {
      setIsLoading(true);
      let apiUrl;
      let headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (provider === "google") {
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
    <Fragment>
      <Container maxWidth="md" sx={{ marginY: "30px" }}>
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
        ) : (
          <Fragment>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
                marginTop: 0,
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
              <Stack
                direction="row"
                gap={1}
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  alt="user"
                  src={
                    authProvider === "google"
                      ? user?.picture
                      : `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`
                  }
                />
                <Box
                  sx={{
                    maxWidth: "200px",
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    textAlign: "start",
                  }}
                >
                  <Typography variant="body1" fontWeight={600} noWrap>
                    {authProvider === "google"
                      ? user?.name || "User"
                      : user?.global_name || "User"}
                  </Typography>
                  {user?.email ? (
                    <Typography variant="body2" noWrap>
                      {user?.email}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
            </Box>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #0000004D",
                boxShadow: "0px 0px 20px 0px #00000012",
                mt: 1,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  my: 2,
                }}
              >
                <HiMiniRectangleStack size={50} />
                <Box mt={1}>
                  <Typography variant="h5" fontWeight={500} align="center">
                    Welcome to Librarium!
                  </Typography>
                  <Typography
                    mt={0.5}
                    variant="body1"
                    fontWeight={500}
                    align="center"
                  >
                    Your Personal Book Management Solution
                  </Typography>
                </Box>
              </CardContent>
              <Divider
                sx={{
                  width: "100%",
                  bgcolor: "#0000004D",
                  boxShadow: "0px 0px 20px 0px #00000012",
                }}
              />
              <CardContent sx={{ my: 2 }}>
                {isFetching ? (
                  <CircularProgress color="inherit" />
                ) : booklist && booklist?.length > 0 ? (
                  <Fragment>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: {
                          xs: "column",
                          lg: "row",
                        },
                        gap: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                          width: {
                            xs: "auto",
                            sm: "100%",
                          },
                          justifyContent: "end",
                        }}
                      >
                        <Button
                          onClick={handleAddBook}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#FFFFFF",
                            bgcolor: "#1A1A1A",
                            height: "45px",
                            "&:hover": {
                              bgcolor: "#000000",
                            },
                            borderRadius: 2,
                            px: 2,
                            mb: 2,
                            fontSize: 12,
                          }}
                        >
                          <LuPlus size={18} /> Add book
                        </Button>
                      </Box>
                    </Box>
                    <Grid container spacing={3}>
                      {booklist?.map((item, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Card
                            sx={{
                              padding: "10px !important",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              borderRadius: 2,
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  height: "150px",
                                  borderRadius: "15px",
                                  overflow: "hidden",
                                }}
                              >
                                {item?.imageLink.includes("/uploads/") ? (
                                  <img
                                    src={`http://localhost:5000${item?.imageLink}`}
                                    alt="Book Image"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      backgroundColor: "#0000001A",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={item?.imageLink}
                                    alt="Book Image"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      backgroundColor: "#0000001A",
                                    }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="h6"
                                mt={1.5}
                                sx={{
                                  overflow: "hidden",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  display: "-webkit-box",
                                  textOverflow: "ellipsis",
                                  wordBreak: "break-word",
                                }}
                              >
                                {item?.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  overflow: "hidden",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  display: "-webkit-box",
                                  textOverflow: "ellipsis",
                                  wordBreak: "break-word",
                                }}
                              >
                                {item?.author}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              <Button
                                fullWidth
                                onClick={() => handleEditBook(item?.id)}
                                sx={{
                                  color: "#FFFFFF",
                                  bgcolor: "#1A1A1A",
                                  height: "45px",
                                  "&:hover": {
                                    bgcolor: "#000000",
                                  },
                                  borderRadius: 2,
                                  fontSize: 12,
                                  gap: 1,
                                }}
                              >
                                <MdEdit size={20} /> Edit
                              </Button>
                              <Button
                                fullWidth
                                onClick={() => handleDeleteBook(item?.id)}
                                sx={{
                                  color: "#FFFFFF",
                                  bgcolor: "#1A1A1A",
                                  height: "45px",
                                  "&:hover": {
                                    bgcolor: "#000000",
                                  },
                                  borderRadius: 2,
                                  fontSize: 12,
                                  gap: 1,
                                }}
                              >
                                <MdDelete size={20} /> Delete
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Fragment>
                ) : (
                  <Typography variant="h6" fontWeight={500} align="center">
                    No books available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Fragment>
        )}
      </Container>

      <Dialog
        open={isOpenDeleteDialog ? isOpenDeleteDialog : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" fontWeight={500}>
            Delete Book
          </Typography>
          <Typography mt={1} variant="body1">
            Are you sure you want to delete this book?
          </Typography>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 1,
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              sx={{
                width: "50%",
                color: "#000000",
                height: "45px",
                borderRadius: 2,
                fontSize: 12,
                borderColor: "#000000",
                "&:hover": {
                  color: "#000000",
                  borderColor: "#000000",
                  backgroundColor: "#FFFFFF",
                },
              }}
              onClick={handleCloseDeleteDialog}
            >
              Cancel
            </Button>
            <LoadingButton
              fullWidth
              variant="contained"
              onClick={handleDelete}
              loading={isSubmitting}
              loadingIndicator={<CircularProgress color="inherit" size={22} />}
              sx={{
                width: "50%",
                color: "#FFFFFF",
                bgcolor: "#1A1A1A",
                height: "45px",
                "&:hover": {
                  bgcolor: "#000000",
                },
                borderRadius: 2,
                fontSize: 12,
              }}
            >
              Delete
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenAddDialog ? isOpenAddDialog : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAddDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            {console.log(formik.errors)}
            <Box>
              <InputLabel htmlFor="imageLink">
                Image
                <Typography color="error" display="inline" fontWeight={500}>
                  *
                </Typography>
              </InputLabel>
              <label
                htmlFor="imageLink"
                style={{
                  cursor: "pointer",
                  width: "100px",
                  height: "100px",
                  display: "block",
                  marginTop: "10px",
                }}
              >
                <TextField
                  type="file"
                  id="imageLink"
                  name="imageLink"
                  onChange={handleImageChange}
                  inputProps={{
                    accept: "image/*",
                    multiple: true,
                  }}
                  style={{ display: "none" }}
                />
                {selectedImage ? (
                  <img
                    style={{
                      objectFit: "cover",
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                    src={
                      typeof selectedImage === "string"
                        ? selectedImage
                        : URL.createObjectURL(selectedImage)
                    }
                    alt="uploadedImage"
                  />
                ) : (
                  <Box
                    sx={{
                      maxWidth: "100px",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: { xs: "auto", md: 0 },
                      cursor: "pointer",
                      backgroundColor: "#00000010",
                      borderRadius: "10px",
                      border: "dashed",
                    }}
                  >
                    <LuImage size={26} />
                  </Box>
                )}
              </label>
              {formik.errors.image && formik.touched.image && (
                <Typography
                  mt="3px"
                  fontSize="0.75rem"
                  color="error"
                  mx="auto"
                  ml={1}
                  display="block"
                >
                  {formik.errors.image}
                </Typography>
              )}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Please upload a valid profile picture"
              />
            </Box>
            <Box>
              <InputLabel
                htmlFor="title"
                sx={{
                  mt: 2,
                  mb: 0.5,
                }}
              >
                Title
                <Typography color="error" display="inline" fontWeight={500}>
                  *
                </Typography>
              </InputLabel>
              <TextField
                fullWidth
                id="title"
                name="title"
                type="text"
                placeholder="Enter title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <InputLabel
                htmlFor="author"
                sx={{
                  mt: 2,
                  mb: 0.5,
                }}
              >
                Author
                <Typography color="error" display="inline" fontWeight={500}>
                  *
                </Typography>
              </InputLabel>
              <TextField
                fullWidth
                id="author"
                name="author"
                type="text"
                placeholder="Enter author"
                value={formik.values.author}
                onChange={formik.handleChange}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && formik.errors.author}
              />
            </Box>
            <Box
              sx={{
                mt: 3,
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  width: "50%",
                  color: "#000000",
                  height: "45px",
                  borderRadius: 2,
                  fontSize: 12,
                  borderColor: "#000000",
                  "&:hover": {
                    color: "#000000",
                    borderColor: "#000000",
                    backgroundColor: "#FFFFFF",
                  },
                }}
                onClick={handleCloseAddDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loadingIndicator={
                  <CircularProgress color="inherit" size={22} />
                }
                sx={{
                  width: "50%",
                  color: "#FFFFFF",
                  bgcolor: "#1A1A1A",
                  height: "45px",
                  "&:hover": {
                    bgcolor: "#000000",
                  },
                  borderRadius: 2,
                  fontSize: 12,
                }}
              >
                {selectedId ? "Update" : "Add"}
              </LoadingButton>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default BookList;
