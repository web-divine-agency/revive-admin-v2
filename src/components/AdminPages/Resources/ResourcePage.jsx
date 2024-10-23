import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../App.css";
import upload_icon from "../../../assets/images/upload_icon.png";
import greater_than from "../../../assets/images/greater_than.png";
import sample_vid from "../../../assets/images/sample_vid.mp4";
import sample_pdf from "../../../assets/images/sample_pdf.pdf";
import { FiCopy } from "react-icons/fi";

const ResourcePage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
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

  const resources = [
    {
      name: "PDF_File_1",
      type: "pdf",
      file: sample_pdf,
    },
    {
      name: "Word_Document_2",
      type: "doc",
      file: "/assets/files/sample.docx",
    },
    {
      name: "Excel_Sheet_3",
      type: "excel",
      file: "/assets/files/sample.xlsx",
    },
    {
      name: "Image_File_4",
      type: "image",
      file: upload_icon,
    },
    {
      name: "Video_File_5",
      type: "video",
      file: sample_vid,
    },
  ];

  const renderPreview = (resource) => {
    switch (resource.type) {
      case "pdf":
        return (
          <iframe
            src={resource.file}
            width="150px"
            height="100px"
            title={resource.name}
          ></iframe>
        );
      case "image":
        return <img src={resource.file} alt={resource.name} width="150px" />;
      case "video":
        return (
          <video width="150" controls>
            <source src={resource.file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "doc":
      case "excel":
        return (
          <a href={resource.file} target="_blank" rel="noopener noreferrer">
            {resource.name} (Preview not supported. Click to download.)
          </a>
        );
      default:
        return <p>No preview available</p>;
    }
  };

  return (
    <div className="container">
      <h3>Create Resources</h3>
      <button
              onClick={() => navigate("/resources")}
              className="btn btn-primary float-end publish-btn"
            >
             <i className="fa fa-paper-plane"></i>

              Publish
            </button>
      <div className="container-content">
      
        <div className="resource-page">
          
          <div>
            <form action="">
              <input
                className="title"
                type="text"
                placeholder="Add title"
                id="title"
                name="title"
                required
              />
              <br />
              <textarea
                className="description"
                type="text"
                placeholder="Add description"
                id="name"
                name="name"
                required
              />
               <input
                className="link"
                type="text"
                placeholder="Paste Link"
                id="link"
                name="link"
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
              <a onClick={handleShow} >
                Add  File <img src={greater_than} alt="" height={40}/>
              </a>
              </div>
              
            </form>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Upload your resources</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p>
              You can upload any type of file, such as training materials,
              presentations, images, or documents.
            </p>

            <div className="upload-box mb-4">
              <div className="upload-content">
                <img src={upload_icon} alt="Upload" />
                <p>Browse and choose the files you want to upload</p>
                <input
                  type="file"
                  id="fileInput"
                  name="fileInput"
                  multiple
                  className="file-input"
                />
              </div>
              <button type="" className="btn btn-primary upload-resource-btn mt-3">Upload</button>
            </div>
          </div>
          <div className="recently-uploaded">
            <h3>Recently Uploaded</h3>
            <p>
            After you upload a file, you can copy its link and paste it into the link field.
            </p>
            <div className="uploaded-files">
              
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResourcePage;
