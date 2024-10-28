import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import upload_icon from "../../../assets/images/upload_icon.png";
import greater_than from "../../../assets/images/greater_than.png";
import { FiCopy } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../../axiosInstance";
import {useLoader} from "../../Loaders/LoaderContext";
import { FiArrowLeft } from "react-icons/fi";


const ResourcePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    resource_title: "",
    resource_body: "",
    status: "draft",
  });
  const [resourceMedia, setResourceMedia] = useState(null);
  const navigate = useNavigate();
  const {setLoading} = useLoader();
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [copiedLink, setCopiedLink] = useState(null);


  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosInstance.get("/all-resources"); // Modify API endpoint as needed
        setResources(response.data.data); // Assuming response structure has resources array
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };
    fetchResources();
  }, [setLoading]);

 

  const handleCopyLink = (link) => {
    const fullLink = `${window.location.origin}${link}`;
    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        setCopiedLink(link);
        setTimeout(() => setCopiedLink(null), 2000);
      })
      .catch((error) => console.error("Failed to copy link: ", error));
  };

  const addNewField = () => {
    setAdditionalFields([...additionalFields, ""]);
  };

  const removeField = (index) => {
    const fields = [...additionalFields];
    fields.splice(index, 1);
    setAdditionalFields(fields);
  };

  const handleFieldChange = (index, value) => {
    const fields = [...additionalFields];
    fields[index] = value;
    setAdditionalFields(fields);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Store multiple files
    setResourceMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("resource_title", formData.resource_title);
    formDataToSend.append("resource_body", formData.resource_body);
    formDataToSend.append("status", formData.status);

    // Append media files
    if (resourceMedia) {
      resourceMedia.forEach((file) => {
        formDataToSend.append("resource_media[]", file); // Send each file
      });
    }

    // Convert additional fields to JSON and add to form data
    //formDataToSend.append("additional_fields", JSON.stringify(additionalFields));

    try {
      await axiosInstance.post("/create-resource", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resource created successfully!");
      setFormData({
        resource_title: "",
        resource_body: "",
        status: "draft",
      });
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  const renderPreview = (resource) => {
    const fileExtension = resource.resource_media.split('.').pop().toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return (
          <iframe
            src={resource.resource_media}
            width="150px"
            height="100px"
            title={resource.title}
          ></iframe>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <img src={resource.resource_media} alt={resource.title} width="150px" title={resource.title} />;
      case "mp4":
      case "mov":
      case "avi":
        return (
          <video width="150" controls>
            <source src={resource.resource_media} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        );
      case "doc":
      case "docx":
      case "xls":
      case "xlsx":
        return (
          <a href={resource.resource_media} target="_blank" rel="noopener noreferrer">
            {resource.title} (Preview not supported. Click to download.)
          </a>
        );
      default:
        return <p>No preview available</p>;
    }
};


  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <h3 className="create-resources-text">
      <a href="/resources-list" className="back-btn">
          <FiArrowLeft /> Back  <br />
        </a>
        Create Resources</h3>
      <button
        onClick={() => navigate("/resources")}
        type="submit"
        className="btn btn-primary float-end publish-btn"
      >
        <i className="fa fa-paper-plane"></i> Publish
      </button>
      <div className="container-content">
        <div className="resource-page">
          <div>
              <input
                className="title"
                type="text"
                placeholder="Add title"
                id="title"
                name="resource_title"
                value={formData.resource_title}
                onChange={handleInputChange}
                required
              />
              <br />
              <textarea
                className="description"
                type="text"
                placeholder="Add description"
                id="name"
                name="resource_body"
                value={formData.resource_body}
                onChange={handleInputChange}
                required
              />
              <div>
              {additionalFields.map((field, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <textarea
                      className="additonal-field"
                      type="text"
                      placeholder={`Add additional instruction ${index + 1}`}
                      value={field}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      style={{ marginRight: "10px" }}
                    />
                   <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeField(index)}
                      style={{ display: "flex", alignItems: "center", marginTop: "-80px" }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 mb-4 add-field"
                onClick={addNewField}
              >
                <i className="fa fa-plus"></i>Add field
              </button>
              <h5>
                Optional<span style={{ color: "red" }}>*</span>
              </h5>
              <input
                className="link"
                type="text"
                placeholder="Paste Link"
                id="link"
                name="link"
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a onClick={handleShow}>
               Add File <img src={greater_than} alt="" height={40} />
                </a>
              </div>
            
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
                  name="resource_media"
                  onChange={handleFileChange}
                  multiple
                  className="file-input"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary upload-resource-btn mt-3"
              >
                Upload
              </button>
            </div>
          </div>
          <div className="recently-uploaded">
            <h3>Recently Uploaded</h3>
            <p>
              After you upload a file, you can copy its link and paste it into
              the link field.
            </p>
            <div className="uploaded-files">
              {resources?.map((resource, index) => (
                <div key={index} className="file-item">
                  <a
                    href={resource.resource_media}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h4>{resource.resource_title}</h4>
                    {renderPreview(resource)}
                  </a>

                  <div
                    className="copy-icon"
                    onClick={() => handleCopyLink(resource.resource_media)}
                    title="Copy Link"
                  >
                    <FiCopy size={28} />
                  </div>

                  {copiedLink === resource.resource_media && (
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
      </form>
    </div>
  );
};

export default ResourcePage;
