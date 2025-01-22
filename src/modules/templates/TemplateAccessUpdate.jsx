import React, { useState, useEffect } from "react";
import axiosInstance from "@/services/axiosInstance.js";
import { useParams, useNavigate } from "react-router-dom";
import check from "@/assets/images/check.png";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import NavTopbar from "../../components/navigation/NavTopbar";
import NavSidebar from "../../components/navigation/NavSidebar";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export default function TemplateAccessUpdate() {
  const { userId } = useParams();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]); // Store selected ticket type IDs
  const navigate = useNavigate(); // Store selected ticket types

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await axiosInstance.get("/ticketTypes");
        setTicketTypes(response.data); // Store the ticket type data
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(`/user/${userId}`);
          const userData = response.data;
          const assignedTicketIds = userData?.ticketTypes?.map(
            (ticketType) => ticketType.id
          ); // Assuming userData.ticketTypes contains the user's assigned tickets
          setSelectedTicketIds(assignedTicketIds);
          //console.log(userData);// Set selected tickets to the ones assigned to the user
        } catch (error) {
          console.error(
            "Error fetching user data:",
            error.response ? error.response.data : error.message
          );
        }
      }
    };

    fetchUserData();
    fetchTicketTypes();
  }, [userId]);

  const handleTicketChange = (e) => {
    const ticketId = parseInt(e.target.value); // Get ticket ID from checkbox value
    setSelectedTicketIds(
      (prevSelected) =>
        prevSelected.includes(ticketId)
          ? prevSelected.filter((id) => id !== ticketId) // Remove if already selected
          : [...prevSelected, ticketId] // Add if not selected
    );
  };

  const assignTickets = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axiosInstance.post(`/assign-tickets/${userId}`, {
        ticket_type_ids: selectedTicketIds, // Send selected ticket IDs to the backend
      });

      Swal.fire({
        title: "Ticket Template Assigned Successfully",
        text: `The user has been updated.`,
        imageUrl: check,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      }).then(() => {
        // Redirect to template management page after success
        navigate("/templates");
      });
    } catch (error) {
      console.error("Failed to assign ticket templates:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to assign ticket templates. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Template Access | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="tickets-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Template Access Update
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Template Access
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <form onSubmit={assignTickets}>
                  <div className="form-group">
                    <label>Uncheck Templates to hide</label> <br />
                    <div className="checkbox-container">
                      {ticketTypes.map((ticket) => {
                        const checkboxId = `cbx-ticket-${ticket.id}`; // Unique ID for each ticket checkbox
                        return (
                          <div
                            className="d-flex flex-column align-items-start"
                            key={ticket.id}
                          >
                            <div className="checkbox-wrapper-46">
                              <input
                                id={checkboxId} // Assign unique ID here
                                className="inp-cbx"
                                type="checkbox"
                                value={ticket.id} // Use ticket ID as value
                                checked={selectedTicketIds.includes(ticket.id)} // Check if selected
                                onChange={handleTicketChange}
                              />
                              <label htmlFor={checkboxId} className="cbx">
                                {" "}
                                {/* Label points to unique ID */}
                                <span>
                                  <svg
                                    viewBox="0 0 12 10"
                                    height="10px"
                                    width="12px"
                                  >
                                    <polyline points="1.5 6 4.5 9 10.5 1" />
                                  </svg>
                                </span>
                                <span>{ticket.ticket_type}</span>{" "}
                                {/* Display the ticket type name */}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
