import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../../../App.css";
import "font-awesome/css/font-awesome.min.css";
import check from "../../../assets/images/check.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance";
import { useLoader } from "../../Loaders/LoaderContext";
import { FiArrowLeft } from "react-icons/fi";

//import check from "../../../assets/images/check.png";

function TicketCategory() {
  const [search, setSearch] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({}); // State to track selected categories
  const { setLoading } = useLoader();

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      Swal.fire({
        title: "Login Successful",
        text: `Welcome`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      });
      localStorage.removeItem("loginSuccess");
    }
  }, []);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axiosInstance.get("/categories"); // Fetch all categories
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    const fetchTicketTypes = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/ticketTypes");
        const formattedData = response.data.map((ticket_type) => ({
          id: ticket_type.id,
          ticket_type: ticket_type.ticket_type,
          categories: ticket_type.categories.map(category => ({
            id: category.id, 
            name: category.category_name
          })) 
        }));
        setTicketTypes(formattedData);
  
        const initialCategories = formattedData.reduce((acc, ticket) => {
          acc[ticket.id] = ticket.categories.map(c => c.id); // Store only category ids
          return acc;
        }, {});
        setSelectedCategories(initialCategories);
  
        console.log(formattedData);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories(); // Fetch categories
    fetchTicketTypes(); // Fetch ticket types with their categories
  }, [setLoading]);

  // Handle checkbox selection
  const handleCheckboxChange = (ticketId, categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
      const currentCategories = Array.isArray(prevSelectedCategories[ticketId])
        ? prevSelectedCategories[ticketId]
        : [];
  
      if (currentCategories.includes(categoryId)) {
        return {
          ...prevSelectedCategories,
          [ticketId]: currentCategories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prevSelectedCategories,
          [ticketId]: [...currentCategories, categoryId],
        };
      }
    });
  };
  
  
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const updatePromises = ticketTypes.map(async (ticket) => {
        const ticketId = ticket.id;
        const currentCategories = selectedCategories[ticketId] || [];
        // Send the update request for each ticket with the selected categories
        await axiosInstance.post(`/assign-ticket-category/${ticketId}`, {
          categories: currentCategories, // Send the selected categories
        });
      });
  
      await Promise.all(updatePromises);
  
      Swal.fire({
        title: "Success",
        text: "Ticket categories updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating ticket categories:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update ticket categories",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  const columns = [
    {
      name: "Template",
      selector: (row) => row.ticket_type || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          {categories.map((category) => (
            <div key={category.id}>
              <label className="mr-2">{category.category_name}</label>
              <input
                className="mr-3"
                type="checkbox"
                checked={selectedCategories[row.id]?.includes(category.id)} // Pre-check if assigned
                onChange={() => handleCheckboxChange(row.id, category.id)} // Handle checkbox toggle
              />
            </div>
          ))}
        </div>
      ),
      sortable: false,
    },
  ];
  

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>
          <a href="/generate-tickets" className="back-btn">
          <FiArrowLeft /> Back <br />
        </a>
            Tickets Category</h3>
          <div className="top-filter">
            <input
              id="search-bar"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={ticketTypes}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25]}
            />
            <button
              className="submit-btn mb-4 mt-4"
              type="submit"
              onClick={handleSave}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCategory;
