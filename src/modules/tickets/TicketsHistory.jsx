import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./Tickets.scss";

import Global from "@/util/global";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";

Font.register({
  family: "Arial",
  src: "/fonts/arial/arialbd.ttf",
});

Font.register({
  family: "ArialNormal",
  src: "/fonts/arial/arial.ttf",
});

Font.register({
  family: "ArialItalic",
  src: "/fonts/arial/ariali.ttf",
});

Font.register({
  family: "ArialNarrow",
  src: "/fonts/arial/arialn.ttf",
});

Font.register({
  family: "Aptos",
  src: "/fonts/aptos/Aptos.ttf",
});

Font.register({
  family: "AptosBold",
  src: "/fonts/aptos/Aptos-Bold.ttf",
});

Font.register({
  family: "BarlowCondensed",
  src: "/fonts/barlow/BarlowCondensed-Medium.ttf",
});

function TicketsHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedTicket, setSelectedTicket] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedTicketId, setSelectedTicketId] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const { authUser } = useContext(Global);

  const [ticketDetailsModalOpen, setTicketDetailsModalOpen] = useState(false);
  const [ticketDeleteModalOpen, setTicketDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = () => {
      try {
        const response = {};

        const formattedData = response.data
          .map((tickets) => ({
            id: tickets.id,
            ticketType: tickets.ticketType?.ticket_type,
            data: tickets.data,
            user: `${tickets.user?.first_name} ${tickets.user?.last_name}`,
            sex: tickets?.user?.sex,
            branch_id: tickets.branch?.branch_name,
            role: tickets.user?.roles?.map((r) => r.role_name).join(", "),
            date: new Date(tickets.createdAt),
          }))
          .sort((a, b) => b.date - a.date);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }
    };
    fetchTickets();
  }, [navigate]);

  // Get Branches for filter
  useEffect(() => {
    const fetchBranches = () => {
      try {
        const response = {};
        const formattedData = response.data.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }));
        setBranches(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }
    };
    fetchBranches();
  }, []);

  //get ticket types
  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = {};
        const formattedData = response.data.map((ticket_type) => ({
          id: ticket_type.id,
          ticket_type: ticket_type.ticket_type,
        }));
        setTicketTypes(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
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
        tempTickets = tempTickets.filter(
          (ticket) =>
            ticket.branch_id ===
            branches.find((branch) => branch.id === parseInt(selectedBranchId))
              ?.branch_name
        );
      }

      // Filter by selected ticket type
      if (selectedTicketTypeId) {
        tempTickets = tempTickets.filter(
          (ticket) =>
            ticket.ticketType ===
            ticketTypes.find(
              (type) => type.id === parseInt(selectedTicketTypeId)
            )?.ticket_type
        );
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
  }, [
    selectedBranchId,
    selectedTicketTypeId,
    search,
    data,
    branches,
    ticketTypes,
  ]);

  const styles = StyleSheet.create({
    page: {
      paddingTop: 35,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "content-start",
      marginBottom: 10,
      gap: "15px",
    },
    item: {
      width: "33%",
      // padding: 10,
      textAlign: "center",
    },
  });
  const TicketPDF = ({ selectedTicket }) => (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        orientation={
          selectedTicket.ticketType === 3 ||
          selectedTicket.ticketType === 15 ||
          selectedTicket.ticketType === 16 ||
          selectedTicket.ticketType === 17
            ? "landscape"
            : "portrait"
        }
      >
        {/* Loop through selectedTicket data, grouping every 3 items */}
        {Array.isArray(selectedTicket?.data) &&
          Array.from(
            { length: Math.ceil(selectedTicket.data.length / 3) },
            (_, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  display: "flex",
                  flexDirection:
                    selectedTicket.ticketType === 3 ||
                    selectedTicket.ticketType === 15 ||
                    selectedTicket.ticketType === 16 ||
                    selectedTicket.ticketType === 17
                      ? "column"
                      : "row",
                  justifyContent: "content-start",
                  gap: "15px",
                }}
              >
                {selectedTicket.data
                  .slice(rowIndex * 3, rowIndex * 3 + 3)
                  .map((item, index) => (
                    <View
                      key={index}
                      style={{
                        width:
                          selectedTicket.ticketType === 3 ||
                          selectedTicket.ticketType === 15 ||
                          selectedTicket.ticketType === 16 ||
                          selectedTicket.ticketType === 17
                            ? "100%"
                            : "33%",
                        height:
                          selectedTicket.ticketType === 3 ||
                          selectedTicket.ticketType === 15 ||
                          selectedTicket.ticketType === 16 ||
                          selectedTicket.ticketType === 17
                            ? "550px"
                            : "",
                        textAlign: "center",
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
                              fontFamily: "Arial",
                              textAlign: "center",
                            }}
                          >
                            GREEN FRIDAY SALE
                          </Text>
                          <Text
                            style={{
                              fontSize: "16px",
                              textTransform: "uppercase",
                              fontFamily: "Arial",
                              textAlign: "center",
                              marginTop: "3px",
                            }}
                          >
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "16px",
                              textTransform: "uppercase",
                              fontFamily: "Arial",
                              textAlign: "center",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "9px",
                              textAlign: "center",
                              marginBottom: "116px",
                              fontFamily: "Arial",
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
                              fontSize: "28px",
                              textTransform: "uppercase",
                              fontFamily: "Arial",
                              // fontStretch: "condensed", // Condensed style
                              textAlign: "center",
                            }}
                          >
                            HOT PRICE
                          </Text>
                          <Text
                            style={{
                              fontSize: "22px",
                              paddingBottom: 2,
                              // paddingTop: 2,
                              fontFamily: "Arial",
                            }}
                          >
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "15px",
                              textTransform: "uppercase",
                              fontFamily: "Arial",
                              textAlign: "center",
                            }}
                          >
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "15px",
                              textTransform: "uppercase",
                              fontFamily: "Arial",
                              textAlign: "center",
                            }}
                          >
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>
                          {item.optionType !== "Without RRP" && (
                            <Text
                              style={{
                                fontSize: "10px",
                                fontFamily: "Arial",
                                marginTop: "2px",
                              }}
                            >
                              RRP ${item.rrp} Save ${item.save}
                            </Text>
                          )}
                          {item.offerType === "TEMPORARY REVIVE OFFER" ? (
                            <Text
                              style={{
                                fontSize: "9px",
                                textAlign: "center",
                                fontFamily: "Arial",
                                marginBottom:
                                  item.optionType === "With RRP"
                                    ? "92px"
                                    : "107px",
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
                                fontFamily: "Arial",
                                marginBottom:
                                  item.optionType === "With RRP"
                                    ? "92px"
                                    : "106px",
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
                              fontFamily: "Arial",
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
                              fontFamily: "Arial",
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
                              marginBottom: "3px",
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              marginTop: "5px",
                              fontSize: "15px",
                              fontFamily: "Arial",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                            }}
                          >
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              marginTop: "5px",
                              fontSize: "15px",
                              fontFamily: "Arial",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              // paddingTop: "5px",
                              fontSize: "9px",
                              textAlign: "center",
                              fontFamily: "Arial",
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
                              fontFamily: "Arial",
                              textTransform: "uppercase",
                              marginTop: 10,
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "200px",
                              fontFamily: "Arial",
                              marginTop: "-20px",
                            }}
                          >
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "20px",
                              fontFamily: "Aptos",
                              marginTop: "-10px",
                            }}
                          >
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
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "15px",
                              textTransform: "uppercase",
                              fontFamily: "Aptos",
                              textAlign: "center",
                            }}
                          >
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>

                          {item.offerType !== "TEMPORARY REVIVE OFFER" && (
                            <Text
                              style={{
                                fontSize: "9px",
                                textAlign: "center",
                                fontFamily: "Aptos",
                                marginBottom: "60px",
                                paddingBottom: 44,
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
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
                            {item.price || "Price"}
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
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
                            {item.price || "Price"}
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
                          <Text
                            style={{
                              fontSize: "75px",
                              fontFamily: "BarlowCondensed",
                              marginTop: 10,
                            }}
                          >
                            {item.percentOff}
                            <Text
                              style={{
                                fontSize: "42px",
                                fontFamily: "BarlowCondensed",
                              }}
                            >
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "19px",
                              fontFamily: "Aptos",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                              marginBottom:
                                item.productDesc.length < 16 ? "96px" : "77px",
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "18px",
                              fontFamily: "Aptos",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              // paddingTop: "5px",
                              fontSize: "9px",
                              textAlign: "center",
                              fontFamily: "Aptos",
                              lineHeight: "1px",
                              marginBottom:
                                item.productDesc.length < 17
                                  ? "151px"
                                  : "133px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "11px",
                                fontFamily: "AptosBold",
                                lineHeight: "1px",
                              }}
                            >
                              {" "}
                              REVLON FRAGRANCES
                            </Text>
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
                          <Text
                            style={{
                              fontSize: "45px",
                              fontFamily: "AptosBold",
                            }}
                          >
                            {item.percentOff}
                            <Text
                              style={{
                                fontSize: "45px",
                                fontFamily: "AptosBold",
                              }}
                            >
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "18px",
                              fontFamily: "AptosBold",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                              marginTop: "4px",
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              // paddingTop: "5px",
                              fontSize: "9px",
                              textAlign: "center",
                              fontFamily: "Aptos",
                              lineHeight: "1px",
                              marginBottom:
                                item.productDesc.length < 17
                                  ? "147px"
                                  : "129px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "11px",
                                fontFamily: "AptosBold",
                                lineHeight: "1px",
                              }}
                            >
                              {" "}
                              FROSTBLAND FRAGRANCE TAGS
                            </Text>
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
                            {item.price || "Price"}
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "18px",
                              fontFamily: "AptosBold",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>

                          <Text
                            style={{
                              fontSize: "10px",
                              fontFamily: "AptosBold",
                              marginTop: "10px",
                              textAlign: "center",
                              lineHeight: "1px",
                            }}
                          >
                            RRP ${item.rrp}
                            {"\n"}
                            <Text
                              style={{
                                fontSize: "15px",
                                fontFamily: "AptosBold",
                                marginTop: "2px",
                                lineHeight: "1px",
                              }}
                            >
                              Save ${item.save}{" "}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontSize: "11px",
                              fontFamily: "AptosBold",
                              lineHeight: "1px",
                            }}
                          >
                            {" "}
                            COTY FRAGRANCES
                          </Text>
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "50px",
                              fontFamily: "Arial",
                            }}
                          >
                            {item.price || "Price"}
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
                          <Text
                            style={{
                              fontSize: "200px",
                              fontFamily: "AptosBold",
                              lineHeight: "1px",
                            }}
                          >
                            {item.percentOff}
                            <Text
                              style={{
                                fontSize: "200px",
                                fontFamily: "AptosBold",
                                lineHeight: "1px",
                              }}
                            >
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>

                          <Text
                            style={{
                              fontSize: "20px",
                              fontFamily: "Aptos",
                              marginTop: "10px",
                            }}
                          >
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
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
                            {item.price || "Price"}
                          </Text>

                          <Text
                            style={{ fontSize: "20px", fontFamily: "Aptos" }}
                          >
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
                            {item.productName || "Product Name"}
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
                            {item.productDesc || "Description"}
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
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{ fontSize: "20px", fontFamily: "Aptos" }}
                          >
                            REVIVE OFFER AVAILABLE &nbsp;
                            {item.startDate} - {item.expiry}
                          </Text>
                        </div>
                      )}
                      {selectedTicket.ticketType === 18 && (
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
                              fontSize: "32px",
                              textTransform: "uppercase",
                              fontFamily: "BarlowCondensed",
                              // fontWeight: "600", // Semibold weight
                              // fontStretch: "condensed", // Condensed style
                              textAlign: "center",
                              marginTop: 10,
                            }}
                          >
                            SUPER SAVING
                          </Text>

                          <Text
                            style={{
                              fontSize: "50px",
                              paddingBottom: 2,
                              // paddingTop: 2,
                              fontFamily: "Arial",
                            }}
                          >
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "16px",
                              textTransform: "uppercase",
                              fontFamily: "AptosBold",
                              textAlign: "center",
                            }}
                          >
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "16px",
                              textTransform: "uppercase",
                              fontFamily: "AptosBold",
                              textAlign: "center",
                            }}
                          >
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>

                          {item.valueType !== "I'M CHEAPER THAN" && (
                            <Text
                              style={{
                                fontSize: "15px",
                                textAlign: "center",
                                fontFamily: "Aptos",
                                marginBottom: "90px",
                              }}
                            >
                              {item.valueType} {"\n"}
                              <Text
                                style={{
                                  fontSize: "10px",
                                  textAlign: "center",
                                  fontFamily: "Aptos",
                                }}
                              >
                                ONGOING REVIVE OFFER
                              </Text>
                            </Text>
                          )}

                          {item.valueType === "I'M CHEAPER THAN" && (
                            <Text
                              style={{
                                fontSize: "15px",
                                textAlign: "center",
                                marginBottom: "73px",
                                fontFamily: "Aptos",
                              }}
                            >
                              I&apos;M CHEAPER THAN {"\n"}
                              <Text
                                style={{
                                  fontSize: "15px",
                                  textAlign: "center",
                                  fontFamily: "AptosBold",
                                  textTransform: "uppercase",
                                }}
                              >
                                {" "}
                                {item.productNameValue}
                                {"\n"}
                              </Text>
                              <Text
                                style={{
                                  fontSize: "10px",
                                  textAlign: "center",
                                  fontFamily: "Aptos",
                                }}
                              >
                                ONGOING REVIVE OFFER
                              </Text>
                            </Text>
                          )}
                        </div>
                      )}
                      {selectedTicket.ticketType === 19 && (
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "18px",
                              fontFamily: "AptosBold",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                              marginTop: "4px",
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              // paddingTop: "5px",
                              fontSize: "9px",
                              textAlign: "center",
                              fontFamily: "Aptos",
                              lineHeight: "1px",
                              marginBottom:
                                item.productDesc.length < 17
                                  ? "147px"
                                  : "129px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "11px",
                                fontFamily: "AptosBold",
                                lineHeight: "1px",
                              }}
                            >
                              {" "}
                              COSMAX FRAGRANCES
                            </Text>
                            {"\n"}
                            ONGOING REVIVE OFFER
                          </Text>
                        </div>
                      )}
                      {selectedTicket.ticketType === 20 && (
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
                              fontSize: "32px",
                              textTransform: "uppercase",
                              fontFamily: "BarlowCondensed",
                              // fontWeight: "600", // Semibold weight
                              // fontStretch: "condensed", // Condensed style
                              textAlign: "center",
                              marginTop: 10,
                            }}
                          >
                            VALUE PACK
                          </Text>

                          <Text
                            style={{
                              fontSize: "50px",
                              paddingBottom: 2,
                              // paddingTop: 2,
                              fontFamily: "Arial",
                            }}
                          >
                            {item.price || "Price"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "16px",
                              textTransform: "uppercase",
                              fontFamily: "AptosBold",
                              textAlign: "center",
                            }}
                          >
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "16px",
                              textTransform: "uppercase",
                              fontFamily: "AptosBold",
                              textAlign: "center",
                            }}
                          >
                            {item.productDesc || "Description"}
                            {"\n"}
                          </Text>

                          {item.valueType !== "I'M CHEAPER THAN" && (
                            <Text
                              style={{
                                fontSize: "15px",
                                textAlign: "center",
                                fontFamily: "Aptos",
                                marginBottom: "90px",
                              }}
                            >
                              {item.valueType} {"\n"}
                              <Text
                                style={{
                                  fontSize: "10px",
                                  textAlign: "center",
                                  fontFamily: "Aptos",
                                }}
                              >
                                ONGOING REVIVE OFFER
                              </Text>
                            </Text>
                          )}

                          {item.valueType === "I'M CHEAPER THAN" && (
                            <Text
                              style={{
                                fontSize: "15px",
                                textAlign: "center",
                                marginBottom: "73px",
                              }}
                            >
                              I&apos;M CHEAPER THAN {"\n"}
                              <Text
                                style={{
                                  fontSize: "15px",
                                  textAlign: "center",
                                  fontFamily: "AptosBold",
                                  textTransform: "uppercase",
                                }}
                              >
                                {" "}
                                {item.productNameValue}
                                {"\n"}
                              </Text>
                              <Text
                                style={{
                                  fontSize: "10px",
                                  textAlign: "center",
                                  fontFamily: "Aptos",
                                }}
                              >
                                ONGOING REVIVE OFFER
                              </Text>
                            </Text>
                          )}
                        </div>
                      )}
                      {selectedTicket.ticketType === 21 && (
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "18px",
                              fontFamily: "AptosBold",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                              marginTop: "4px",
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              // paddingTop: "5px",
                              fontSize: "9px",
                              textAlign: "center",
                              fontFamily: "Aptos",
                              lineHeight: "1px",
                              marginBottom:
                                item.productDesc.length < 19
                                  ? "147px"
                                  : "129px",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "11px",
                                fontFamily: "AptosBold",
                                lineHeight: "1px",
                              }}
                            >
                              {" "}
                              DAVKA FRAGRANCES
                            </Text>
                            {"\n"}
                            ONGOING REVIVE OFFER
                          </Text>
                        </div>
                      )}
                      {selectedTicket.ticketType === 22 && (
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
                            {item.productName || "Product Name"}
                            {"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: "18px",
                              fontFamily: "AptosBold",
                              textTransform: "uppercase",
                              textAlign: "center",
                              lineHeight: "1px",
                              marginBottom: "3px",
                            }}
                          >
                            {item.productDesc || "Description"}
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
                              marginTop: "3px",
                            }}
                          >
                            {item.price || "Price"}
                            {"\n"}
                          </Text>

                          <Text
                            style={{
                              fontSize: "10px",
                              fontFamily: "AptosBold",
                              marginTop: "10px",
                              textAlign: "center",
                              lineHeight: "1px",
                            }}
                          >
                            RRP ${item.rrp}
                            {"\n"}
                            <Text
                              style={{
                                fontSize: "15px",
                                fontFamily: "AptosBold",
                                marginTop: "2px",
                                lineHeight: "1px",
                              }}
                            >
                              Save ${item.save}{" "}
                            </Text>
                          </Text>

                          <Text
                            style={{
                              fontSize: "11px",
                              fontFamily: "Aptos",
                              lineHeight: "1px",
                              paddingTop: "2px",
                            }}
                          >
                            {" "}
                            REVIVE OFFER AVAILABLE
                          </Text>
                          <Text
                            style={{
                              paddingTop: "2px",
                              fontSize: "9px",
                              textAlign: "center",
                              fontFamily: "Aptos",
                              lineHeight: "1px",
                              marginBottom: "109px",
                            }}
                          >
                            {item.startDate} - {item.expiry}
                          </Text>
                        </div>
                      )}
                      {/* END */}
                    </View>
                  ))}
              </View>
            )
          )}
      </Page>
    </Document>
  );

  const handleDeleteTicket = async () => {
    try {
      console.log("Delete");
    } catch (error) {
      console.error(error);
    }

    const updatedData = data.filter(
      (tickets) => tickets.id !== selectedTicketId
    );

    setTicketDeleteModalOpen(false);
    setData(updatedData);
    setFilteredTickets(updatedData);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Tickets | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="tickets-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Tickets
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  component={Link}
                  to="/tickets/create"
                  variant="contained"
                  className="mui-btn mui-btn-create"
                >
                  Generate Tickets
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <div className="top-filter">
                  <select
                    // className="mr-4"
                    name="filter"
                    className="filter"
                    value={selectedBranchId}
                    onChange={handleBranchSelect}
                  >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="filter"
                    className="filter"
                    value={selectedTicketTypeId}
                    onChange={handleTicketTypeSelect}
                  >
                    <option value="">Filter by Ticket Type</option>
                    {ticketTypes.map((ticketType) => (
                      <option key={ticketType.id} value={ticketType.id}>
                        {ticketType.ticket_type}
                      </option>
                    ))}
                  </select>

                  <input
                    className="search-bar"
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid size={{ xs: 12 }}></Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Modal
        open={ticketDetailsModalOpen}
        onClose={() => setTicketDetailsModalOpen(false)}
        className="ticket-details-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-lg">
          <Box className="modal-header">
            <Typography>Ticket Details</Typography>
          </Box>
          <Box className="modal-body">
            {selectedTicket && (
              <PDFViewer showToolbar={true} width="100%" height="600">
                <TicketPDF selectedTicket={selectedTicket} />
              </PDFViewer>
            )}
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="grey"
              onClick={() => setTicketDetailsModalOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
      <Modal
        open={ticketDeleteModalOpen}
        onClose={() => setTicketDeleteModalOpen(false)}
        className="branch-delete-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-sm">
          <Box className="modal-header">
            <Typography>Delete Branch</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="are-you-sure">Are you sure?</Typography>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setTicketDeleteModalOpen(false)}
              className="mui-btn mui-btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={() => handleDeleteTicket()}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}

export default TicketsHistory;
