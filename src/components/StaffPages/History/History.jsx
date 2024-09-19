import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import man from '../../../assets/images/man.png';
import woman from '../../../assets/images/woman.png';
import { useNavigate } from "react-router-dom";
import view_icon from "../../../assets/images/view_icon.png";
//import printer from '../../../assets/images/printer.png';
import delete_icon from "../../../assets/images/delete_icon.png";
import check from "../../../assets/images/check.png";
import axiosInstance from '../../../../axiosInstance';
import {format} from 'date-fns';
import { Modal } from "react-bootstrap";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Swal from 'sweetalert2'

function TicketsHistory() {
  const navigate = useNavigate();
  const[data, setData] = useState([]);
  const[filter, setFilter ] = useState('');
  const[search, setSearch] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/tickets'); 
        const formattedData = response.data.map(tickets => ({
          id: tickets.id,
          ticketType: tickets.ticketType.ticket_type,
          data: tickets.data, 
          user: `${tickets.user.first_name} ${tickets.user.last_name}`,
          branch_id: tickets.branch.branch_name,
          role: tickets.user.roles?.map((r) => r.role_name).join(", "),
          date: new Date(tickets.createdAt)
        }));
        setData(formattedData); 
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchTickets(); 
  }, [navigate]);
 
  useEffect(() => {
    // Filter users whenever the filter or search state changes
    const applyFilters = () => {
      let tempTickets = [...data];

      if (filter) {
        tempTickets = tempTickets.filter((tickets) => {
          return tickets.role === filter;
        });
      }

      if (search) {
        tempTickets = tempTickets.filter((tickets) =>
          tickets.user.toLowerCase().includes(search.toLowerCase())
        );
      }
  

      setFilteredTickets(tempTickets);
    };

    applyFilters();
  }, [filter, search, data]);

  const handleViewTicketClick = async (id) => {
    try {
      const response = await axiosInstance.get(`/ticket/${id}/view-pdf`, {
        responseType: 'blob', // Important to receive the file as a Blob
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, `ticket_${id}.pdf`);
      
      // If you want to preview the PDF directly, you can render it in a modal or a new window:
      const fileURL = URL.createObjectURL(pdfBlob);
      window.open(fileURL);
    } catch (error) {
      console.error('Error viewing the ticket PDF:', error);
    }
  };

 {/*} const handleDeleteTicketClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this? This action can’t be undone",
      showCancelButton: true,
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#00000000",
      cancelTextColor: "#000000",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: "custom-container",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-swal-title",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-ticket/${id}`);
          const updatedData = data.filter((tickets) => tickets.id !== id);
          setData(updatedData);
          setFilteredTickets(updatedData); 
          Swal.fire({
            title: "Success!",
            text: "Ticket has been deleted.",
            imageUrl: check,
            imageWidth: 100,  
            imageHeight: 100, 
            confirmButtonText: "OK",
            confirmButtonColor: "#0ABAA6",
            customClass: {
              confirmButton: "custom-success-confirm-button",
              title: "custom-swal-title",
            },
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the ticket.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#EC221F",
            customClass: {
              confirmButton: "custom-error-confirm-button",
              title: "custom-swal-title",
            },
          });
        }
      }
    });
    */
  };

  const columns = [
    {
      name: "User",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className='profile-image'
            src={row.sex === 'Male' ? man : woman}
            alt={row.name}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              marginRight: '10px'
            }}
          />
          {row.user}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => format(row.date, 'MMM dd, yyyy hh:mm a'), // Format using date-fns
      sortable: true
    },
    {
      name: "Branch",
      selector: (row) => row.branch_id,
      sortable: true
    },
   
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true
    },
    {
      name: "Ticket Type",
      selector: (row) => row.ticketType,
      sortable: true
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <img
            src={view_icon}
            title="View Ticket Details"
            alt="view"
            width="25"
            height="25"
            onClick ={() => handleViewTicketClick(row.id)}
            style={{ cursor: "pointer" }}
          />
          {/*<img
            className="ml-3"
            src={delete_icon}
            title="Delete Ticket"
            alt="delete"
            width="25"
            height="25"
            onClick={() => handleDeleteTicketClick(row.id)}
            style={{ cursor: "pointer" }}
      />*/}
        </div>
      ),
      sortable: false,
    },
 
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Tickets History List</h3>
          <div className='top-filter'>
          <select name="filter" id="filter" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Users</option>
              <option value="Staff">Staffs</option>
              <option value="Admin">Admins</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' value={search} onChange={e => setSearch(e.target.value)} />
           
          </div>
          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={filteredTickets}
              pagination
              paginationPerPage={10} 
              paginationRowsPerPageOptions={[10, 20]} 
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default TicketsHistory;
