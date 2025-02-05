import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import JoditEditor from "jodit-react";

import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import "./Resources.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import ResourceService from "@/services/ResourceService";

export default function ResourcesCreate() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [resource, setResource] = useState({
    title: "",
    body: "",
    media: [],
    additionalFields: [],
    link: "",
    status: "draft",
    categoryId: " ",
  });

  const [resourceCategories, setResourceCategories] = useState([]);

  const [errors, setErrors] = useState({});

  // eslint-disable-next-line no-unused-vars
  const [showFiles, setShowFiles] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [viewAsHtml, setViewAsHtml] = useState(false);

  const editor = useRef(null);

  const config = {
    readonly: false,
    toolbarSticky: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    multiple: true,
    buttons: [
      "undo",
      "redo",
      "|",
      "bold",
      "underline",
      "italic",
      "|",
      "align",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "|",
      "image",
      "link",
      "video",
      "table",
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    video: {
      url: (videoUrl) => {
        return `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      },
    },
  };

  const handleAllResourceCategories = () => {
    ResourceService.allCategories(authUser?.token)
      .then((response) => {
        setResourceCategories(response.data.resource_categories);
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  const handleAddField = () => {
    setResource((resource) => ({
      ...resource,
      additionalFields: [...resource.additionalFields, { content: "" }],
    }));
  };

  const handleRemoveField = (index) => {
    setResource((resource) => ({
      ...resource,
      additionalFields: resource.additionalFields.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateField = (index, newContent) => {
    setResource((resource) => ({
      ...resource,
      additionalFields: resource.additionalFields.map((field, i) =>
        i === index ? { ...field, content: newContent } : field
      ),
    }));
  };

  const handleError = (key) => {
    delete errors[key];
    setErrors((errors) => ({ ...errors }));
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateMedia = (event) => {
    const files = Array.from(event.target.files);
    setResource((resource) => ({ ...resource, media: files }));
  };

  const handleRemoveMedia = (index) => {
    setResource((resource) => ({
      ...resource,
      media: resource.media.filter((_, i) => i !== index),
    }));
  };

  const handleCreateResource = () => {
    const formData = new FormData();

    formData.append("category_id", resource.categoryId);
    formData.append("user_id", authUser?.id);
    formData.append("title", resource.title);
    formData.append("body", resource.body);
    formData.append("link", resource.link);
    formData.append("status", resource.status);

    // Append additional fields as JSON string
    formData.append(
      "additionalFields",
      JSON.stringify(resource.additionalFields)
    );

    // Append each file in the media array
    resource.media.forEach((file) => {
      formData.append(`media[]`, file); // Use `media[]` for array convention
    });

    // Send FormData to backend
    ResourceService.create(formData, authUser?.token)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    handleAllResourceCategories();
  }, []);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="resources-create" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Add New Resource
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Go Back
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" onClick={handleCreateResource}>
                  Publish
                </Button>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={resource.categoryId}
                    name="categoryId"
                    label="Category"
                    onChange={handleOnChange}
                  >
                    <MenuItem value={" "}>&nbsp;</MenuItem>
                    {resourceCategories.map((item, i) => (
                      <MenuItem value={item.id} key={i}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  label="Title"
                  name="title"
                  value={resource.title}
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                {authUser?.role_name === "Admin" ? (
                  <JoditEditor
                    ref={editor}
                    value={resource.body}
                    config={config}
                    onBlur={(newContent) =>
                      setResource((resource) => ({
                        ...resource,
                        body: newContent,
                      }))
                    }
                  />
                ) : viewAsHtml ? (
                  <pre>{resource.body}</pre>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: resource.body }} />
                )}
              </Grid>
              {resource?.additionalFields?.map((field, i) => (
                <React.Fragment key={i}>
                  <Grid size={{ xs: 12 }}>
                    <JoditEditor
                      value={field.content}
                      config={config}
                      onBlur={(newContent) => handleUpdateField(i, newContent)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} textAlign={"right"}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => handleRemoveField(i)}
                      color="red"
                    >
                      Remove Field
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  type="button"
                  onClick={handleAddField}
                >
                  Add Field
                </Button>
              </Grid>
              <Grid size={{ Xs: 12 }}>
                <Typography className="section-heading">Files</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload files
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleUpdateMedia}
                    multiple
                  />
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Grid container spacing={2}>
                    {resource?.media?.map((item, i) => (
                      <Grid size={{ xs: 12, lg: 3 }} key={i}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {item.type.startsWith("image/") ? (
                            <Box
                              component={"img"}
                              src={URL.createObjectURL(item)}
                              alt={item.name}
                              width={212}
                              sx={{
                                marginBottom: 1,
                              }}
                            />
                          ) : (
                            <Typography>{item.type}</Typography>
                          )}
                          <Typography>{item.name}</Typography>
                          <Button
                            variant="contained"
                            type="button"
                            color="red"
                            onClick={() => handleRemoveMedia(i)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
