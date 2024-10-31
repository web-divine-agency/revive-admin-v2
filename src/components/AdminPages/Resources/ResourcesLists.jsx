import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import check from "../../../assets/images/check.png";
import resources_placeholder from "../../../assets/images/resources_placeholder.png";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import { useLoader } from "../../Loaders/LoaderContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ResourcesLists() {
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [resources, setResources] = useState([]);
  const [currentPageGeneral, setCurrentPageGeneral] = useState(1);
  const [itemsPerPageGeneral, setItemsPerPageGeneral] = useState(3);
  const [currentPageTroubleshooting, setCurrentPageTroubleshooting] =
    useState(1);
  const [itemsPerPageTroubleshooting, setItemsPerPageTroubleshooting] =
    useState(3);
  const [role, setRole] = useState("");
  const { setLoading } = useLoader();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/all-resources");
        setResources(response.data.resource_data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [setLoading]);

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

  // General Resources Pagination
  const indexOfLastItemGeneral = currentPageGeneral * itemsPerPageGeneral;
  const indexOfFirstItemGeneral = indexOfLastItemGeneral - itemsPerPageGeneral;
  const generalResources = filteredResources
    .filter((resource) => resource.category === "General Resource")
    .slice(indexOfFirstItemGeneral, indexOfLastItemGeneral);
  const totalPagesGeneral = Math.ceil(
    filteredResources.filter(
      (resource) => resource.category === "General Resource"
    ).length / itemsPerPageGeneral
  );

  const handlePreviousPageGeneral = () => {
    setCurrentPageGeneral((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPageGeneral = () => {
    setCurrentPageGeneral((prev) =>
      prev < totalPagesGeneral ? prev + 1 : prev
    );
  };

  const handleItemsPerPageChangeGeneral = (e) => {
    setItemsPerPageGeneral(parseInt(e.target.value, 10));
    setCurrentPageGeneral(1);
  };

  // Troubleshooting Resources Pagination
  const indexOfLastItemTroubleshooting =
    currentPageTroubleshooting * itemsPerPageTroubleshooting;
  const indexOfFirstItemTroubleshooting =
    indexOfLastItemTroubleshooting - itemsPerPageTroubleshooting;
  const troubleshootingResources = filteredResources
    .filter((resource) => resource.category === "Troubleshooting Resource")
    .slice(indexOfFirstItemTroubleshooting, indexOfLastItemTroubleshooting);
  const totalPagesTroubleshooting = Math.ceil(
    filteredResources.filter(
      (resource) => resource.category === "Troubleshooting Resource"
    ).length / itemsPerPageTroubleshooting
  );

  const handlePreviousPageTroubleshooting = () => {
    setCurrentPageTroubleshooting((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPageTroubleshooting = () => {
    setCurrentPageTroubleshooting((prev) =>
      prev < totalPagesTroubleshooting ? prev + 1 : prev
    );
  };

  const handleItemsPerPageChangeTroubleshooting = (e) => {
    setItemsPerPageTroubleshooting(parseInt(e.target.value, 10));
    setCurrentPageTroubleshooting(1);
  };

  const renderResourceCard = (resource) => {
    return (
      <div key={resource.id} className="resources-card">
        <div className="card">
          <div className="card-body">
            {/* {role === "Admin" && (
              <button
                className="delete-resource-btn"
                onClick={() => handleDeleteResource(resource.id)}
              >
                <img src={delete_icon} height={24} alt="Delete" />
              </button>
            )} */}
            <div
              onClick={() => navigate("/view-resource", { state: resource })}
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
      <h3>Resources Lists</h3>
      <div className="top-filter">
        <select
          name="filter"
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
                {/* <i className="fa fa-plus"></i>  */}
                Add New Resource
              </button>
            )}
      </div>

      {/* General Resources */}
      <h3>General Resources</h3>
      <div className="resources-content">
        {generalResources.map((resource) => renderResourceCard(resource))}
      </div>
      <div className="pagination-controls">
        <div className="d-flex">
          <label>
            Show
            <select
              value={itemsPerPageGeneral}
              onChange={handleItemsPerPageChangeGeneral}
            >
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
            </select>
            entries
          </label>
        </div>
        <button
          onClick={handlePreviousPageGeneral}
          disabled={currentPageGeneral === 1}
        >
          <FiChevronLeft />
        </button>
        <span>
          Page {currentPageGeneral} of {totalPagesGeneral}
        </span>
        <button
          onClick={handleNextPageGeneral}
          disabled={currentPageGeneral === totalPagesGeneral}
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Troubleshooting Resources */}
      <h3
        onClick={() => setShowTroubleshooting(!showTroubleshooting)}
        style={{ cursor: "pointer" }}
      >
        Troubleshooting Resources {showTroubleshooting ? "▲" : "▼"}
      </h3>
      {showTroubleshooting && (
        <>
          <div className="resources-content">
            {troubleshootingResources.map((resource) =>
              renderResourceCard(resource)
            )}
          </div>
          <div className="pagination-controls">
          <div className="d-flex">
          <label>
            Show
            <select
                value={itemsPerPageGeneral}
                onChange={handleItemsPerPageChangeGeneral}
            >
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
            </select>
            entries
          </label>
        </div>
            <button
              onClick={handlePreviousPageTroubleshooting}
              disabled={currentPageTroubleshooting === 1}
            >
              <FiChevronLeft />
            </button>
            <span>
              Page {currentPageTroubleshooting} of {totalPagesTroubleshooting}
            </span>
            <button
              onClick={handleNextPageTroubleshooting}
              disabled={
                currentPageTroubleshooting === totalPagesTroubleshooting
              }
            >
              <FiChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ResourcesLists;
