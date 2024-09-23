import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import man from '../../../assets/images/man.png';
import woman from '../../../assets/images/woman.png';
import { useNavigate } from "react-router-dom";
import view_icon from "../../../assets/images/view_icon.png";
import axiosInstance from '../../../../axiosInstance';
import { format } from 'date-fns';
import { Modal, Button } from "react-bootstrap";
import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';

function TicketsHistory() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
          pdf_path: tickets.pdf_path,
          date: new Date(tickets.createdAt)
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, [navigate]);

  useEffect(() => {
    const applyFilters = () => {
      let tempTickets = [...data];

      if (filter) {
        tempTickets = tempTickets.filter((tickets) => tickets.role === filter);
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
      const response = await axiosInstance.get(`/ticket/${id}`);
      const ticket = response.data;
      const formattedTicketData = {
        id: ticket.id,
        ticketType: ticket.ticket_type_id,
        data: ticket.data,
        date: new Date(ticket.createdAt)
      };
      setSelectedTicket(formattedTicketData);
      console.log(formattedTicketData);
      // console.log(ticket);
      setShowModal(true);
    } catch (error) {
      console.error('Error viewing ticket:', error);
    }
  };

  const TicketPDF = ({ ticketData }) => (
    <Document>
      <Page size="A4" style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Array.from({ length: ticketData.data.copies }, (_, index) => (
            <View key={index} style={{ width: '30%', margin: 5 }}>
              <Text><strong>Product Name:</strong> {ticketData.data.productName}</Text>
              <Text><strong>Price:</strong> ${ticketData.data.price}</Text>
              <Text><strong>RRP:</strong> RRP ${ticketData.data.rrp}</Text>
              <Text><strong>Save:</strong> Save ${ticketData.data.save}</Text>
              <Text><strong>Expiry:</strong> {ticketData.data.expiry}</Text>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
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
      selector: (row) => format(row.date, 'MMM dd, yyyy hh:mm a'),
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
            onClick={() => handleViewTicketClick(row.id)}
            style={{ cursor: "pointer" }}
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
          <h3>Tickets History List</h3>
          <div className='top-filter'>
            <select name="filter" id="filter" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Users</option>
              <option value="Staff">Staff</option>
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

      {/* Modal for viewing ticket details */}
      {selectedTicket && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ticket Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Date Created:</strong> {format(selectedTicket.date, 'MMM dd, yyyy hh:mm a')}</p>
            <PDFViewer
              showToolbar={false}
              style={{ width: "100%", height: "705px" }}
            >
              <TicketPDF ticketData={selectedTicket} />
            </PDFViewer>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}

export default TicketsHistory;
