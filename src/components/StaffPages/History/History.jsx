import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "font-awesome/css/font-awesome.min.css";
import man from "@/assets/images/man.png";
import woman from "@/assets/images/woman.png";
import { useNavigate } from "react-router-dom";
import view_icon from "@/assets/images/list-view.png";

import axiosInstance from "@/services/axiosInstance.js";
import { Modal, Button } from "react-bootstrap";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import "@react-pdf-viewer/core/lib/styles/index.css";
import { useLoader } from "@/components/loaders/LoaderContext";

Font.register({
  family: "Outfit",
  src: "@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2",
});

Font.register({
  family: "Arial",
  src: "/fonts/arial/arialbd.ttf",
});

Font.register({
  family: "Arial",
  src: "/fonts/arial/arial.ttf",
});

Font.register({
  family: "Arial Italic",
  src: "/fonts/arial/ariali.ttf",
});

Font.register({
  family: "Arial Narrow",
  src: "/fonts/arial/ARIALN.TTF",
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
  family: "Barlow",
  src: "/fonts/barlow/BarlowCondensed-Medium.ttf",
});

function TicketsHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { setLoading } = useLoader();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/tickets");
        const formattedData = response.data
          ?.map((tickets) => ({
            id: tickets.id,
            ticketType: tickets.ticketType?.ticket_type,
            data:
              typeof tickets.data === "string"
                ? JSON.parse(tickets.data)
                : tickets.data,
            user: `${tickets.user?.first_name} ${tickets.user?.last_name}`,
            branch_id: tickets.branch?.branch_name,
            role: tickets.user?.roles?.map((r) => r.role_name).join(", "),
            date: new Date(tickets.createdAt),
          }))
          .sort((a, b) => b.date - a.date);
        setData(formattedData);
        // console.log(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [navigate]);

  // Get Branches for filter
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/branches");
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
        const response = await axiosInstance.get("/ticketTypes");
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
      paddingLeft: 10,
      paddingRight: 10,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "content-start",
      marginBottom: 10,
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
                        <View
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
                              fontFamily: "Aptos",
                            }}
                          >
                            REVIVE OFFER AVAILABLE {"\n"}
                            {item.startDate} - {item.expiry}
                          </Text>
                        </View>
                      )}

                      {/* HOT PRICE TAGS */}
                      {selectedTicket.ticketType === 1 && (
                        <View
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
                          <Text
                            style={{
                              fontSize: "10px",
                              fontFamily: "AptosBold",
                              marginTop: "2px",
                            }}
                          >
                            RRP ${item.rrp} Save ${item.save}
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
                        </View>
                      )}
                      {/* CATALOGUE SPECIALS TAGS */}
                      {selectedTicket.ticketType === 2 && (
                        <View
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
                              marginTop: "5px",
                              fontSize: "15px",
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 3 && (
                        <View
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
                              marginTop: 10,
                            }}
                          >
                            {item.productBrand || "Brand"}
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 4 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 6 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 7 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 8 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 9 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 10 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 11 && (
                        <View
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
                        </View>
                      )}

                      {selectedTicket.ticketType === 12 && (
                        <View
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
                            DESIGNER BRAND {"\n"} FRAGRANCE
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 13 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 14 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 15 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 16 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 17 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 18 && (
                        <View
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
                                {item.productNameValue || "Product Name"}
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 19 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 20 && (
                        <View
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
                                {item.productNameValue || "Product Name"}
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 21 && (
                        <View
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
                        </View>
                      )}
                      {selectedTicket.ticketType === 22 && (
                        <View
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
                        </View>
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
        data:
          typeof ticket.data === "string"
            ? JSON.parse(ticket.data)
            : ticket.data,
        date: new Date(ticket.createdAt),
      };
      setSelectedTicket(formattedTicketData);
      // console.log(formattedTicketData);
      // console.log(ticket);
      setShowModal(true);
    } catch (error) {
      console.error("Error viewing ticket:", error);
    }
  };

  const columns = [
    {
      name: "User",
      selector: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            className="profile-image"
            src={row.sex === "Male" ? man : woman}
            alt={row.name}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          {row.user}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => {
        const date = new Date(row.date);
        const options = { timeZone: "Australia/Sydney" };

        // Extract parts of the date separately
        const month = date.toLocaleString("en-AU", {
          month: "short",
          ...options,
        }); // 'Oct'
        const day = date.toLocaleString("en-AU", {
          day: "numeric",
          ...options,
        }); // '10'
        const year = date.toLocaleString("en-AU", {
          year: "numeric",
          ...options,
        }); // '2024'
        const time = date.toLocaleString("en-AU", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          ...options,
        }); // '12:27 PM'

        // Return the formatted string
        return `${month} ${day}, ${year} ${time}`;
      },
    },

    {
      name: "Branch",
      selector: (row) => row.branch_id,
      sortable: true,
    },

    // {
    //   name: "Role",
    //   selector: (row) => row.role,
    //   sortable: true
    // },
    {
      name: "Ticket Type",
      selector: (row) => row.ticketType,
      sortable: true,
      cell: (row) => <div>{row.ticketType}</div>,
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
          <div className="top-filter">
            <select
              className="mr-4"
              name="filter"
              id="filter"
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
              id="filter"
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
              id="search-bar"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
            <Text>
              Date Created:{" "}
              {(() => {
                const date = new Date(selectedTicket.date);
                const options = { timeZone: "Australia/Sydney" };

                const month = date.toLocaleString("en-AU", {
                  month: "short",
                  ...options,
                }); // 'Oct'
                const day = date.toLocaleString("en-AU", {
                  day: "numeric",
                  ...options,
                }); // '10'
                const year = date.toLocaleString("en-AU", {
                  year: "numeric",
                  ...options,
                }); // '2024'
                const time = date.toLocaleString("en-AU", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  ...options,
                }); // '12:27 PM'

                return `${month} ${day}, ${year} ${time}`;
              })()}
            </Text>

            <PDFViewer showToolbar={true} width="100%" height="600">
              <TicketPDF selectedTicket={selectedTicket} />
            </PDFViewer>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default TicketsHistory;
