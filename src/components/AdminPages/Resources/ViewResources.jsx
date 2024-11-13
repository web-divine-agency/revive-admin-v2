import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import resources_placeholder from "../../../assets/images/resources_placeholder.png";
import video_thumbnail from "../../../assets/images/video-icon.png";
import axiosInstance from "../../../../axiosInstance.js";
import Swal from "sweetalert2";
import check from "../../../assets/images/check.png";
import { FiChevronLeft } from "react-icons/fi";
import StickyHeader from "../../SideBar/StickyHeader";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";

const ViewResources = () => {
  //const location = useLocation();
  //const resource = location.state;

  const { resourceID } = useParams();
  const { slug } = useParams();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState("");

  const [additionalFields, setAdditionalFields] = useState([]);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceBody, setResourceBody] = useState("");
  //const [resourceStatus, setResourceStatus] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [selectedResourceMedia, setSelectedResourceMedia] = useState([]);
  const [resourceMedia, setResourceMedia] = useState(null);

  const [userFetched, setUserFetched] = useState(false);
  //console.log(slug)

  const openModal = (mediaSrc) => {
    setSelectedMedia(mediaSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  const handleDeleteResource = async (resourceID, slug) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!.",
      showCancelButton: true,
      icon: "warning",
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#00000000",
      cancelTextColor: "#000000",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: "custom-container",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-swal-title",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url = role === "Admin" 
            ? `/delete-resource/${resourceID}` 
            : `/delete-resource/${slug}`;
          await axiosInstance.delete(url);
          Swal.fire({
            title: "Resource Deleted",
            text: ` ${resourceTitle}  has been removed successfully.`,
            imageUrl: check,
            imageWidth: 100,
            imageHeight: 100,
            confirmButtonText: "OK",
            confirmButtonColor: "#0ABAA6",
          }).then(() => {
            // Redirect to user list
            navigate("/resources-list");
          }); // Redirect to Resources List after deletion
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error deleting the resource.",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/user");
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
          const url = role === "Admin" 
            ? `/resource/${resourceID}` 
            : `/resource/${slug}`;
          const response = await axiosInstance.get(url);
          const resourceData = response.data.resource_data;
          setResourceTitle(resourceData?.resource_title || "");
          setResourceBody(resourceData?.resource_body || "");
          setResourceCategory(resourceData?.category || "");
          const parsedFields = JSON.parse(resourceData?.additional_fields || "[]");
          setAdditionalFields(parsedFields);
          setResourceMedia(JSON.parse(resourceData?.resource_media || "[]"));
          setSelectedResourceMedia(JSON.parse(resourceData?.resource_media || "[]"));
          console.log(selectedResourceMedia);
        } catch (error) {
          console.error("Error fetching resource details:", error);
        }
      }, 1000); // Delay fetch by 2 seconds
  
      return () => clearTimeout(timer); // Cleanup timer if component unmounts or effect re-runs
    }
  }, [userFetched, role]);

  return (
    <div className="container">
      <StickyHeader />
      <a href="/resources-list" className="back-btn">
        <h3 className="title-page">
          <FiChevronLeft className="icon-left" /> Resource View
        </h3>
      </a>
      <div className="row">
        <div className="col-lg-12 col-md-6 resources-content-container">
          {role === "Admin" && (
            <button
              onClick={() => navigate(`/edit-resource/${resourceID}`)}
              className="btn btn-primary float-end edit-resource-btn mb-2"
            >
              Edit Resource
            </button>
          )}

          <div className="container-content" id="view-rsrc-container">
            <div className="created-resource">
              <h2 className="title">{resourceTitle}</h2>
              <div className="resoruce-iamge-content" dangerouslySetInnerHTML={{ __html: resourceBody }}></div>
              {additionalFields.map((field, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: field.content }}
                ></div>
              ))}

              {/* Image Gallery using LightGallery */}
              {resourceMedia &&
                resourceMedia.some((media) =>
                  media.match(/\.(jpg|jpeg|png|gif)$/i)
                ) && <h3>Image Gallery:</h3>}
              {resourceMedia && (
                <div>
                  <LightGallery>
                    {resourceMedia
                      .filter((media) => media.match(/\.(jpg|jpeg|png|gif)$/i))
                      .map((media, index) => (
                        <a
                          key={index}
                          href={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                        >
                          <img
                            src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                            alt={`Resource Image ${index + 1}`}
                            className="image-thumbnail"
                            width="8%"
                            height="8%"
                          />
                        </a>
                      ))}
                  </LightGallery>
                </div>
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
                            <ReactPlayer
                              url={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                              width="100%"
                              height="auto"
                              controls
                              onClick={() => handleViewResource(resource.id, resource.resource_link)}
                            />
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

              {role === "Admin" && (
                <button
                  className="btn btn-primary float-end delete-resource-btn"
                  onClick={() => handleDeleteResource(resourceID)}
                >
                  Delete
                </button>
              )}
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default ViewResources;
