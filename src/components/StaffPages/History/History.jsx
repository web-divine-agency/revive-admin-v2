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
      paddingLeft: 10,
      paddingRight: 10,

    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'content-start',
      marginBottom: 10,
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
        orientation={selectedTicket.ticketType === 3 || selectedTicket.ticketType === 15 || selectedTicket.ticketType === 16 || selectedTicket.ticketType === 17 ? "landscape" : "portrait"}
      >
        {/* Loop through selectedTicket data, grouping every 3 items */}
        {Array.from({ length: Math.ceil(selectedTicket.data.length / 3) }, (_, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              display: 'flex',
              flexDirection: selectedTicket.ticketType === 3 || selectedTicket.ticketType === 15 || selectedTicket.ticketType === 16 || selectedTicket.ticketType === 17 ? 'column' : 'row',
              justifyContent: 'content-start',
              gap: "15px",
            }}
          >
            {selectedTicket.data.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, index) => (
              <View
                key={index}
                style={{
                  width: selectedTicket.ticketType === 3 || selectedTicket.ticketType === 15 || selectedTicket.ticketType === 16 || selectedTicket.ticketType === 17 ? '100%' : '33%',
                  height: selectedTicket.ticketType === 3 || selectedTicket.ticketType === 15 || selectedTicket.ticketType === 16 || selectedTicket.ticketType === 17 ? '550px' : '',
                  textAlign: 'center',
                }}
              >
                {selectedTicket.ticketType === 5 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "24px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        textAlign: "center",
                      }}
                    >
                      GREEN FRIDAY SALE
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: "9px",
                        textAlign: "center",
                        marginBottom: "116px",
                        fontFamily: "Aptos",
                      }}
                    >
                      REVIVE OFFER AVAILABLE {"\n"}
                      {item.startDate} - {item.expiry}

                    </Text>
                  </div>
                )}

                {/* HOT PRICE TAGS */}
                {selectedTicket.ticketType === 1 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "48px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",

                      }}
                    >
                      HOT PRICE
                    </Text>
                    <Text
                      style={{
                        fontSize: "48px",
                        paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                      RRP ${item.rrp}  Save ${item.save}
                    </Text>
                    {item.offerType === "TEMPORARY REVIVE OFFER" ? (
                      <Text
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          fontFamily: "Aptos",
                          marginBottom: "92px",
                        }}
                      >
                        REVIVE OFFER &nbsp;
                        {item.startDate} - {item.expiry}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          fontFamily: "Aptos",
                          marginBottom: "92px",
                        }}
                      >
                        {item.offerType}
                      </Text>
                    )}

                  </div>
                )}
                {/* CATALOGUE SPECIALS TAGS */}
                {selectedTicket.ticketType === 2 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "24px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        textAlign: "center",
                        marginTop: 10,
                        lineHeight: "1px",
                      }}
                    >
                      CATALOGUE
                    </Text>
                    <Text
                      style={{
                        fontSize: "26px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        textAlign: "center",
                        // marginTop: isPDFView ? 10 : 0,
                        lineHeight: "1px",

                      }}
                    >
                      SPECIAL PRICE
                    </Text>

                    <Text
                      style={{
                        fontSize: "50px",
                        fontFamily: "Arial",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.price}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        marginTop: "5px",
                        fontSize: "15px",
                        fontFamily: "Aptos",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",

                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        marginTop: "5px",
                        fontSize: "15px",
                        fontFamily: "Aptos",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        // paddingTop: "5px",
                        fontSize: "9px",
                        textAlign: "center",
                        fontFamily: "Aptos",
                        lineHeight: "1px",
                        marginBottom: "85px",
                        paddingBottom: 8,
                      }}
                    >
                      REVIVE OFFER &nbsp;
                      {item.startDate} - {item.expiry}
                    </Text>
                  </div>
                )}
                {selectedTicket.ticketType === 3 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >


                    <Text
                      style={{
                        fontSize: "72px",
                        fontFamily: "BarlowCondensed",
                        textTransform: "uppercase",
                        marginTop: 10
                      }}
                    >
                      {item.productBrand}
                    </Text>
                    <Text
                      style={{
                        fontSize: "45px",
                        fontFamily: "BarlowCondensed",
                        textAlign: "center",
                        textTransform: "uppercase",
                        lineHeight: "1px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text style={{ fontSize: "200px", fontFamily: "Arial", marginTop: "-20px" }}>
                      {item.price}
                    </Text>
                    <Text style={{ fontSize: "20px", fontFamily: "Aptos", marginTop: "-10px" }}>
                      REVIVE OFFER &nbsp;
                      {item.startDate} - {item.expiry}
                    </Text>
                    {/* <Image
                     src={revive_logo_white}
                     style={{
                       width: 180,
                       height: "auto",
                       position: "absolute",
                      top: "105%",
                      right: "56%",
                     }}
                   /> */}
                  </div>
                )}
                {selectedTicket.ticketType === 4 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "48px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",

                      }}
                    >
                      HOT PRICE
                    </Text>

                    <Text
                      style={{
                        fontSize: "50px",
                        paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>

                    {item.offerType !== "TEMPORARY REVIVE OFFER" && (
                      <Text
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          fontFamily: "Aptos",
                          marginBottom: "60px",
                          paddingBottom: 44
                        }}
                      >
                        {item.offerType}
                      </Text>
                    )}

                    {item.offerType === "TEMPORARY REVIVE OFFER" && (
                      <Text
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          marginBottom: "60px",
                          fontFamily: "Aptos",
                          paddingBottom: 44,
                        }}
                      >
                        REVIVE OFFER &nbsp;
                        {item.startDate} - {item.expiry}

                      </Text>
                    )}

                  </div>
                )}
                {selectedTicket.ticketType === 6 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "43px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      MUST TRY
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        // paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: "17px",
                        textAlign: "center",
                        marginBottom: "88px",
                        fontFamily: "Aptos",

                      }}
                    >
                      {item.reviveOffer}
                    </Text>

                  </div>
                )}
                {selectedTicket.ticketType === 7 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "33px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      NEW IN STORE
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        // paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>

                    <Text
                      style={{
                        fontSize: "19px",
                        textAlign: "center",
                        marginBottom: "98px",
                        fontFamily: "Aptos",
                      }}
                    >
                      {item.tryMe}
                    </Text>
                  </div>
                )}
                {selectedTicket.ticketType === 8 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >


                    <Text style={{ fontSize: "75px", fontFamily: "BarlowCondensed", marginTop: 10, }}>
                      {item.percentOff}
                      <Text style={{ fontSize: "42px", fontFamily: "BarlowCondensed" }}>
                        OFF
                      </Text>
                    </Text>
                    <Text
                      style={{
                        marginTop: "5px",
                        fontSize: "19px",
                        fontFamily: "Aptos",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",

                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "19px",
                        fontFamily: "Aptos",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        paddingTop: "5px",
                        fontSize: "9px",
                        textAlign: "center",
                        fontFamily: "Aptos",
                        lineHeight: "1px",
                        marginTop: "3px",
                        marginBottom: item.productDesc.length < 16 ? "96px" : "77px",

                      }}
                    >
                      REVIVE OFFER AVAILABLE {"\n"}
                      {item.startDate} - {item.expiry}
                    </Text>

                  </div>
                )}
                {selectedTicket.ticketType === 9 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginTop: "5px",
                        fontSize: "18px",
                        fontFamily: "Aptos",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",

                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "18px",
                        fontFamily: "Aptos",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        fontFamily: "Arial",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.price}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        // paddingTop: "5px",
                        fontSize: "9px",
                        textAlign: "center",
                        fontFamily: "Aptos",
                        lineHeight: "1px",
                        marginBottom: item.productDesc.length < 17 ? "151px" : "133px",


                      }}
                    >
                      <Text style={{ fontSize: "11px", fontFamily: "AptosBold", lineHeight: "1px", }}> REVLON FRAGRANCES</Text>
                      {"\n"}
                      ONGOING REVIVE OFFER
                    </Text>

                  </div>
                )}
                {selectedTicket.ticketType === 10 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "24px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      GREEN FRIDAY SALE
                    </Text>
                    <Text style={{ fontSize: "45px", fontFamily: "AptosBold" }}>
                      {item.percentOff}
                      <Text style={{ fontSize: "45px", fontFamily: "AptosBold" }}>
                        OFF
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>


                    <Text
                      style={{
                        fontSize: "9px",
                        textAlign: "center",
                        marginBottom: "111px",
                        fontFamily: "Aptos",
                      }}
                    >
                      REVIVE OFFER AVAILABLE {"\n"}
                      {item.expiry}

                    </Text>
                  </div>
                )}
                {selectedTicket.ticketType === 11 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >


                    <Text
                      style={{
                        marginTop: "5px",
                        fontSize: "18px",
                        fontFamily: "AptosBold",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",

                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "18px",
                        fontFamily: "AptosBold",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        fontFamily: "Arial",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px",
                        marginTop: "4px"
                      }}
                    >
                      {item.price}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        // paddingTop: "5px",
                        fontSize: "9px",
                        textAlign: "center",
                        fontFamily: "Aptos",
                        lineHeight: "1px",
                        marginBottom: item.productDesc.length < 17 ? "147px" : "129px",
                      }}
                    >
                      <Text style={{ fontSize: "11px", fontFamily: "AptosBold", lineHeight: "1px", }}> FROSTBLAND FRAGRANCE TAGS</Text>
                      {"\n"}
                      ONGOING REVIVE OFFER
                    </Text>

                  </div>
                )}

                {selectedTicket.ticketType === 12 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "27px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      DESIGN BRAND {"\n"} FRAGRANCE
                    </Text>

                    <Text
                      style={{
                        fontSize: "50px",
                        // paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: "13px",
                        textTransform: "uppercase",
                        fontFamily: "AptosBold",
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      TOTAL BEAUTY NETWORK {"\n"} FRAGRANCES
                    </Text>
                    <Text
                      style={{
                        fontSize: "9px",
                        textAlign: "center",
                        marginBottom: "85px",
                        fontFamily: "Aptos",
                        marginTop: "5px",
                      }}
                    >
                      ONGOING REVIVE OFFER


                    </Text>
                  </div>
                )}
                {selectedTicket.ticketType === 13 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >


                    <Text
                      style={{
                        marginTop: "5px",
                        fontSize: "18px",
                        fontFamily: "AptosBold",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",

                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "18px",
                        fontFamily: "AptosBold",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        fontFamily: "Arial",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginBottom: "3px"
                      }}
                    >
                      {item.price}
                      {"\n"}
                    </Text>

                    <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "10px", textAlign: "center", lineHeight: "1px", }}>
                      RRP ${item.rrp}{"\n"}<Text style={{ fontSize: "15px", fontFamily: "AptosBold", marginTop: "2px", lineHeight: "1px", }}>Save ${item.save} </Text>
                    </Text>
                    <Text style={{ fontSize: "11px", fontFamily: "AptosBold", lineHeight: "1px", }}> COTY FRAGRANCES</Text>
                    <Text
                      style={{
                        paddingTop: "3px",
                        fontSize: "9px",
                        textAlign: "center",
                        fontFamily: "Aptos",
                        lineHeight: "1px",
                        marginBottom: "113px",


                      }}
                    >
                      OFFER ENDS {item.expiry}
                    </Text>

                  </div>
                )}
                {selectedTicket.ticketType === 14 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      CLEARANCE
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "50px",
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>

                    <Text
                      style={{
                        fontSize: "17px",
                        textAlign: "center",
                        marginBottom: "92px",
                        fontFamily: "Aptos",

                      }}
                    >
                      {item.reviveOffer}
                    </Text>


                  </div>
                )}
                {selectedTicket.ticketType === 15 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text style={{ fontSize: "200px", fontFamily: "AptosBold", lineHeight: "1px", }}>
                      {item.percentOff}
                      <Text style={{ fontSize: "200px", fontFamily: "AptosBold", lineHeight: "1px", }}>
                        OFF
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        lineHeight: "1px",
                        marginTop: "10px",

                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        lineHeight: "1px",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>

                    <Text style={{ fontSize: "20px", fontFamily: "Aptos", marginTop: "10px" }}>
                      REVIVE OFFER AVAILABLE &nbsp;
                      {item.startDate} - {item.expiry}
                    </Text>

                  </div>
                )}
                {selectedTicket.ticketType === 16 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{

                        fontSize: "100px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      NEW IN STORE
                    </Text>
                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        lineHeight: "1px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        lineHeight: "1px",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "170px",
                        // paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>

                    <Text style={{ fontSize: "20px", fontFamily: "Aptos" }}>
                      REVIVE OFFER AVAILABLE &nbsp;
                      {item.startDate} - {item.expiry}
                    </Text>


                  </div>
                )}
                {selectedTicket.ticketType === 17 && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >

                    <Text
                      style={{

                        fontSize: "120px",
                        textTransform: "uppercase",
                        fontFamily: "BarlowCondensed",
                        // fontWeight: "600", // Semibold weight
                        // fontStretch: "condensed", // Condensed style
                        textAlign: "center",
                      }}
                    >
                      CLEARANCE
                    </Text>
                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        lineHeight: "1px",
                      }}
                    >
                      {item.productName}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Aptos",
                        textAlign: "center",
                        lineHeight: "1px",
                      }}
                    >
                      {item.productDesc}
                      {"\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "170px",
                        // paddingBottom: 2,
                        // paddingTop: 2,
                        fontFamily: "Arial",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Text style={{ fontSize: "20px", fontFamily: "Aptos" }}>
                      REVIVE OFFER AVAILABLE &nbsp;
                      {item.startDate} - {item.expiry}
                    </Text>


                  </div>

                )}
                {/* END */}
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
