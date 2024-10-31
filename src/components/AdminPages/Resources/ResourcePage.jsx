import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import upload_icon from "../../../assets/images/upload_icon.png";
import greater_than from "../../../assets/images/greater_than.png";
import check from "../../../assets/images/check.png";
import { FiCopy } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../../axiosInstance";
import { useLoader } from "../../Loaders/LoaderContext";
import { FiChevronLeft } from 'react-icons/fi';
import Swal from "sweetalert2";

const ResourcePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    resource_title: "",
    resource_body: "",
    status: "draft",
  });
  const [resourceMedia, setResourceMedia] = useState(null);
  const navigate = useNavigate();
  const { setLoading } = useLoader();
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
    formDataToSend.append("category", formData.category);
    formDataToSend.append(
      "additional_fields",
      JSON.stringify(additionalFields)
    );

    // Append media files
    if (resourceMedia.length > 0) {
      resourceMedia.forEach((file) => {
        formDataToSend.append("resource_media", file); // Send each file
      });
    }

    // Convert additional fields to JSON and add to form data
    //formDataToSend.append("additional_fields", JSON.stringify(additionalFields));

    try {
      await axiosInstance.post("/create-resource", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        title: "Success!",
        text: "Resource has been created.",
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        // Redirect to user list
        navigate("/resources-list");
      });
      setFormData({
        resource_title: "",
        resource_body: "",
        status: "draft",
      });
      setResourceMedia([]);
      setAdditionalFields([]);
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <a href="/resources-list" className="back-btn">
        <h3 className="title-page">
          <FiChevronLeft className="icon-left" /> Add New Resource
        </h3>
      </a>
        <button
          onClick={() => navigate("/resources")}
          type="submit"
          className="btn btn-primary float-end publish-btn"
        >
          {/* <i className="fa fa-paper-plane"></i>  */}
          Publish
        </button>
        <div className="container-content">
          <div className="resource-page">
            <div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="General Resource">General Resources</option>
                <option value="Troubleshooting Resource">Troubleshooting Resources</option>
              </select>

              <br />
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
                className="description w-100"
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
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "-80px",
                      }}
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
              <h5>Upload Files</h5>
              <div className="upload-box mb-4 text-center">
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
                  type="button"
                  className="btn btn-primary upload-resource-btn mt-3"
                  onClick={() => console.log(resourceMedia)} // Optional action for upload preview
                >
                  Show Selected Files
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResourcePage;
