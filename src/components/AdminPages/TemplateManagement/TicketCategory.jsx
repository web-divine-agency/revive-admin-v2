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
  const { setLoading } = useLoader();

  useEffect(() => {
    // success login swal
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
        //console.log(ticketTypes);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }finally{
        setLoading(false);
      }
    };
    fetchTicketTypes();
  }, []);

  useEffect(() => {
   
    const applyFilters = () => {
      if (search) {
        tempUsers = tempUsers.filter((user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }

    
    };

    applyFilters();
  }, [search]);

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
       
        
      />
      <label className="mr-2">Other Fragrances</label>
      <input
        type="checkbox"
        
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
