import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "./TicketCategory.scss";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

function TicketCategory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [ticketTypes, setTicketTypes] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedCategories, setSelectedCategories] = useState({}); // State to track selected categories

  useEffect(() => {
    if (localStorage.getItem("loginSuccess") === "true") {
      localStorage.removeItem("loginSuccess");
    }
  }, []);

  useEffect(() => {
    const fetchCategories = () => {
      try {
        const categoryResponse = {}; // Fetch all categories
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTicketTypes = () => {
      try {
        const response = {};
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
        // Do nothing
      }
    };

    fetchCategories(); // Fetch categories
    fetchTicketTypes(); // Fetch ticket types with their categories
  }, []);

  const handleSave = async () => {
    try {
      console.log("okay");
    } catch (error) {
      console.error("Error updating ticket categories:", error);
    } finally {
      // Do nothing
    }
  };

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
              <Grid size={{ xs: 12 }}></Grid>
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
