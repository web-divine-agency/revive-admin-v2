import React, { useState, useEffect, useContext } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Helmet } from "react-helmet";

import ReactPlayer from "react-player";
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

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";

export default function ResourcesRead() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { resourceSlug } = useParams();

  const { authUser } = useContext(Global);

  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState("");

  const [additionalFields, setAdditionalFields] = useState([]);

  const [resourceTitle, setResourceTitle] = useState("");

  const [resourceBody, setResourceBody] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [resourceCategory, setResourceCategory] = useState("");

  const [selectedResourceMedia, setSelectedResourceMedia] = useState([]);

  const [resourceMedia, setResourceMedia] = useState(null);

  const [userFetched, setUserFetched] = useState(false);

  const [resourceDeleteModalOpen, setResourceDeleteModalOpen] = useState(false);

  const [resource, setResource] = useState({});

  // eslint-disable-next-line no-unused-vars
  const openModal = (mediaSrc) => {
    setSelectedMedia(mediaSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  const handleDeleteResource = () => {};

  const handleReadResourceBySlug = () => {};

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
            {resourceTitle}
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
                {role === "Admin" && (
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
                  {resourceTitle}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <div
                  className="resoruce-iamge-content"
                  dangerouslySetInnerHTML={{ __html: resourceBody }}
                ></div>
              </Grid>
              {additionalFields.map((field, index) => (
                <Grid
                  size={{ xs: 12 }}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: field.content }}
                ></Grid>
              ))}
              {resourceMedia &&
                resourceMedia.some((media) =>
                  media.match(/\.(jpg|jpeg|png|gif)$/i)
                ) && (
                  <Grid size={{ xs: 12 }}>
                    <Typography className="section-heading">
                      Image Gallery
                    </Typography>
                  </Grid>
                )}
              {resourceMedia && (
                <LightGallery thumbnail={true}>
                  {resourceMedia
                    .filter((media) => media.match(/\.(jpg|jpeg|png|gif)$/i))
                    .map((media, i) => (
                      <React.Fragment key={i}>
                        <Box
                          component={"a"}
                          href={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                        >
                          <Box
                            component={"img"}
                            src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
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

              {/* Video Gallery using ReactPlayer */}
              {resourceMedia &&
                resourceMedia.some((media) =>
                  media.match(/\.(mp4|mkv|avi)$/i)
                ) && (
                  <div>
                    <h3>Video Gallery:</h3>
                    <div className="video-gallery">
                      {resourceMedia
                        .filter((media) => media.match(/\.(mp4|mkv|avi)$/i))
                        .map((media, index) => (
                          <div key={index} className="video-item">
                            {/* <ReactPlayer
                              url={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                              width="100%"
                              height="auto"
                              controls
                              onClick={() => handleViewResource(resource.id, resource.resource_link)}
                            /> */}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* PDF Viewer */}
              {resourceMedia &&
                resourceMedia.some((media) => media.endsWith(".pdf")) && (
                  <h3>Other Documents:</h3>
                )}
              <div className="image-grid">
                {resourceMedia &&
                  resourceMedia.map((media, index) =>
                    media.endsWith(".pdf") ? (
                      <>
                        <embed
                          key={index}
                          src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                          type="application/pdf"
                          width="150%"
                          height="600px"
                          title="PDF Document"
                          className="embedded-pdf"
                        />
                        <a
                          href={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                          download
                          className="pdf-download-link mobile-only"
                        >
                          Download PDF
                        </a>
                      </>
                    ) : null
                  )}
              </div>

              {/* Modal for Video */}
              {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                  <span className="close-button" onClick={closeModal}>
                    &times;
                  </span>
                  <div
                    className="modal-content-resource"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ReactPlayer
                      url={selectedMedia}
                      width="100%"
                      height="auto"
                      controls
                    />
                  </div>
                </div>
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
        <Paper elevation={4} className="modal-holder modal-holder-sm">
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
              onClick={() => handleDeleteResource(resourceID, slug)}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
