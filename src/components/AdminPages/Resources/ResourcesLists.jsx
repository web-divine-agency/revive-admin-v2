import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import delete_icon from "../../../assets/images/delete_icon.png";
import check from "../../../assets/images/check.png";
import revive_logo from "../../../assets/images/revive-logo.png";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import { useLoader } from "../../Loaders/LoaderContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import resources_placeholder from "../../../assets/images/resources_placeholder.png";

function ResourcesLists() {
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Start with 5 items per page
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [troubleshootingResources, setTroubleshootingResources] = useState([]);

  useEffect(() => {
    // Fetch current user details
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

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/all-resources");
        setResources(response.data.resource_data);
        setTroubleshootingResources(response.data.resource_data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [setLoading]);

  const handleDeleteResource = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      showCancelButton: true,
      icon: 'warning',
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-resource/${id}`);
          Swal.fire({
            title: "Success!",
            text: "Resource has been deleted.",
            imageUrl: check,
            imageWidth: 100,
            imageHeight: 100,
            confirmButtonColor: "#0ABAA6",
          });
          setResources((prevResources) =>
            prevResources.filter((resource) => resource.id !== id)
          );
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the resource.",
            icon: "error",
            confirmButtonColor: "#EC221F",
          });
        }
      }
    });
  };

  const handleAuthorFilterChange = (e) => {
    setAuthorFilter(e.target.value);
  };

  const filteredResources = resources.filter((resource) => {
    const authorName = resource.user
      ? `${resource.user?.first_name} ${resource.user?.last_name}`
      : "Unknown";
    const matchesAuthor = authorFilter ? authorName === authorFilter : true;
    const matchesSearch = search
      ? resource.resource_title.toLowerCase().includes(search.toLowerCase()) ||
        authorName.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesAuthor && matchesSearch;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = filteredResources
  .filter(resource => resource.category === "General Resource")
  .slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  // Pagination controls
  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page on items-per-page change
  };

  const renderResourceCard = (resource) => {
    return (
      <div key={resource.id} className="resources-card">
        <div className="card">
          <div className="card-body">
            {role === "Admin" && (
              <button
                className="delete-resource-btn"
                onClick={() => handleDeleteResource(resource.id)}
              >
                <img src={delete_icon} height={24} alt="Delete" />
              </button>
            )}
            <div
              onClick={() =>
                navigate("/view-resource", { state: resource })
              }
              style={{ cursor: "pointer" }}
            >
              <h5 className="card-title">{resource.resource_title}</h5>
              <p className="card-text">{resource.resource_body}</p>
              <p className="card-text">
                Author:{" "}
                {resource.user
                  ? `${resource.user.first_name} ${resource.user.last_name}`
                  : "Unknown"}
              </p>
              <img
                src={resources_placeholder}
                alt="No Media"
                width="100%"
                height="200"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Resources Lists</h3>
          <div className="top-filter">
            <select
              name="filter"
              // className="mr-4"
              id="filter"
              value={authorFilter}
              onChange={handleAuthorFilterChange}
            >
              <option value="">All Authors</option>
              {[
                ...new Set(
                  resources.map((resource) =>
                    resource?.user
                      ? `${resource?.user?.first_name} ${resource?.user?.last_name}`
                      : "Unknown"
                  )
                ),
              ].map((author, index) => (
                <option key={index} value={author}>
                  {author}
                </option>
              ))}
            </select>
            <input
              id="search-bar"
              type="text"
              placeholder="Search by title or author"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {role === "Admin" && (
              <button
                onClick={() => navigate("/resources")}
                className="btn btn-primary float-end add-resource-btn"
              >
                <i className="fa fa-plus"></i> Add New Resource
              </button>
            )}
          </div>

          <div className="container-content">
            <h3 className="mt-3">General Resources</h3>
            <div className="resources-content">
              {currentResources.map((resource) => (
                <div key={resource.id} className="resources-card">
                  <div className="card">
                    <div className="card-body">
                      {role === "Admin" && (
                        <button
                          className="delete-resource-btn"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <img src={delete_icon} height={24} alt="Delete" />
                        </button>
                      )}
                      <div
                        onClick={() =>
                          navigate("/view-resource", { state: resource })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <h5 className="card-title">
                          {resource.resource_title}
                        </h5>
                        <p className="card-text">{resource.resource_body}</p>
                        <p className="card-text">
                          Author:{" "}
                          {resource.user
                            ? `${resource.user.first_name} ${resource.user.last_name}`
                            : "Unknown"}
                        </p>
                        <img
                            src={resources_placeholder}
                            alt="No Media"
                            width="60%"
                            height="auto"
                          />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls align-items-center">
              <div className="d-flex">
                <label>
                  Show
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                  </select>
                  entries
                </label>
              </div>
              <div className="d-flex align-items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft size={24} />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="troubleshooting-folder">
              <h4
                onClick={() => setShowTroubleshooting(!showTroubleshooting)} // Toggle visibility
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                <h3 className="mt-3" style={{color:"black"}}>
                  Troubleshooting Resources {showTroubleshooting ? "▲" : "▼"}
                </h3>
              </h4>
              {showTroubleshooting && (
                <div className="resources-content">
                  {troubleshootingResources
                    .filter((resource) => resource?.category === "Troubleshooting Resource")
                    .map((resource) => renderResourceCard(resource))
                  }
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
