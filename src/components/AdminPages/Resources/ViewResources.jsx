import React, { useState } from "react";
import "../../../App.css";
import sample_vid from "../../../assets/images/sample_vid.mp4";
import { FiCopy } from "react-icons/fi";
import { useLocation } from "react-router-dom";

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
      <h3>Created Resources</h3>
      <div className="container-content">
        <div className="created-resource">
          <div>
            <div>
              <h2 className="title">{resource.title}</h2>
            </div>
            <br />
            <div>
              <h2 className="description">{resource.description}</h2>
            </div>
            {resource.type === "pdf" && (
                        <iframe
                          src={resource.link}
                          type="application/pdf"
                          width="100%"
                          height="800px"
                          title="PDF Document"
                        />
                      )}
                      {resource.type === "video" && (
                        <video width="100%" height="100%" controls>
                          <source src={resource.link} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {resource.type === "image" && (
                        <img src={resource.link} alt="Resource" width="100%" height="100%" />
                      )}
            {/* <div className="uploaded-files">
              {resources.map((resource, index) => (
                <div key={index} className="file-item">
                  <a
                    href={resource.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h4>{resource.name}</h4>
                    {renderPreview(resource)}
                  </a>

                  <div
                    className="copy-icon"
                    onClick={() => handleCopyLink(resource.file)}
                    title="Copy Link"
                  >
                    <FiCopy size={28} />
                  </div>

                  {copiedLink === resource.file && (
                    <span
                      style={{
                        color: "gray",
                        position: "absolute",
                        top: -25,
                        left: 10,
                      }}
                    >
                      Link copied!
                    </span>
                  )}
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResources;
