import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import upload_icon from "../../../assets/images/upload_icon.png";
import check from "../../../assets/images/check.png";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../../axiosInstance.js";
import { FiChevronLeft } from "react-icons/fi";
import Swal from "sweetalert2";

import JoditEditor from "jodit-react";

const EditResources = () => {
  const { resourceID } = useParams();

  const editor = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [viewAsHtml, setViewAsHtml] = useState(false);

  const [role, setRole] = useState("");

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

    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/user");
        const { roles } = response.data;
        const role = roles.length > 0 ? roles[0].role_name : "No Role";
        setRole(role);
        console.log(role);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
    fetchResourceDetails();
  }, [resourceID]);

  const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
    "selectall",
    "print",
    "|",
    "source",
    "|",
  ];

  const config = {
    readonly: role !== "Admin", // Make editor read-only for non-Admins
    toolbarSticky: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    multiple: true,
    buttons: buttons,
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const addNewField = () => {
    setAdditionalFields([...additionalFields, { content: "" }]);
  };

  const removeField = (index) => {
    const fields = [...additionalFields];
    fields.splice(index, 1);
    setAdditionalFields(fields);
  };

  const handleFieldChange = (index, newContent) => {
    const fields = [...additionalFields];
    fields[index].content = newContent;
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
      <a
        onClick={() => navigate(-1)}
        className="back-btn"
        style={{ cursor: "pointer" }}
      >
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
              className="btn btn-primary float-end publish-edit-btn mb-3"
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

                  {role === "Admin" ? (
                    <JoditEditor
                      ref={editor}
                      value={resourceBody}
                      config={config}
                      onBlur={(newContent) => setResourceBody(newContent)} // Update on blur
                    />
                  ) : viewAsHtml ? (
                    <pre>{resourceBody}</pre> // HTML view for Admin
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: resourceBody }} />
                  )}

                  {/* {role === "Admin" && (
                    <button
                      type="button"
                      onClick={() => setViewAsHtml(!viewAsHtml)}
                    >
                      {viewAsHtml ? "Back to Editor" : "View HTML"}
                    </button>
                  )} */}

                  <div className="mt-5">
                    {additionalFields.map((field, index) => (
                      <div
                        key={index}
                        style={{ marginBottom: "10px" }}
                        className="mt-5"
                      >
                        <JoditEditor
                          value={field.content}
                          config={config}
                          onBlur={(newContent) =>
                            handleFieldChange(index, newContent)
                          }
                        />
                        <button
                          type="button"
                          className="btn btn-danger float-end"
                          onClick={() => removeField(index)}
                          style={{
                            marginTop: "-240px",
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 mb-4 add-field"
                      onClick={addNewField}
                    >
                      <i className="fa fa-plus"></i>Add field
                    </button>
                  </div>

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
