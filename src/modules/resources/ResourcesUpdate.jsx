import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import JoditEditor from "jodit-react";
import LightGallery from "lightgallery/react";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
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

import { url } from "@/config/app";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

import ResourceService from "@/services/ResourceService";

export default function ResourcesUpdate() {
  const navigate = useNavigate();

  const { resourceSlug } = useParams();

  const { authUser } = useContext(Global);

  const [resource, setResource] = useState({
    resourceId: "",
    categoryId: "",
    userId: "",
    title: "",
    slug: "",
    body: "",
    additionalFields: [],
    media: [],
    link: "",
    status: [],
    firstName: "",
    lastName: "",
    email: "",
  });

  const [resourceCategories, setResourceCategories] = useState([]);

  const [errors, setErrors] = useState({});

  // eslint-disable-next-line no-unused-vars
  const [showFiles, setShowFiles] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [viewAsHtml, setViewAsHtml] = useState(false);

  const editor = useRef(null);

  const [media, setMedia] = useState({
    pdfs: [],
    images: [],
  });

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

  const handleReadResourceBySlug = () => {
    ResourceService.read(resourceSlug, authUser?.token)
      .then((response) => {
        setResource({
          resourceId: response.data.resource.resource_id,
          categoryId: response.data.resource.category_id,
          userId: response.data.resource.user_id,
          title: response.data.resource.title,
          slug: response.data.resource.slug,
          body: response.data.resource.body,
          additionalFields:
            JSON.parse(response.data.resource.additional_fields) || [],
          media: JSON.parse(response.data.resource.media) || [],
          link: response.data.resource.link,
          status: response.data.resource.status,
          firstName: response.data.resource.first_name,
          lastName: response.data.resource.last_name,
          email: response.data.resource.email,
        });
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

  // const handleRemoveMedia = (index) => {
  //   setResource((resource) => ({
  //     ...resource,
  //     media: resource.media.filter((_, i) => i !== index),
  //   }));
  // };

  const handleUpdateResource = () => {
    const formData = new FormData();

    let slug = resource.title
      .toLowerCase() // Convert to lowercase
      .trim() // Trim leading and trailing spaces
      .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

    formData.append("category_id", resource.categoryId);
    formData.append("user_id", authUser?.id);
    formData.append("title", resource.title);
    formData.append("slug", slug);
    formData.append("body", resource.body);
    formData.append("link", resource.link);
    formData.append("status", resource.status);

    // Append additional fields as JSON string
    formData.append(
      "additional_fields",
      JSON.stringify(resource.additionalFields)
    );

    // Append each file in the media array
    resource.media.forEach((file) => {
      formData.append(`media[]`, file); // Use `media[]` for array convention
    });

    // Send FormData to backend
    ResourceService.update(formData, authUser?.token)
      .then(() => {
        let category = resourceCategories.find(
          (item) => item.id === resource.categoryId
        );

        navigate(
          `/resources?category_id=${category.id}&category_name=${category.name}`
        );
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else if (error.response.status === 422) {
          setErrors(error.response.data.error);
          snackbar("Invalid input found", "error", 3000);
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  useEffect(() => {
    handleAllResourceCategories();
    handleReadResourceBySlug();
  }, []);

  // Handle sort media
  useEffect(() => {
    let pdfs = resource.media.filter((file) => file.mimetype.includes("pdf"));
    let images = resource.media.filter((file) =>
      file.mimetype.includes("image")
    );

    setMedia((prev) => ({ ...prev, pdfs: pdfs }));
    setMedia((prev) => ({ ...prev, images: images }));
  }, [resource]);

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
      <Box component={"section"} id="resources-update" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            {resource?.title}
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
                <Button variant="contained" onClick={handleUpdateResource}>
                  Publish
                </Button>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <FormControl
                  size="small"
                  fullWidth
                  error={"category_id" in errors}
                >
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={resource.categoryId}
                    name="categoryId"
                    label="Category"
                    onChange={handleOnChange}
                    onClick={() => handleError("category_id")}
                  >
                    <MenuItem value={""}>&nbsp;</MenuItem>
                    {resourceCategories.map((item, i) => (
                      <MenuItem value={item.id} key={i}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {"category_id" in errors && (
                    <FormHelperText>{errors["category_id"]}</FormHelperText>
                  )}
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
                  onClick={() =>
                    "title" in errors
                      ? handleError("title")
                      : handleError("slug")
                  }
                  error={"title" in errors || "slug" in errors}
                  helperText={
                    "title" in errors || "slug" in errors
                      ? errors["title"] || errors["slug"]
                      : ""
                  }
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
              {media.pdfs.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography className="section-heading">Documents</Typography>
                </Grid>
              )}
              {media.pdfs.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  {media.pdfs.map((file, i) => (
                    <Box
                      component={"embed"}
                      key={i}
                      src={`${url.resourceService}${file.url}`}
                      type="application/pdf"
                      width="100%"
                      height="1024px"
                      title={file.title}
                    />
                  ))}
                </Grid>
              )}
              {media.images.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography className="section-heading">
                    Image Gallery
                  </Typography>
                </Grid>
              )}
              {media.images.length > 0 && (
                <LightGallery thumbnail={true}>
                  {media.images.map((file, i) => (
                    <React.Fragment key={i}>
                      <Box
                        component={"a"}
                        href={`${url.resourceService}${file.url}`}
                      >
                        <Box
                          component={"img"}
                          src={`${url.resourceService}${file.url}`}
                          alt={`Resource Image ${i + 1}`}
                          sx={{
                            m: "auto",
                            p: 2,
                            display: "inline-block",
                            width: "25%",
                          }}
                        />
                      </Box>
                    </React.Fragment>
                  ))}
                </LightGallery>
              )}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
