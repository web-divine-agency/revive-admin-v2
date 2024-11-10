import React, { useState, useEffect } from "react";
import "../../../App.css";
import { useNavigate, useParams } from "react-router-dom";
import upload_icon from "../../../assets/images/upload_icon.png";
import check from "../../../assets/images/check.png";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../../axiosInstance.js";
import { FiChevronLeft } from "react-icons/fi";
import Swal from "sweetalert2";
import StickyHeader from "../../SideBar/StickyHeader";

const EditResources = () => {
  const { resourceID } = useParams();
  const [additionalFields, setAdditionalFields] = useState([]);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceBody, setResourceBody] = useState("");
  const [resourceStatus, setResourceStatus] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [selectedResourceMedia, setSelectedResourceMedia] = useState([]);
  const [resourceMedia, setResourceMedia] = useState(null);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/resource/${resourceID}`);
        const resourceData = response.data.resource_data;
        setResourceTitle(resourceData?.resource_title || "");
        setResourceBody(resourceData?.resource_body || "");
        setResourceStatus(resourceData?.status || "");
        setResourceCategory(resourceData?.category || "");
        const parsedFields = JSON.parse(resourceData?.additional_fields);
        setAdditionalFields(parsedFields);
        //console.log(additionalFields);
        setSelectedResourceMedia(
          JSON.parse(resourceData?.resource_media || "[]")
        );
      } catch (error) {
        console.error("Error fetching resource details:", error);
      }
    };

    fetchResourceDetails();
  }, [resourceID]);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResourceMedia((prevFiles) => [...(prevFiles || []), ...files]);
  };

  const handleRemoveMedia = (file) => {
    setDeletedFiles((prevFiles) => [...prevFiles, file]);
    setSelectedResourceMedia((prevMedia) =>
      prevMedia.filter((media) => media !== file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("resource_title", resourceTitle);
    formDataToSend.append("resource_body", resourceBody);
    formDataToSend.append("status", resourceStatus);
    formDataToSend.append("category", resourceCategory);
    formDataToSend.append(
      "additional_fields",
      JSON.stringify(additionalFields)
    );
    formDataToSend.append("delete_media", JSON.stringify(deletedFiles));

    (resourceMedia || []).forEach((file) =>
      formDataToSend.append("resource_media", file)
    );
    try {
      await axiosInstance.put(
        `/update-resource/${resourceID}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Resource has been updated.",
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonColor: "#0ABAA6",
      }).then(() => navigate("/resources-list"));
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <div className="container">
      <StickyHeader />
      <a href="/view-resource" className="back-btn">
        <h3 className="title-page">
          {/* <FiChevronLeft className="icon-left" />  */}
          <FiChevronLeft className="icon-left" /> Update Resource
        </h3>
      </a>
      <div className="row">
        <div className="col-lg-12 col-md-6 resources-content-container">
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="btn btn-primary float-end publish-btn mb-2"
            >
              {/* <i className="fa fa-paper-plane"></i>  */}
              Publish Edit
            </button>
            <div className="container-content" id="edit-rsrc-container">
              <div className="resource-page">
                <div>
                  <input
                    className="link"
                    type="text"
                    placeholder="Category"
                    id="category"
                    name="category"
                    value={resourceCategory}
                    onChange={(e) => setResourceCategory(e.target.value)}
                  />
                  <br />
                  <input
                    className="title"
                    type="text"
                    placeholder="Add title"
                    id="title"
                    name="resource_title"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    required
                  />
                  <br />
                  <textarea
                    className="description w-100"
                    type="text"
                    placeholder="Add description"
                    id="name"
                    name="resource_body"
                    value={resourceBody}
                    onChange={(e) => setResourceBody(e.target.value)}
                    required
                  />
                  <div>
                    {additionalFields?.map((field, index) => (
                      <div
                        id="addFields"
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
                          placeholder={`Add additional instruction ${
                            index + 1
                          }`}
                          value={field}
                          onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                          }
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
                    <h5>Current Media</h5>
                    <div id="selectedImagesContainer">
                      {selectedResourceMedia.map((file, index) => (
                        <div key={index} id="selectedImages">
                          <img
                            src={`https://dev.server.revivepharmacyportal.com.au/uploads/${file}`}
                            alt={`Thumbnail ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(file)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditResources;
