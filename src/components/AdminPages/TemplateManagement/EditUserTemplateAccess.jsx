import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance";
import { useParams, useNavigate } from 'react-router-dom';
import "../../../App.css";
import check from "../../../assets/images/check.png";
import Swal from "sweetalert2";
import { FiArrowLeft } from "react-icons/fi";


function EditUserTemplateAccess() {
    const { userId } = useParams();
    const [ticketTypes, setTicketTypes] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState({});
    const [selectedTicketIds, setSelectedTicketIds] = useState([]); // Store selected ticket type IDs
    const navigate = useNavigate(); // Store selected ticket types

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await axiosInstance.get('/ticketTypes');
                setTicketTypes(response.data);  // Store the ticket type data
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };
    
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await axiosInstance.get(`/user/${userId}`);
                    const userData = response.data;
                    const assignedTicketIds = userData?.ticketTypes?.map(ticketType => ticketType.id);  // Assuming userData.ticketTypes contains the user's assigned tickets
                    setSelectedTicketIds(assignedTicketIds);  
                    //console.log(userData);// Set selected tickets to the ones assigned to the user
                } catch (error) {
                    console.error("Error fetching user data:", error.response ? error.response.data : error.message);
                }
            }
        };
    
        fetchUserData();
        fetchTicketTypes();
    }, [userId]);
    

    const handleTicketChange = (e) => {
        const ticketId = parseInt(e.target.value); // Get ticket ID from checkbox value
        setSelectedTicketIds((prevSelected) => 
            prevSelected.includes(ticketId)
                ? prevSelected.filter(id => id !== ticketId) // Remove if already selected
                : [...prevSelected, ticketId] // Add if not selected
        );
    };

    const assignTickets = async (e) => {
        e.preventDefault();  // Prevent default form submission
        try {
            const response = await axiosInstance.post(`/assign-tickets/${userId}`, {
                ticket_type_ids: selectedTicketIds  // Send selected ticket IDs to the backend
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
                navigate("/template-management");
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
        <div className="container">
            <h3>
            <a href="/template-management" className="back-btn">
          <FiArrowLeft /> Back <br />
        </a>
                
                Edit User's Template Access</h3>
            <div className="container-content">
                <form onSubmit={assignTickets}>
                    <div className="form-group ml-5 mt-5">
                        <label>Uncheck Templates to hide</label> <br />
                        <div className="checkbox-container">
                            {ticketTypes.map(ticket => (
                                <div className="d-flex flex-column align-items-start" key={ticket.id}>
                                    <label className="mb-3">
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            value={ticket.id}  // Use ticket ID as value
                                            checked={selectedTicketIds.includes(ticket.id)}  // Check if selected
                                            onChange={handleTicketChange}
                                        />
                                        {ticket.ticket_type} {/* Display the ticket type name */}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="submit-btn mb-4 mt-4" type="submit">
                        SAVE
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditUserTemplateAccess;
