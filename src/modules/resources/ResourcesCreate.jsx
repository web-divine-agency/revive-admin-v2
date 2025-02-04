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
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./Resources.scss";

import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import ResourceService from "../../services/ResourceService";
import Global from "../../util/global";

export default function ResourcesCreate() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  // eslint-disable-next-line no-unused-vars
  const [resources, setResources] = useState([]);

  const [formData, setFormData] = useState({
    resource_title: "",
    resource_body: "",
    status: "draft",
    category: " ",
  });

  const [resourceCategories, setResourceCategories] = useState([]);

  const [resourceMedia, setResourceMedia] = useState([]);

  const [selectedResourceMedia, setSelectedResourceMedia] = useState([]);

  const [additionalFields, setAdditionalFields] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [showFiles, setShowFiles] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [viewAsHtml, setViewAsHtml] = useState(false);

  const [resourceBody, setResourceBody] = useState("");

  const editor = useRef(null);

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

  useEffect(() => {
    handleAllResourceCategories();
  }, []);

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
      "strikethrough",
      "underline",
      "italic",
      "|",
      "align",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "|",
      "image",
      "link",
      "video", // Add video button here
      "table",
      "|",
      "hr",
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    video: {
      url: (videoUrl) => {
        // A custom function to validate and embed the video
        return `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      },
    },
  };

  const addNewField = () => {
    setAdditionalFields([...additionalFields, { content: "" }]);
  };

  const removeField = (index) => {
    const fields = [...additionalFields];
    fields.splice(index, 1);
    setAdditionalFields(fields);
  };

  const handleFieldChange = (index, newContent) => {
    const fields = [...additionalFields];
    fields[index].content = newContent;
    setAdditionalFields(fields);
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResourceMedia(files);
    // Generate preview URLs for each file
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedResourceMedia(previewUrls);
  };

  const handleRemoveMedia = (fileUrl) => {
    // Find the index of the file to be removed based on the file URL
    const fileIndex = selectedResourceMedia.indexOf(fileUrl);

    if (fileIndex > -1) {
      // Remove the file from the resourceMedia array
      const updatedResourceMedia = [...resourceMedia];
      updatedResourceMedia.splice(fileIndex, 1);
      setResourceMedia(updatedResourceMedia);

      // Remove the preview URL from selectedResourceMedia
      const updatedSelectedResourceMedia = [...selectedResourceMedia];
      updatedSelectedResourceMedia.splice(fileIndex, 1);
      setSelectedResourceMedia(updatedSelectedResourceMedia);
    }
  };

  const showSelectedFiles = () => {
    setShowFiles((prevShowFiles) => !prevShowFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("resource_title", formData.resource_title);
    formDataToSend.append("resource_body", resourceBody);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("category", formData.category.trim()) ||
      "General Resource";
    formDataToSend.append(
      "additional_fields",
      JSON.stringify(additionalFields)
    );

    // Append media files
    if (resourceMedia && resourceMedia.length > 0) {
      resourceMedia.forEach((file) => {
        formDataToSend.append("resource_media", file);
      });
    }
  };

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
            <form onSubmit={handleSubmit} className="add-resource-form">
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
                  <Button variant="contained" type="submit">
                    Publish
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={formData.category}
                      name="category"
                      label="Category"
                      onChange={handleInputChange}
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
                    name="resource_title"
                    value={formData.resource_title}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {authUser?.role_name === "Admin" ? (
                    <JoditEditor
                      ref={editor}
                      value={formData.resource_body}
                      config={config}
                      onBlur={(newContent) => setResourceBody(newContent)} // Update on blur
                    />
                  ) : viewAsHtml ? (
                    <pre>{resourceBody}</pre> // HTML view for Admin
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: resourceBody }} />
                  )}
                </Grid>
                {additionalFields.map((field, index) => (
                  <Grid size={{ xs: 12 }} key={index} textAlign={"right"}>
                    <JoditEditor
                      value={field.content}
                      config={config}
                      onBlur={(newContent) =>
                        handleFieldChange(index, newContent)
                      }
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => removeField(index)}
                      color="red"
                    >
                      Remove Field
                    </Button>
                  </Grid>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    type="button"
                    onClick={addNewField}
                  >
                    Add Field
                  </Button>
                </Grid>
                <Grid size={{ Xs: 12 }}>
                  <Typography className="section-heading">
                    Upload Files
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <div className="upload-content">
                    <input
                      type="file"
                      id="fileInput"
                      name="resource_media"
                      onChange={handleFileChange}
                      multiple
                      className="file-input"
                    />
                  </div>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={showSelectedFiles}
                  >
                    Show Selected Files
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Grid container spacing={2}>
                      {selectedResourceMedia.map((fileUrl, index) => (
                        <Grid size={{ xs: 12, lg: 3 }} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              component={"img"}
                              src={fileUrl}
                              alt={`Thumbnail ${index + 1}`}
                              width={212}
                              sx={{
                                marginBottom: 1,
                              }}
                            />
                            <Button
                              variant="contained"
                              type="button"
                              color="red"
                              onClick={() => handleRemoveMedia(fileUrl)}
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
            </form>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
