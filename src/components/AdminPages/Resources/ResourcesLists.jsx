import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import delete_icon from "../../../assets/images/delete_icon.png";
import sample_pdf from "../../../assets/images/sample_pdf.pdf";
import sample_vid from "../../../assets/images/sample_vid.mp4";
import revive_logo from "../../../assets/images/revive-logo.png";
import Swal from "sweetalert2";

function ResourcesLists() {
  const [search, setSearch] = useState("");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false); // State to manage visibility
  const navigate = useNavigate();

  const handleDeleteResource = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The resource has been deleted.",
          imageUrl: delete_icon,
          imageWidth: 100,
          imageHeight: 100,
          confirmButtonText: "OK",
          confirmButtonColor: "#0B3A07",
        });
      }
    });
  };

  // Separate data arrays for general resources and troubleshooting resources
  const generalResources = [
    {
      title: "Resource 1",
      description: "Sample PDF document",
      link: sample_pdf,
      author: "John User",
      type: "pdf",
      instructions: "instruction sample 1",
    },
    {
      title: "Resource 2",
      description: "Sample video file",
      link: sample_vid,
      author: "James Rogan",
      type: "video",
      instructions: "instruction sample 2",
    },
    {
      title: "Resource 3",
      description: "Sample image file",
      link: revive_logo,
      author: "Jane Doe",
      type: "image",
      instructions: "instruction sample 3",
    },
  ];

  const troubleshootingResources = [
    {
      title: "Troubleshooting Guide 1",
      description: "Guide to fix common issue A",
      link: sample_pdf,
      author: "Support Team",
      type: "pdf",
      instructions: "Follow the steps to resolve issue A",
    },
    {
      title: "Troubleshooting Guide 2",
      description: "Video tutorial on fixing issue B",
      link: sample_vid,
      author: "Support Team",
      type: "video",
      instructions: "Watch the video to resolve issue B",
    },
  ];

  const renderResourceCard = (resource) => (
    <div key={resource.title} className="resources-card">
      <div className="card">
        <div className="card-body">
          <button className="delete-resource-btn">
            <img
              src={delete_icon}
              height={24}
              alt=""
              onClick={() => handleDeleteResource()}
            />
          </button>
          <div
            onClick={() =>
              navigate("/view-resource", { state: resource })
            }
            style={{ cursor: "pointer" }}
          >
            <h5 className="card-title">{resource.title}</h5>
            <p className="card-text">{resource.description}</p>
            <p className="card-text">Author: {resource.author}</p>
            {resource.type === "pdf" && (
              <embed
                src={resource.link}
                type="application/pdf"
                width="100%"
                height="200px"
                title="PDF Document"
              />
            )}
            {resource.type === "video" && (
              <video width="100%" height="200" controls>
                <source src={resource.link} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {resource.type === "image" && (
              <img
                src={resource.link}
                alt="Resource"
                width="100%"
                height="200"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Resources Lists</h3>
          <div className="top-filter">
            <input
              id="search-bar"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => navigate("/resources")}
              className="btn btn-primary float-end add-resource-btn"
            >
              <i className="fa fa-plus"></i> Add New Resource
            </button>
          </div>

          <div className="container-content">
            <h3 className="mt-3">General Resources</h3>
            <div className="resources-content">
              {generalResources.map((resource) => renderResourceCard(resource))}
            </div>

            {/* Troubleshooting Folder */}
            <div className="troubleshooting-folder">
              <h4
                onClick={() => setShowTroubleshooting(!showTroubleshooting)} // Toggle visibility
                style={{ cursor: "pointer", color: "#007bff" }}
              >
               <h3 className="mt-3">Troubleshooting Resources {showTroubleshooting ? "▲" : "▼"}</h3> 
              </h4>
              {showTroubleshooting && (
                <div className="resources-content">
                  {troubleshootingResources.map((resource) => renderResourceCard(resource))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesLists;
