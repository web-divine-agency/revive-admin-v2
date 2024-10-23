import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../../../App.css";
import "font-awesome/css/font-awesome.min.css";
import check from "../../../assets/images/check.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance";
import { useLoader } from "../../Loaders/LoaderContext";

function TicketCategory() {
  const [search, setSearch] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
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
    const fetchTicketTypes = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/ticketTypes");
        const formattedData = response.data.map((ticket_type) => ({
          id: ticket_type.id,
          ticket_type: ticket_type.ticket_type,
        }));
        setTicketTypes(formattedData);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketTypes();
  }, [setLoading]);

  // Handle checkbox selection
  const handleCheckboxChange = (id, category) => {
    setSelectedCategories((prevSelectedCategories) => ({
      ...prevSelectedCategories,
      [id]: category,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatePromises = Object.keys(selectedCategories).map(async (ticketId) => {
        const category = selectedCategories[ticketId];
        await axiosInstance.post(`/assign-ticket-category/${ticketId}`, { category });
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
        <label className="mr-2">Popular</label>
        <input
          className="mr-3"
          type="checkbox"
          checked={selectedCategories[row.id] === "Popular"}
          onChange={() => handleCheckboxChange(row.id, "Popular")}
        />
        <label className="mr-2">Other Fragrances</label>
        <input
          type="checkbox"
          checked={selectedCategories[row.id] === "Other Fragrances"}
          onChange={() => handleCheckboxChange(row.id, "Other Fragrances")}
        />
      </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Tickets Category</h3>
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
              paginationRowsPerPageOptions={[10, 20]}
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
