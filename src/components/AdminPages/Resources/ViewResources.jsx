import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FiChevronLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from "react-router-dom";
import resources_placeholder from "../../../assets/images/resources_placeholder.png";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";

const ViewResources = () => {
  const location = useLocation();
  const resource = location.state;
  const [role, setRole] = useState("");
  const navigate = useNavigate();

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
      <div className="row">
        <div className="col-lg-12 col-md-6">
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
          <FiChevronLeft className="icon-left" /> Created Resource
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
                {resource?.resource_media ? (
                  JSON.parse(resource?.resource_media).map((media, index) =>
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
                    media.endsWith(".mkv")  || 
                    media.endsWith(".avi") ? (
                      <video key={index} width="100%" height="100%" controls>
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
      </div>
    </div>
  );
};

export default ViewResources;
