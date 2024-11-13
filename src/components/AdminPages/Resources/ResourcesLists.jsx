import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import check from "../../../assets/images/check.png";
import resources_placeholder from "../../../assets/images/content-icon.png";
import image_icon from "../../../assets/images/gallery-icon.png";
import file_icon from "../../../assets/images/pdf-icon.png";
import video_icon from "../../../assets/images/video-icon.png";
import video_play_icon from "../../../assets/images/playbutton.svg";
import images_outline from "../../../assets/images/images-outline.svg";
import filetype_pdf from "../../../assets/images/filetype-pdf.svg";

import axiosInstance from "../../../../axiosInstance.js";
import Swal from "sweetalert2";
import { useLoader } from "../../Loaders/LoaderContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StickyHeader from "../../SideBar/StickyHeader";
import "./style.css";

function ResourcesLists() {
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [resources, setResources] = useState([]);
  const [currentPageGeneral, setCurrentPageGeneral] = useState(1);
  const [itemsPerPageGeneral, setItemsPerPageGeneral] = useState(4);
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
        const resourcesWithParsedMedia = response.data.resource_data.map(
          (resource) => {
            return {
              ...resource,
              resource_media: resource.resource_media
                ? JSON.parse(resource.resource_media)
                : [],
            };
          }
        );

        setResources(resourcesWithParsedMedia); // Update state with parsed media
        //console.log(resourcesWithParsedMedia);
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
    .filter(
      (resource) =>
        resource.category === "General Resource" ||
        resource.category !== "Troubleshooting Resource"
    )
    .slice(indexOfFirstItemGeneral, indexOfLastItemGeneral);
  const totalPagesGeneral = Math.ceil(
    filteredResources.filter(
      (resource) =>
        resource.category === "General Resource" ||
        resource.category !== "Troubleshooting Resource"
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
    const hasVideoContent = resource?.resource_media.some((item) =>
      item.endsWith(".mp4")
    );
    const hasPDFContent = resource?.resource_media.some((item) =>
      item.endsWith(".pdf")
    );
    // filetype_pdf
    return (
      <div
        key={resource.id}
        className="resources-card"
        onClick={() => navigate("/view-resource/" + resource.id)}
        style={{ cursor: "pointer" }}
      >
        {/* {`https://dev.server.revivepharmacyportal.com.au/uploads/${resource?.resource_media[0]}`} */}
        <div
          className="card"
          style={{
            backgroundImage:
              "url('https://dev.server.revivepharmacyportal.com.au/uploads/" +
              resource?.resource_media[0] +
              "')",
          }}
        >
          <div className="card-body">
            <div>
              <h5 className="card-title">{resource.resource_title}</h5>
              <p className="card-text author-card">
                Author:{" "}
                {resource.user
                  ? `${resource.user.first_name} ${resource.user.last_name}`
                  : "Unknown"}
              </p>

              {/* <p className="card-text">{resource.resource_body}</p> */}

              {(() => {
                if (hasVideoContent) {
                  return (
                    <div className="contentBadgeCard">
                      <img
                        className="video_play_icon"
                        src={video_play_icon}
                        alt="No Media"
                        width="100%"
                        height="200"
                      />
                    </div>
                  );
                } else if (hasPDFContent) {
                  return (
                    <div className="contentBadgeCard">
                      <img
                        className="filetype_pdf"
                        src={filetype_pdf}
                        alt="No Media"
                        width="100%"
                        height="200"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="contentBadgeCard">
                      <img
                        className="images_outline"
                        src={images_outline}
                        alt="No Media"
                        width="100%"
                        height="200"
                      />
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <StickyHeader />
      <div className="row">
        <div className="col-lg-12 col-md-6 resources-content-container">
          <h3 className="title-page">Resources Lists</h3>
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
          <h3 className="resources-category-text mt-4">General Resources</h3>
          <div className="pagination-controls">
            <div className="d-flex">
              <label>
                Show
                <select
                  value={itemsPerPageGeneral}
                  onChange={handleItemsPerPageChangeGeneral}
                  style={{ width: "60px", padding: "5px" }}
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                </select>
                entries
              </label>
            </div>
          </div>
          <div className="resources-content">
            {generalResources.map((resource) => renderResourceCard(resource))}
          </div>
          <div className="pagination-controls d-flex justify-content-center">
            <div className="d-flex align-items-center">
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
          </div>
          {/* Troubleshooting Resources */}
          <h3
            className="resources-category-text mt-3"
            onClick={() => setShowTroubleshooting(!showTroubleshooting)}
            style={{ cursor: "pointer" }}
          >
            Troubleshooting Resources {showTroubleshooting ? "▲" : "▼"}
          </h3>
          {showTroubleshooting && (
            <>
              <div className="pagination-controls">
                <div className="d-flex">
                  <label>
                    Show
                    <select
                      value={itemsPerPageGeneral}
                      onChange={handleItemsPerPageChangeGeneral}
                      style={{ width: "60px", padding: "5px" }}
                    >
                      <option value="4">4</option>
                      <option value="8">8</option>
                      <option value="12">12</option>
                    </select>
                    entries
                  </label>
                </div>
              </div>
              <div className="resources-content">
                {troubleshootingResources.map((resource) =>
                  renderResourceCard(resource)
                )}
              </div>
              <div className="pagination-controls d-flex justify-content-center">
                <div className="d-flex align-items-center">
                  <button
                    onClick={handlePreviousPageTroubleshooting}
                    disabled={currentPageTroubleshooting === 1}
                  >
                    <FiChevronLeft />
                  </button>
                  <span>
                    Page {currentPageTroubleshooting} of{" "}
                    {totalPagesTroubleshooting}
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourcesLists;
