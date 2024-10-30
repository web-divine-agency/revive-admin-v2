import React, { useState } from "react";
import "../../../App.css";
import sample_vid from "../../../assets/images/sample_vid.mp4";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import revive_logo from "../../../assets/images/revive-logo.png";

const ViewResources = () => {
  const location = useLocation();
  const resource = location.state;

  const [copiedLink, setCopiedLink] = useState(null);

  const handleCopyLink = (link) => {
    const fullLink = `${window.location.origin}${link}`; // Create the full URL
    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        setCopiedLink(link); // Set the copied link in the state
        setTimeout(() => setCopiedLink(null), 2000); // Hide "Link copied!" after 2 seconds
      })
      .catch((error) => console.error("Failed to copy link: ", error));
  };

  return (
    <div className="container">
      <h3>
        <a href="/resources-list" className="back-btn">
          <FiArrowLeft /> Back <br />
        </a>
        Created Resources
      </h3>

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
                ) : media.endsWith(".mp4") ? (
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
                    src={revive_logo}
                    alt="No Media"
                    width="100%"
                    height="200"
                  />
                )
              )
            ) : (
              <img src={revive_logo} alt="No Media" width="100%" height="200" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResources;
