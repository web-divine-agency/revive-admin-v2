import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import Swal from "sweetalert2";
import JoditEditor from "jodit-react";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { FaTimes } from "react-icons/fa";

import "./Resources.scss";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import check from "@/assets/images/check.png";

export default function ResourcesUpdate() {
  const { resourceID } = useParams();

  const editor = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [viewAsHtml, setViewAsHtml] = useState(false);

  const [role, setRole] = useState("");

  const [additionalFields, setAdditionalFields] = useState([]);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceBody, setResourceBody] = useState("");
  const [resourceStatus, setResourceStatus] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [selectedResourceMedia, setSelectedResourceMedia] = useState([]);
  const [resourceMedia, setResourceMedia] = useState(null);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResourceDetails = () => {
      try {
        const response = {};
        const resourceData = response.data.resource_data;
        setResourceTitle(resourceData?.resource_title || "");
        setResourceBody(resourceData?.resource_body || "");
        setResourceStatus(resourceData?.status || "");
        setResourceCategory(resourceData?.category || "");
        const parsedFields = JSON.parse(resourceData?.additional_fields);
        setAdditionalFields(parsedFields);
        //console.log(additionalFields);
        setSelectedResourceMedia(
          JSON.parse(resourceData?.resource_media || "[]")
        );
      } catch (error) {
        console.error("Error fetching resource details:", error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = {};
        const { roles } = response.data;
        const role = roles.length > 0 ? roles[0].role_name : "No Role";
        setRole(role);
        console.log(role);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
    fetchResourceDetails();
  }, [resourceID]);

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
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    multiple: true,
    buttons: buttons,
    uploader: {
      insertImageAsBase64URI: true,
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResourceMedia((prevFiles) => [...(prevFiles || []), ...files]);
  };

  const handleRemoveMedia = (file) => {
    setDeletedFiles((prevFiles) => [...prevFiles, file]);
    setSelectedResourceMedia((prevMedia) =>
      prevMedia.filter((media) => media !== file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("resource_title", resourceTitle);
    formDataToSend.append("resource_body", resourceBody);
    formDataToSend.append("status", resourceStatus);
    formDataToSend.append("category", resourceCategory);
    formDataToSend.append(
      "additional_fields",
      JSON.stringify(additionalFields)
    );
    formDataToSend.append("delete_media", JSON.stringify(deletedFiles));

    (resourceMedia || []).forEach((file) =>
      formDataToSend.append("resource_media", file)
    );
    try {
      Swal.fire({
        title: "Success!",
        text: "Resource has been updated.",
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonColor: "#0ABAA6",
      }).then(() => navigate(-1));
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="resources-update" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Resources Update
          </Typography>
          <Paper variant="outlined">
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
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Button type="submit" variant="contained">
                        Publish Edit
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        size="small"
                        type="text"
                        label="Category"
                        name="category"
                        value={resourceCategory}
                        onChange={(e) => setResourceCategory(e.target.value)}
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        size="small"
                        type="text"
                        label="Title"
                        name="resource_title"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      {role === "Admin" ? (
                        <JoditEditor
                          ref={editor}
                          value={resourceBody}
                          config={config}
                          onBlur={(newContent) => setResourceBody(newContent)} // Update on blur
                        />
                      ) : viewAsHtml ? (
                        <pre>{resourceBody}</pre> // HTML view for Admin
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: resourceBody }}
                        />
                      )}
                    </Grid>
                  </Grid>
                  <div className="container-content" id="edit-rsrc-container">
                    <div className="resource-page">
                      <div>
                        <div className="mt-5">
                          {additionalFields.map((field, index) => (
                            <div
                              key={index}
                              style={{ marginBottom: "10px" }}
                              className="mt-5"
                            >
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
                          ))}
                          <Button variant="contained" onClick={addNewField}>
                            Add field
                          </Button>
                        </div>

                        <Typography className="section-heading" sx={{ my: 2 }}>
                          Upload Files
                        </Typography>
                        <div className="upload-box">
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
                          <Typography
                            className="section-heading"
                            sx={{ my: 2 }}
                          >
                            Current Media
                          </Typography>
                          <div id="selectedImagesContainer">
                            <Grid container spacing={2}>
                              {selectedResourceMedia.map((file, index) => (
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
                                      src={`https://dev.server.revivepharmacyportal.com.au/uploads/${file}`}
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
                                      onClick={() => handleRemoveMedia(file)}
                                    >
                                      Remove
                                    </Button>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
