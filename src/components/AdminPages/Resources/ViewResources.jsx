import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import resources_placeholder from "../../../assets/images/resources_placeholder.png";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import { FiChevronLeft } from 'react-icons/fi';


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
      text: "You won’t be able to revert this!",
      showCancelButton: true,
      icon: "warning",
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#000000",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-resource/${id}`);
          Swal.fire("Deleted!", "Your resource has been deleted.", "success");
          navigate("/resources-list"); // Redirect to Resources List after deletion
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
      {role === "Admin" && (
        <button
          onClick={() => navigate(`/edit-resource/${resource.id}`)}
          className="btn btn-primary float-end edit-resource-btn"
        >
          Edit Resource
        </button>
      )}
      <a href="/resources-list" className="back-btn">
        <h3 className="title-page">
          <FiChevronLeft className="icon-left" /> Resource View
        </h3>
      </a>

      <div className="container-content">
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
              <h2 className="description">{resource.additional_fields}</h2>
            </div>
            <div className="image-grid">
              {resource?.resource_media ? (
                (resource?.resource_media).map((media, index) =>
                  media.endsWith(".pdf") ? (
                    <embed
                      key={index}
                      src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                      type="application/pdf"
                      width="50%"
                      height="600px"
                      title="PDF Document"
                    />
                  ) : media.endsWith(".mp4") ||
                    media.endsWith(".mkv") ||
                    media.endsWith(".avi") ? (
                    <video
                      className="video-item"
                      key={index}
                      width="100%"
                      height="100%"
                      controls
                    >
                      <source
                        src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                        type="video/mp4"
                      />
                    </video>
                  ) : media.endsWith(".jpg") ||
                    media.endsWith(".jpeg") ||
                    media.endsWith(".png") ? (
                    <img
                      key={index}
                      src={`https://dev.server.revivepharmacyportal.com.au/uploads/${media}`}
                      alt="Resource Image"
                      width="auto"
                      height="300px"
                      className="image-item"
                      onClick={() =>
                        openModal(
                          `https://dev.server.revivepharmacyportal.com.au/uploads/${media}`
                        )
                      }
                    />
                  ) : (
                    <img
                      key={index}
                      src={resources_placeholder}
                      alt="No Media"
                      width="100%"
                      height="200"
                    />
                  )
                )
              ) : (
                <h3>No Media or Materials</h3>
              )}
            </div>
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
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            {selectedMedia.endsWith(".mp4") ||
            selectedMedia.endsWith(".mkv") ||
            selectedMedia.endsWith(".avi") ? (
              <video controls className="modal-image">
                <source src={selectedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedMedia}
                alt="Large View"
                className="modal-image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResources;
