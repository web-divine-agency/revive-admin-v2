import React, { useState, useEffect } from "react";
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

import NavTopbar from "@/components/navigation/NavTopbar.jsx";
import NavSidebar from "@/components/navigation/NavSidebar.jsx";

export default function ResourcesRead() {
  const [searchParams] = useSearchParams();

  const { resourceID } = useParams();
  const { slug } = useParams();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
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

  // eslint-disable-next-line no-unused-vars
  const openModal = (mediaSrc) => {
    setSelectedMedia(mediaSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  const handleDeleteResource = async (resourceID, slug) => {
    try {
      const url =
        role === "Admin"
          ? `/delete-resource/${resourceID}`
          : `/delete-resource/${slug}`;

      console.log(`delete ${url}`);

      navigate(
        `/resources?category=${decodeURI(searchParams.get("category"))}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = {};
        const { roles } = response.data;
        const roleName = roles.length > 0 ? roles[0].role_name : "No Role";
        setRole(roleName);
        setUserFetched(true);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  });

  useEffect(() => {
    // Only fetch resource details if user details are fetched and delay by 2 seconds
    if (userFetched) {
      const timer = setTimeout(async () => {
        try {
          const url =
            role === "Admin"
              ? `/resource/${resourceID}`
              : `/resource/${resourceID}`;

          console.log(`get ${url}`);
          const response = {};
          const resourceData = response.data.resource_data;
          setResourceTitle(resourceData?.resource_title || "");
          setResourceBody(resourceData?.resource_body || "");
          setResourceCategory(resourceData?.category || "");
          const parsedFields = JSON.parse(
            resourceData?.additional_fields || "[]"
          );
          setAdditionalFields(parsedFields);
          setResourceMedia(JSON.parse(resourceData?.resource_media || "[]"));
          setSelectedResourceMedia(
            JSON.parse(resourceData?.resource_media || "[]")
          );
          console.log(selectedResourceMedia);
        } catch (error) {
          console.error("Error fetching resource details:", error);
        }
      }, 1000); // Delay fetch by 2 seconds

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or effect re-runs
    }
  }, [userFetched, role]);

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
                  <>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/resources/${resourceID}/update`}
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
                  </>
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
