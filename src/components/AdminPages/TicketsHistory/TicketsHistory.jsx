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
import { format } from 'date-fns';
import { Modal, Button } from "react-bootstrap";
import { Document, Page, Text, View, PDFViewer, StyleSheet, Font } from '@react-pdf/renderer';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Swal from 'sweetalert2';
import ArialBold from "../../StaffPages/GenerateTickets/fonts/arialbd.ttf";
import ArialNarrow from "../../StaffPages/GenerateTickets/fonts/arialn.ttf";
import ArialNormal from "../../StaffPages/GenerateTickets/fonts/arial.ttf";
import ArialItalic from "../../StaffPages/GenerateTickets/fonts/ariali.ttf";
import BarlowCondensed from "../../StaffPages/GenerateTickets/fonts/barlow/BarlowCondensed-Medium.ttf";
import Aptos from "../../StaffPages/GenerateTickets/fonts/aptos/Microsoft Aptos Fonts/Aptos.ttf";
import AptosBold from "../../StaffPages/GenerateTickets/fonts/aptos/Microsoft Aptos Fonts/Aptos-Bold.ttf";




Font.register({
  family: "Arial",
  src: ArialBold,
});
Font.register({
  family: "ArialNormal",
  src: ArialNormal,
});
Font.register({
  family: "ArialItalic",
  src: ArialItalic,
});
Font.register({
  family: "ArialNarrow",
  src: ArialNarrow,
});
Font.register({
  family: "Aptos",
  src: Aptos,
});
Font.register({
  family: "AptosBold",
  src: AptosBold,
});
Font.register({
  family: "Barlow",
  src: BarlowCondensed,
});
function TicketsHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

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
        })).sort((a, b) => b.date - a.date);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchTickets();
  }, [navigate]);

  // Get Branches for filter
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        const formattedData = response.data.map(branch => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }));
        setBranches(formattedData);
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchBranches();
  }, []);

  //get ticket types
  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await axiosInstance.get('/ticketTypes');
        const formattedData = response.data.map(ticket_type => ({
          id: ticket_type.id,
          ticket_type: ticket_type.ticket_type,
        }));
        setTicketTypes(formattedData);
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchTicketTypes();
  }, []);

  const handleBranchSelect = (e) => {
    setSelectedBranchId(e.target.value);
  };
  const handleTicketTypeSelect = (e) => {
    setSelectedTicketTypeId(e.target.value);
  };

  useEffect(() => {
    const applyFilters = () => {
      let tempTickets = [...data];

      // Filter by selected branch
      if (selectedBranchId) {
        tempTickets = tempTickets.filter(ticket => ticket.branch_id === branches.find(branch => branch.id === parseInt(selectedBranchId))?.branch_name);
      }

      // Filter by selected ticket type
      if (selectedTicketTypeId) {
        tempTickets = tempTickets.filter(ticket => ticket.ticketType === ticketTypes.find(type => type.id === parseInt(selectedTicketTypeId))?.ticket_type);
      }

      // Filter by search term (user name)
      if (search) {
        tempTickets = tempTickets.filter((tickets) =>
          tickets.user.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredTickets(tempTickets);
    };

    applyFilters();
  }, [selectedBranchId, selectedTicketTypeId, search, data, branches, ticketTypes]);

  const styles = StyleSheet.create({
    page: {
      paddingTop: 35,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'content-start',
      marginBottom: 10,
      gap: "15px"
    },
    item: {
      width: '33%',
      // padding: 10,
      textAlign: 'center',
    },
  });
  const TicketPDF = ({ selectedTicket }) => (
    <Document>
    <Page
      size='A4'
      style={styles.page}
      orientation={selectedTicket.ticketType === 3 ? "landscape" : "portrait"}
    >
      {/* Loop through selectedTicket data, grouping every 3 items */}
      {Array.from({ length: Math.ceil(selectedTicket.data.length / 3) }, (_, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            display: 'flex',
            flexDirection: selectedTicket.ticketType === 3 ? 'column' : 'row',
            justifyContent: 'content-start',
            marginBottom: 10,
            gap: "15px",
          }}
        >
          {selectedTicket.data.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, index) => (
            <View
              key={index}
              style={{
                width: selectedTicket.ticketType === 3 ? '100%' : '33%',
                height: selectedTicket.ticketType === 3 ? '550px' : '',
                textAlign: 'center',
              }}
            >
              {selectedTicket.ticketType === 3 && (
                <Text
                  style={{
                    fontSize: selectedTicket.ticketType === 3 ? '72px' : '15px',
                    textAlign: "center",
                    fontFamily: selectedTicket.ticketType === 3 ? 'Barlow' : 'Aptos',
                    textTransform: "uppercase",
                  }}
                >
                  {item.productBrand || "Brand"}
                </Text>
              )}
              {selectedTicket.ticketType === 3 && (
                <Text
                  style={{
                    fontSize: "45px",
                    textAlign: "center",
                    fontFamily: "Barlow",
                    textTransform: "uppercase",
                  }}
                >
                  {item.productName || "Product Name"}
                </Text>
              )}
              <Text
                style={{
                  textTransform: "uppercase",
                  fontFamily: "Barlow",
                  textAlign: "center",
                  fontSize: selectedTicket.ticketType === 2 ? "24px" : "48px",
                }}
              >
                {selectedTicket.ticketType !== 3 && (
                  <Text>
                    {selectedTicket.ticketType === 2 ? "Catalogue" : "HOT PRICE"}
                  </Text>
                )}
              </Text>
              <Text
                style={{
                  fontSize: "26px",
                  textTransform: "uppercase",
                  fontFamily: "Barlow",
                  textAlign: "center",
                  lineHeight: "1px",
                }}
              >
                {selectedTicket.ticketType === 2 ? "Special Price" : ""}
              </Text>
              <Text
                style={{
                  fontSize: selectedTicket.ticketType === 3 ? '200px' : '48px',
                  paddingBottom: "2px",
                  marginTop: selectedTicket.ticketType === 3 ? '-20px' : '',
                  fontFamily: "Arial",
                  marginBottom: "3px",
                }}
              >
                {item.price || "Price"}
              </Text>
              {selectedTicket.ticketType !== 3 && (
                <Text
                  style={{
                    fontSize: "15px",
                    textTransform: "uppercase",
                    fontFamily: "Aptos",
                    textAlign: "center",
                  }}
                >
                  {item.productName || "Product Name"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "15px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                  marginBottom: "3px",
                }}
              >
                {item.productDesc || "Product Description"}
              </Text>
  
              {selectedTicket.ticketType !== 2 &&
                selectedTicket.ticketType !== 3 &&
                selectedTicket.ticketType !== 4 && (
                  <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                    RRP: ${item.rrp} Save: ${item.save}
                  </Text>
                )}
  
              {item.offerType !== "ONGOING REVIVE OFFER" ? (
                <Text
                  style={{
                    fontSize: selectedTicket.ticketType === 3 ? "20px" : "9px",
                    textAlign: "center",
                    fontFamily: "Aptos",
                    marginBottom: selectedTicket.ticketType === 4
                      ? "90px"
                      : selectedTicket.ticketType === 2
                      ? "93px"
                      : selectedTicket.ticketType === 1
                      ? "75px"
                      : selectedTicket.ticketType === 3
                      ? "75px"
                      : "",
                    marginTop: selectedTicket.ticketType === 3 ? "-10px" : "",
                  }}
                >
                  REVIVE OFFER {item.startDate} {item.expiry}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                    fontFamily: "Aptos",
                    marginBottom: "70px",
                  }}
                >
                  ONGOING REVIVE OFFER
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
  
  );


  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

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
      // console.log(formattedTicketData);
      // console.log(ticket);
      setShowModal(true);
    } catch (error) {
      console.error('Error viewing ticket:', error);
    }
  };

  const handleDeleteTicketClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      showCancelButton: true,
      icon: 'warning',
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
  };

  const columns = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedTickets(prev =>
              checked ? [...prev, row.id] : prev.filter(id => id !== row.id)
            );
          }}
          checked={selectedTickets.includes(row.id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
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
      sortable: true,
      cell: (row) => (
        <div>
          {row.ticketType}
        </div>
      ),
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
          <img
            className="ml-3"
            src={delete_icon}
            title="Delete Ticket"
            alt="delete"
            width="25"
            height="25"
            onClick={() => handleDeleteTicketClick(row.id)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
      sortable: false,
    },

  ];

  const handleMassDelete = async () => {
    if (selectedTickets.length === 0) return;
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to revert this!.",
        showCancelButton: true,
        icon: 'warning',
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
      });

      if (result.isConfirmed) {
        await axiosInstance.post('/mass-delete-tickets', { ids: selectedTickets });
        setData(data.filter(ticket => !selectedTickets.includes(ticket.id)));
        setSelectedTickets([]); // Clear selection
        Swal.fire({
          title: 'Deleted!',
          text: 'Selected tickets have been deleted.',
          imageUrl: check,
          imageWidth: 100,
          imageHeight: 100,
          confirmButtonText: 'OK',
          confirmButtonColor: '#0ABAA6',
        });
      }
    } catch (error) {
      console.error('Error deleting tickets:', error);
      Swal.fire('Error!', 'Failed to delete the selected tickets.', 'error');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Tickets History List</h3>
          <div className='top-filter'>
            <select className="mr-4" name="filter" id="filter" value={selectedBranchId} onChange={handleBranchSelect}>
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>

            <select name="filter" id="filter" value={selectedTicketTypeId} onChange={handleTicketTypeSelect}>
              <option value="">Filter by Ticket Type</option>
              {ticketTypes.map((ticketType) => (
                <option key={ticketType.id} value={ticketType.id}>
                  {ticketType.ticket_type}
                </option>
              ))}
            </select>

            <input id='search-bar' type="text" placeholder='Search' value={search} onChange={e => setSearch(e.target.value)} />

          </div>
          <div className="container-content">
            <button
              className="btn btn-danger m-3"
              onClick={handleMassDelete}
              disabled={selectedTickets.length === 0}
            >
              Delete Selected
            </button>
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

      {selectedTicket && (
        <Modal show={showModal} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Ticket History View</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Text>Date Created: {new Date(selectedTicket.date).toLocaleString()}</Text>
            <PDFViewer showToolbar={true} width="100%" height="600">
              <TicketPDF selectedTicket={selectedTicket} />
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
