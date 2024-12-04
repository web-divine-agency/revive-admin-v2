import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "font-awesome/css/font-awesome.min.css";
import check from "../../../assets/images/check.png";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance.js";
import { useLoader } from "../../Loaders/LoaderContext";
import { Helmet } from "react-helmet";
import NavTopbar from "../../Navigation/nav-topbar/NavTopbar";
import NavSidebar from "../../Navigation/nav-sidebar/NavSidebar";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";

import "./TicketCategory.scss";

function TicketCategory() {
  const navigate = useNavigate();

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
          categories: ticket_type.categories.map((category) => ({
            id: category.id,
            name: category.category_name,
          })),
        }));
        setTicketTypes(formattedData);

        const initialCategories = formattedData.reduce((acc, ticket) => {
          acc[ticket.id] = ticket.categories.map((c) => c.id); // Store only category ids
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
        <Box sx={{ display: "flex" }}>
          {categories.map((category) => {
            const checkboxId = `cbx-${row.id}-${category.id}`; // Unique ID for each checkbox
            return (
              <Box key={category.id}>
                <Box
                  component={"input"}
                  id={checkboxId} // Assign unique ID here
                  className="inp-cbx"
                  type="checkbox"
                  checked={selectedCategories[row.id]?.includes(category.id)} // Pre-check if assigned
                  onChange={() => handleCheckboxChange(row.id, category.id)} // Handle checkbox toggle
                  sx={{ mr: 1 }}
                />
                <Box component={"label"} htmlFor={checkboxId} sx={{ mr: 2 }}>
                  <span>{category.category_name}</span>
                </Box>
              </Box>
            );
          })}
        </Box>
      ),
      sortable: false,
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>Tickets | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="tickets-category" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Tickets
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Generate Tickets
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DataTable
                  className="dataTables_wrapper"
                  columns={columns}
                  data={ticketTypes}
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" onClick={handleSave}>
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}

export default TicketCategory;
