import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";

import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./Resources.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import { url } from "@/config/app";

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";

import ResourceService from "@/services/ResourceService";

export default function ResourcesRead() {
  const navigate = useNavigate();

  const { resourceSlug } = useParams();

  const { authUser } = useContext(Global);

  const [resourceDeleteModalOpen, setResourceDeleteModalOpen] = useState(false);

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

  const [media, setMedia] = useState({
    pdfs: [],
    images: [],
  });

  const handleDeleteResource = () => {};

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

  useEffect(() => {
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

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="resources-read" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            {resource.title}
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
                {authUser?.role_name === "Admin" && (
                  <React.Fragment>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/resources/${resourceSlug}/update`}
                      className="mui-btn mui-btn-edit"
                    >
                      Edit Resource
                    </Button>
                    <Button
                      onClick={() => setResourceDeleteModalOpen(true)}
                      variant="contained"
                      color="red"
                    >
                      Delete Resource
                    </Button>
                  </React.Fragment>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography className="section-heading">
                  {resource.title}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <div
                  className="resoruce-iamge-content"
                  dangerouslySetInnerHTML={{ __html: resource.body }}
                ></div>
              </Grid>
              {resource.additionalFields.map((field, index) => (
                <Grid
                  size={{ xs: 12 }}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: field.content }}
                ></Grid>
              ))}
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
      <Modal
        open={resourceDeleteModalOpen}
        onClose={() => setResourceDeleteModalOpen(false)}
        className="resource-delete-modal"
      >
        <Paper elevation={4} className="modal-holder">
          <Box className="modal-header">
            <Typography>Delete Resource</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="are-you-sure">Are you sure?</Typography>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setResourceDeleteModalOpen(false)}
              className="mui-btn mui-btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={() => handleDeleteResource()}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
