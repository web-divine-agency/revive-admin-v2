import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance";
import "../../../App.css";

function EditUserTemplateAccess() {
    const [ticketTypes, setTicketTypes] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState({}); // Store selected ticket types

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await axiosInstance.get('/ticketTypes');
                const formattedData = response.data.reduce((acc, ticket_type) => {
                    acc[ticket_type.ticket_type] = false; // Initialize all tickets as unchecked
                    return acc;
                }, {});
                setTicketTypes(response.data); // Store the raw ticket type data if needed
                setSelectedTickets(formattedData); // Set initial state for checkboxes
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };
        fetchTicketTypes();
    }, []);

    const handleTicketChange = (e) => {
        const { name, checked } = e.target;
        setSelectedTickets(prev => ({ ...prev, [name]: !prev [name] })); // Update selected tickets state
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here, e.g., send the selected tickets to the API
        console.log("Selected Tickets:", selectedTickets);
    };

    return (
        <div className="container">
            <h3>Edit User's Template Access</h3>
            <div className="container-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group ml-5 mt-5">
                        <label>Uncheck Templates to hide</label> <br />
                        <div className="checkbox-container">
                            {ticketTypes.map(ticket => (
                                <div className="d-flex flex-column align-items-start" key={ticket.id}>
                                    <label className="mb-3">
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            name={ticket.ticket_type}
                                            checked={selectedTickets[ticket.ticket_type] || false}
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
