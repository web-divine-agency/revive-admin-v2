import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import upload_icon from "@/assets/images/upload_icon.png";
import check from "@/assets/images/check.png";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "@/services/axiosInstance.js";
import { useLoader } from "@/components/loaders/LoaderContext";
import Swal from "sweetalert2";

import JoditEditor from "jodit-react";
import { Helmet } from "react-helmet";
import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./Resources.scss";
import { snackbar } from "@/util/helper";

export default function ResourcesCreate() {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    resource_title: "",
    resource_body: "",
    status: "draft",
    category: " ",
  });
  const [category, setCategory] = useState({
    radioButton: "existing",
    name: "",
  });
  const [resourceMedia, setResourceMedia] = useState([]);
  const [selectedResourceMedia, setSelectedResourceMedia] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  // eslint-disable-next-line no-unused-vars
  const [showFiles, setShowFiles] = useState(false);

  const editor = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [viewAsHtml, setViewAsHtml] = useState(false);

  const [role, setRole] = useState("");

  const [resourceBody, setResourceBody] = useState("");

  const handleListResources = () => {
    axiosInstance
      .get("/all-resources")
      .then((response) => {
        let resources = response.data.resource_data.flatMap(
          (item) => item.category
        );

        // Handle duplicates
        setResources(
          resources.filter((item, i) => resources.indexOf(item) == i)
        );
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    handleListResources();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/user");
        const { roles } = response.data;
        const role = roles.length > 0 ? roles[0].role_name : "No Role";
        setRole(role);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [setLoading]);

  const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
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
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "video", // Add video button here
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
    "selectall",
    "print",
    "|",
    "source",
    "|",
  ];

  const config = {
    readonly: role !== "Admin", // Make editor read-only for non-Admins
    toolbarSticky: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    placeholder: "Start writing your description...",
    multiple: true,
    buttons: buttons,
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

    if (
      category.radioButton === "new" &&
      resources.includes(formData.category)
    ) {
      snackbar("Resource is existing", "error");
      setCategory((category) => ({
        ...category,
        name: formData.category,
        radioButton: "existing",
      }));
      return;
    }

    // Append media files
    if (resourceMedia && resourceMedia.length > 0) {
      resourceMedia.forEach((file) => {
        formDataToSend.append("resource_media", file);
      });
    }

    // Convert additional fields to JSON and add to form data
    //formDataToSend.append("additional_fields", JSON.stringify(additionalFields));

    try {
      await axiosInstance.post("/create-resource", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        title: "Success!",
        text: "Resource has been created.",
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        // Redirect to user list
        navigate(`/resources?category=${formData.category}`);
      });
      setFormData({
        resource_title: "",
        resource_body: "",
        status: "draft",
      });
      setResourceMedia([]);
      setAdditionalFields([]);
    } catch (error) {
      console.error("Error creating resource:", error);
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
                    Resources
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="contained" type="submit">
                    Publish
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl>
                    <RadioGroup
                      row
                      name="category-buttons-group"
                      value={category.radioButton}
                      onChange={({ target }) =>
                        setCategory((category) => ({
                          ...category,
                          radioButton: target.value,
                        }))
                      }
                    >
                      <FormControlLabel
                        value="new"
                        control={<Radio />}
                        label="New"
                      />
                      <FormControlLabel
                        value="existing"
                        control={<Radio />}
                        label="Existing"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {category.radioButton === "existing" && (
                  <Grid size={{ xs: 12 }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="category-select-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={formData.category}
                        name="category"
                        label="Category"
                        onChange={handleInputChange}
                      >
                        <MenuItem value={" "}>&nbsp;</MenuItem>
                        {resources.map((item, i) => (
                          <MenuItem value={item} key={i}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {category.radioButton === "new" && (
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      type="text"
                      size="small"
                      label="New Category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
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
                  {role === "Admin" ? (
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
                  <Grid size={{ xs: 12 }} key={index}>
                    <div style={{ marginBottom: "10px" }} className="mt-5">
                      <JoditEditor
                        value={field.content}
                        config={config}
                        onBlur={(newContent) =>
                          handleFieldChange(index, newContent)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-danger float-end"
                        onClick={() => removeField(index)}
                        style={{
                          marginTop: "-240px",
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
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
                  <Typography className="section-header">
                    Upload Files
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <div className="upload-content">
                    <img src={upload_icon} alt="Upload" width={64} />
                    <p>Browse and choose the files you want to upload</p>
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
                  {selectedResourceMedia.map((fileUrl, index) => (
                    <Box
                      key={index}
                      id="selectedImages"
                      sx={{
                        border: "1px solid black",
                        mb: 2,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <img
                        src={fileUrl}
                        alt={`Thumbnail ${index + 1}`}
                        width={512}
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
                  ))}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
