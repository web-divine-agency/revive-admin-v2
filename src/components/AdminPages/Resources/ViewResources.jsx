import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const resource = location.state;
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState("");

  const openModal = (mediaSrc) => {
    setSelectedMedia(mediaSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  const handleDeleteResource = async (id) => {
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
          await axiosInstance.delete(`/delete-resource/${id}`);
          Swal.fire({
            title: "Resource Deleted",
            text: ` ${resource.resource_title}  has been removed successfully.`,
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
        const role = roles.length > 0 ? roles[0].role_name : "No Role";
        setRole(role);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

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
              onClick={() => navigate(`/edit-resource/${resource.id}`)}
              className="btn btn-primary float-end edit-resource-btn mb-2"
            >
              Edit Resource
            </button>
          )}

          <div className="container-content"  id="view-rsrc-container">
            <div className="created-resource">
              <div>
                <div>
                  <h2 className="title">{resource.resource_title}</h2>
                </div>
                <br />
                <div>
                  <h2 className="description">{resource.resource_body}</h2>
                </div>
                <div>
                  <h2 className="title font-weight-bold mb-3">Instruction</h2>{" "}
                  <br />
                  <h2 className="description">
                    {(() => {
                    try {
                      // Parse once to get the array if it's a JSON string
                      const parsedFields = JSON.parse(resource.additional_fields);
                      console.log(parsedFields);
                      if (Array.isArray(parsedFields) && parsedFields.length > 0) {
                        return parsedFields.map((field, index) => (
                          <div key={index}>{field}</div>
                        ));
                      } else {
                        return "No instruction provided";
                      }
                    } catch (error) {
                      return "Catch error";
                    }
                  })()}
                </h2>
              </div>

              {resource?.resource_media && resource.resource_media.some(media => media.match(/\.(jpg|jpeg|png)$/i)) && (
              <LightGallery
                plugins={[lgThumbnail, lgZoom]}
                thumbnail
                className="lightgallery"
              >
                <h3>Resource Gallery:</h3>
                {resource.resource_media
                  .filter((media) => media.match(/\.(jpg|jpeg|png)$/i))
                  .map((media, index) => (
                    <a
                      key={index}
                      href={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                    >
                      <img
                        src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                        alt={`Resource Image ${index + 1}`}
                        className="gallery-thumbnail"
                        width="8%"
                        height="8%"
                      />
                    </a>
                  ))}
              </LightGallery>
            )}

            {resource?.resource_media && resource.resource_media.some(media => media.match(/\.(mp4|mkv|avi)$/i)) && (
              <LightGallery
                plugins={[lgVideo, lgThumbnail]}
                thumbnail
                videojs={true}
                className="lightgallery"
              >
                <h3>Video Gallery:</h3>
                {resource.resource_media
                  .filter((media) => media.match(/\.(mp4|mkv|avi)$/i))
                  .map((media, index) => (
                    <a
                      key={index}
                      data-src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                      data-lg-size="1280-720"
                      data-poster={`https://dev.server.revivepharmacyportal.com.au/uploads/${media.replace(/\.(mp4|mkv|avi)$/i, ".jpg")}`}
                      data-sub-html={`<h4>Resource Video ${index + 1}</h4>`}
                    >
                      <img
                        src={video_thumbnail}
                        alt={`Resource Video ${index + 1}`}
                        className="video-thumbnail"
                        width="8%"
                        height="8%"
                      />
                    </a>
                  ))}
              </LightGallery>
            )}

            <div className="image-grid">
              {resource?.resource_media &&
                resource.resource_media.map((media, index) =>
                  media.endsWith(".pdf") ? (
                    <embed
                      key={index}
                      src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                      type="application/pdf"
                      width="50%"
                      height="600px"
                      title="PDF Document"
                    />
                  ) : null
                )}
            </div>


                {role === "Admin" && (
                  <button
                    className="btn btn-primary float-end delete-resource-btn"
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
          {isModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                className="modal-content-resource"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="close-button" onClick={closeModal}>
                  &times;
                </span>
                {selectedMedia.endsWith(".mp4") ||
                selectedMedia.endsWith(".mkv") ||
                selectedMedia.endsWith(".avi") ? (
                  <video controls className="modal-image-resource">
                    <source src={selectedMedia} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={selectedMedia}
                    alt="Large View"
                    className="modal-image-resource"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResources;
