import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  Font,
  pdf,
} from "@react-pdf/renderer";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import check from "@/assets/images/check.png";
import close from "@/assets/images/close.png";
import axiosInstance from "@/services/axiosInstance.js";
// import revive_logo from "@/assets/images/revive-logo.png";
// import revive_logo_white from "@/assets/images/revive-logo-white.png";

import "./Tickets.scss";
import { Helmet } from "react-helmet";
import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

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

export default function TicketsCreate() {
  // eslint-disable-next-line no-unused-vars
  const [productName, setProductName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [productNameValue, setProductNameValue] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [price, setPrice] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [rrp, setRrp] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [save, setSave] = useState("");
  const [expiry, setExpiry] = useState("Expiry");
  // eslint-disable-next-line no-unused-vars
  const [reviveOffer, setReviveOffer] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [tryMe, setTryMe] = useState("");
  const [startDate, setStartDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [percentOff, setpercentOff] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [productBrand, setproductBrand] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [productDesc, setproductDesc] = useState("");
  const [copies, setCopies] = useState(1);
  const [template, setTemplate] = useState("");
  const [assignedTickets, setAssignedTickets] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [ticketQueue, setTicketQueue] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [pdfBlob, setPdfBlob] = useState(null);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [triggerPrint, setTriggerPrint] = useState(false);
  const [offerType, setOfferType] = useState("TEMPORARY REVIVE OFFER");
  const [optionType, setOptionType] = useState("With RRP");
  const [valueType, setValueType] = useState("I'M CHEAPER THAN");
  const [dateError, setDateError] = useState("");
  const [role, setRole] = useState("");
  // const [otherFragances, setOtherFragances] = useState(false);

  const [ticketData, setTicketData] = useState({
    productName: "",
    productNameValue: "",
    productDesc: "",
    price: "",
    rrp: "",
    save: "",
  });

  // eslint-disable-next-line no-unused-vars
  const handleOtherFragrance = () => {
    setTemplate("COSMAX FRAGRANCE TAGS");
  };

  const defaultValues = {
    productName: "Product Name",
    productNameValue: "Greater Product Name",
    price: "Price",
    rrp: "",
    save: "",
    expiry: "00/00/00",
    offerType: "",
    optionType: "",
    valueType: "",
    startDate: "00/00/00",
    percentOff: "00%",
    productBrand: "Brand",
    productDesc: "Description",
    reviveOffer: "REVIVE OFFER",
    tryMe: "TRY ME-LOVE ME!",
  };

  // fetch user for user role
  useEffect(() => {
    // Fetch current user details
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/user");
        const { roles, assigned_tickets, assigned_ticket_categories } =
          response.data;
        const role = roles.length > 0 ? roles[0].role_name : "No Role";
        setRole(role);
        setAssignedTickets(assigned_tickets);
        setCategory(assigned_ticket_categories);
        //console.log(assigned_ticket_categories)
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (triggerPrint) {
      const printPDF = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const blob = await pdf(<MyDocument isPDFView={true} />).toBlob();
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.src = URL.createObjectURL(blob);
        document.body.appendChild(iframe);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTriggerPrint(false);
      };
      printPDF();
    }
  }, [triggerPrint]);

  //handle printing tickets
  const handlePrint = () => {
    setCopies(0);
    setTriggerPrint(true);
  };

  const handleTicketData = (e) => {
    const { name, value } = e.target;

    setTicketData((prevData) => {
      const updatedData = {
        ...prevData,
        valueType,
        offerType,
        optionType,
        expiry,
        startDate,
        [name]: value,
      };

      // Recalculate 'save' if 'price' or 'rrp' is updated
      if (name === "price" || name === "rrp") {
        const price = parseFloat(updatedData.price.replace("$", "")) || 0;
        const rrp = parseFloat(updatedData.rrp) || 0;
        const save = rrp > price ? rrp - price : 0;

        // Update 'save' in the state
        updatedData.save = save.toFixed(2);
      }

      return updatedData;
    });
  };

  //handle generate ticket function
  useEffect(() => {
    if (triggerDownload) {
      const generateAndUploadPDF = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const blob = await pdf(<MyDocument isPDFView={true} />).toBlob();
          // eslint-disable-next-line no-unused-vars
          const response = await axiosInstance.post("/create-ticket", {
            ticket_type: template,
            data: ticketQueue,
          });

          const fileName = `Revive-${template}.pdf`;
          saveAs(blob, fileName);
        } catch (error) {
          console.error("Error uploading PDF:", error);
        } finally {
          setTriggerDownload(false);
        }
      };

      generateAndUploadPDF();
    }
  }, [triggerDownload, ticketData, template]);

  const handleGenerateClick = () => {
    // Check if there are tickets in the queue
    setCopies(0);
    if (ticketQueue.length === 0) {
      Swal.fire({
        title: "No Tickets Added to Queue!",
        text: "Add tickets to the queue first to proceed.",
        imageUrl: close,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: "OK",
        confirmButtonColor: "#EC221F",
        customClass: {
          confirmButton: "custom-error-confirm-button",
          title: "custom-swal-title",
        },
      });
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to generate this ticket?",
        showCancelButton: true,
        confirmButtonColor: "#109F69",
        cancelButtonColor: "#00000000",
        cancelTextColor: "#000000",
        confirmButtonText: "Yes, Generate it!",
        customClass: {
          container: "custom-container",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
          title: "custom-swal-title",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setCopies(0);
            setTriggerDownload(true);
            Swal.fire({
              title: "Success",
              text: "Tickets Generated Successfully",
              imageUrl: check,
              imageWidth: 100,
              imageHeight: 100,
              confirmButtonText: "OK",
              confirmButtonColor: "#0ABAA6",
            });
            setTicketData({
              productName: "",
              productNameValue: "",
              productDesc: "",
              price: "",
              rrp: "",
              save: "",
              copies: 1,
            });
          } catch {
            Swal.fire({
              title: "Error!",
              text: "There was an error generating this ticket.",
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
    }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("loginSuccess") === "true") {
  //     Swal.fire({
  //       title: "Login Successful",
  //       text: `Welcome`,
  //       imageUrl: check,
  //       imageWidth: 100,
  //       imageHeight: 100,
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#0ABAA6",
  //     });
  //     localStorage.removeItem("loginSuccess");
  //   }
  // }, []);
  //clear the forms
  const entriesCleared = () => {
    setSuccessMessage("Entries cleared successfully.");
    setTimeout(() => setSuccessMessage(""), 3000);
    setTicketQueue([]); // Clear the ticket queue
  };
  //clear tickets
  const ticketsCleared = () => {
    setTicketQueue([]); // Clear the ticket queue
  };

  //limit ng text 17chars per line in small tickets product name
  const formatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 19) {
      lines.push(text.substring(i, i + 19));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };
  const formatTextDescRevlon = (text) => {
    const lines = [];
    for (let i = 0; i < text.length && lines.length < 2; i += 33) {
      lines.push(text.substring(i, i + 33));
    }
    return lines.join("\n");
  };

  const formatTextNameRevlon = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 16) {
      lines.push(text.substring(i, i + 16));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  const formatTextGreen = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 18) {
      lines.push(text.substring(i, i + 18));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };
  const formatTextA4New = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 24) {
      lines.push(text.substring(i, i + 24));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };
  const formatDescA4New = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 24) {
      lines.push(text.substring(i, i + 24));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  const formatTextSuperSaving = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 17) {
      lines.push(text.substring(i, i + 17));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  const formatTextA4Clearance = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 25) {
      lines.push(text.substring(i, i + 25));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };
  const formatDescA4Clearance = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 25) {
      lines.push(text.substring(i, i + 25));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  const formatTextA4Ticket = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 19) {
      lines.push(text.substring(i, i + 19));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  // const formatDescA4Ticket = (text) => {
  //   const lines = [];
  //   for (let i = 0; i < text.length; i += 19) {
  //     lines.push(text.substring(i, i + 19));
  //     if (lines.length === 2) break;
  //   }
  //   return lines.join("\n");
  // };

  const formatDescA4Ticket = (text) => {
    const lines = [];
    for (let i = 0; i < text.length && lines.length < 2; i += 39) {
      lines.push(text.substring(i, i + 39));
    }
    return lines.join("\n");
  };

  //limit price to 5 digits
  const formatPrice = (value) => {
    let numericValue = value.replace(/[^0-9.]/g, "");
    let parts = numericValue.split(".");
    if (parts.length > 2) {
      parts = [parts[0], parts.slice(1).join("")];
    }
    if (parts[0].length > 3) {
      parts[0] = parts[0].substring(0, 3);
    }
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
    }
    return parts.join(".");
  };

  //limit price, save and rrp to 3 digits
  const formatSave = (value) => {
    let numericValue = value.replace(/[^0-9.]/g, "");
    let parts = numericValue.split(".");
    if (parts.length > 2) {
      parts = [parts[0], parts.slice(1).join("")];
    }
    if (parts[0].length > 3) {
      parts[0] = parts[0].substring(0, 3);
    }
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
    }
    return parts.join(".");
  };

  const formatRrp = (value) => {
    let numericValue = value.replace(/[^0-9.]/g, "");
    let parts = numericValue.split(".");
    if (parts.length > 2) {
      parts = [parts[0], parts.slice(1).join("")];
    }
    if (parts[0].length > 3) {
      parts[0] = parts[0].substring(0, 3);
    }
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
    }
    return parts.join(".");
  };

  //limit the text in brand input fields of Big Tickets
  const BrandformatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 12) {
      lines.push(text.substring(i, i + 12));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  //limit ng text 17chars per line in small tickets description
  // const formatTextPercentage = (text) => {
  //   const lines = [];
  //   for (let i = 0; i < text.length; i += 15) {
  //     lines.push(text.substring(i, i + 15));
  //     if (lines.length === 2) break;
  //   }
  //   return lines.join("\n");
  // };

  const formatTextPercentage = (text) => {
    const lines = [];
    for (let i = 0; i < text.length && lines.length < 2; i += 31) {
      lines.push(text.substring(i, i + 31));
    }
    return lines.join("\n");
  };

  const formatTextPercentageName = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 15) {
      lines.push(text.substring(i, i + 15));
      if (lines.length === 1) break;
    }
    return lines.join("\n");
  };

  //limit ng text 25chars per line in big tickets
  // const BigformatText = (text) => {
  //   const lines = [];
  //   for (let i = 0; i < text.length; i += 24) {
  //     lines.push(text.substring(i, i + 24));
  //     if (lines.length === 3) break;
  //   }
  //   return lines.join("\n");
  // };

  const BigformatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length && lines.length < 3; i += 75) {
      lines.push(text.substring(i, i + 75));
    }
    return lines.join("\n");
  };

  //limit of 2 characters in percentage
  const PercentageformatText = (number) => {
    const sanitizedNumber = number.replace(/\./g, "");
    const formattedNumber = sanitizedNumber.slice(0, 2);
    return `${formattedNumber}%`;
  };

  //limit copies input
  const handleCopiesChange = (e) => {
    let newCopies = Number(e.target.value);
    // Ensure the value does not exceed 99 and is within the template-specific max
    newCopies = Math.min(newCopies, 99);
    newCopies = Math.min(
      newCopies,
      template === "CATALOGUE SPECIALS PRICE TAGS" ||
        template === "HOT PRICE TAGS (RRP and non-RRP)" ||
        // template === "HOT PRICE TAGS (without RRP + Save)" ||
        template === "COTY FRAGRANCE TAGS" ||
        template === "GREEN FRIDAY SALE TAGS" ||
        template === "MUST TRY TAGS" ||
        template === "NEW IN STORE TAGS" ||
        template === "PERCENTAGE OFF TAGS" ||
        template === "REVLON FRAGRANCE TAGS" ||
        template === "GREEN FRIDAY SALE TAGS - PERCENTAGE OFF" ||
        template === "FROSTBLAND FRAGRANCE TAGS" ||
        template === "DB FRAGRANCE TAGS" ||
        template === "CLEARANCE TAGS" ||
        template === "SUPER SAVINGS TICKET - I'M GREAT VALUE TAGS" ||
        template === "VALUE PACK TICKETS -I'M CHEAPER THAN TAGS" ||
        template === "COSMAX FRAGRANCE TAGS" ||
        template === "DAVKA FRAGRANCE TAGS" ||
        template === "BASIC PRICE TAGS"
        ? 90
        : 45
    );
    setCopies(newCopies);
  };

  //ticket styles
  const getTicketStyle = () => {
    switch (template) {
      case "CATALOGUE SPECIALS PRICE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "PERCENTAGE OFF TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "REVLON FRAGRANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "FROSTBLAND FRAGRANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "COSMAX FRAGRANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "BASIC PRICE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "DAVKA FRAGRANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "COTY FRAGRANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "GREEN FRIDAY SALE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "GREEN FRIDAY SALE TAGS - PERCENTAGE OFF":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "DB FRAGRANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "MUST TRY TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "CLEARANCE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "NEW IN STORE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "SUPER SAVINGS TICKET - I'M GREAT VALUE TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "VALUE PACK TICKETS -I'M CHEAPER THAN TAGS":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "25px",
        };
      case "A4 BIG TICKET LANDSCAPE":
        return {
          height: "585px",
          width: "850px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "20px",
        };
      case "A4 TICKET - PERCENTAGE OFF":
        return {
          height: "585px",
          width: "850px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "20px",
        };
      case "A4 TICKET - NEW IN STORE":
        return {
          height: "585px",
          width: "850px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "20px",
        };
      case "A4 TICKET - CLEARANCE":
        return {
          height: "585px",
          width: "850px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "20px",
        };
      default:
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "18px",
        };
    }
  };
  const handleAddToQueue = () => {
    const currentOfferType = offerType;
    const currentOptionType = optionType;
    const currentValueType = valueType;

    const newTickets = Array.from({ length: copies }, () => ({
      productName: ticketData.productName,
      productNameValue: ticketData.productNameValue,
      price: ticketData.price,
      rrp: ticketData.rrp,
      save: ticketData.save,
      offerType: currentOfferType,
      valueType: currentValueType,
      optionType: currentOptionType,
      expiry: expiry,
      startDate: startDate,
      percentOff: ticketData.percentOff,
      productBrand: ticketData.productBrand,
      productDesc: ticketData.productDesc,
      reviveOffer: ticketData.reviveOffer,
      tryMe: ticketData.tryMe,
      addedToQueue: true,
    }));

    setTicketQueue((prevQueue) => [...prevQueue, ...newTickets]);

    // Reset form data
    setTicketData({
      productName: "",
      productNameValue: "",
      productDesc: "",
      price: "",
      rrp: "",
      save: "",
      copies: 1,
    });
    setProductName("");
    setPrice("");
    setRrp("");
    setSave("");
    setCopies(1);
    setpercentOff("");
    setproductBrand("");
    setproductDesc("");

    setSuccessMessage("Added to queue successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const MyDocument = ({ isPDFView }) => {
    const renderContent = (ticketData) => {
      const values = {
        productName: ticketData.productName || defaultValues.productName,
        productNameValue:
          ticketData.productNameValue || defaultValues.productNameValue,
        price: ticketData.price || defaultValues.price,
        rrp: ticketData.rrp || defaultValues.rrp,
        save: ticketData.save || defaultValues.save,
        offerType: offerType || defaultValues.offerType,
        optionType: optionType || defaultValues.optionType,
        valueType: valueType || defaultValues.valueType,
        expiry: expiry || defaultValues.expiry,
        startDate: startDate || defaultValues.startDate,
        percentOff: ticketData.percentOff || defaultValues.percentOff,
        productBrand: ticketData.productBrand || defaultValues.productBrand,
        productDesc: ticketData.productDesc || defaultValues.productDesc,
        reviveOffer: ticketData.reviveOffer || defaultValues.reviveOffer,
        tryMe: ticketData.tryMe || defaultValues.tryMe,
      };

      switch (template) {
        // case "HOT PRICE TAGS (without RRP + Save)":
        //   if (offerType !== "ONGOING REVIVE OFFER") {
        //     setOfferType("TEMPORARY REVIVE OFFER");
        //   }
        //   return (
        //     <div
        //       style={{
        //         position: "relative",
        //         display: "flex",
        //         flexDirection: "column",
        //         alignItems: "center",
        //       }}
        //     >
        //       {!isPDFView && (
        //         <Text
        //           style={{
        //             position: "fixed",
        //             fontFamily: "BarlowCondensed",
        //             fontSize: 10,
        //             textAlign: "center",
        //             height: "auto",
        //             width: "auto",
        //             padding: "3px",
        //             borderRadius: "5px",
        //             backgroundColor: ticketData.addedToQueue
        //               ? "#e3fae9"
        //               : "#f7d7d7",
        //             color: ticketData.addedToQueue ? "green" : "red",
        //             zIndex: 1000,
        //             pointerEvents: "none",
        //           }}
        //           className="no-print"
        //         >
        //           {ticketData.addedToQueue
        //             ? "Added to Queue"
        //             : "Not Added to Queue"}
        //         </Text>
        //       )}
        //       <Text
        //         style={{
        //           fontSize: "48px",
        //           textTransform: "uppercase",
        //           fontFamily: "BarlowCondensed",
        //           // fontWeight: "600", // Semibold weight
        //           // fontStretch: "condensed", // Condensed style
        //           textAlign: "center",
        //           marginTop: isPDFView ? 10 : 0,
        //         }}
        //       >
        //         HOT PRICE
        //       </Text>

        //       <Text
        //         style={{
        //           fontSize: "50px",
        //           paddingBottom: 2,
        //           // paddingTop: 2,
        //           fontFamily: "Arial",
        //         }}
        //       >
        //         {values.price}
        //       </Text>
        //       <Text
        //         style={{
        //           fontSize: "14px",
        //           textTransform: "uppercase",
        //           fontFamily: "Aptos",
        //           textAlign: "center",
        //         }}
        //       >
        //         {values.productName}
        //         {"\n"}
        //       </Text>
        //       <Text
        //         style={{
        //           fontSize: "14px",
        //           textTransform: "uppercase",
        //           fontFamily: "Aptos",
        //           textAlign: "center",
        //         }}
        //       >
        //         {values.productDesc}
        //         {"\n"}
        //       </Text>

        //       {ticketData.offerType !== "TEMPORARY REVIVE OFFER" && (
        //         <Text
        //           style={{
        //             fontSize: "9px",
        //             textAlign: "center",
        //             fontFamily: "Aptos",
        //             marginBottom: values.productName.includes("\n")
        //               ? "70px"
        //               : "60px",
        //             paddingBottom: isPDFView ? 10 : 0,
        //           }}
        //         >
        //           ONGOING REVIVE OFFER
        //         </Text>
        //       )}

        //       {ticketData.offerType === "TEMPORARY REVIVE OFFER" && (
        //         <Text
        //           style={{
        //             fontSize: "9px",
        //             textAlign: "center",
        //             marginBottom: values.productName.includes("\n")
        //               ? "70px"
        //               : "60px",
        //             fontFamily: "Aptos",
        //             paddingBottom: isPDFView ? 10 : 0,
        //           }}
        //         >
        //           REVIVE OFFER &nbsp;
        //           {formatDateForDisplay(values.startDate)} -{" "}
        //           {formatDateForDisplay(values.expiry)}
        //         </Text>
        //       )}
        //     </div>
        //   );
        case "SUPER SAVINGS TICKET - I'M GREAT VALUE TAGS":
          if (valueType !== "I'M GREATER VALUE!") {
            setValueType("I'M CHEAPER THAN");
          }
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "32px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 5 : 0,
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
                {values.price}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "AptosBold",
                  textAlign: "center",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "AptosBold",
                  textAlign: "center",
                }}
              >
                {values.productDesc}
                {"\n"}
              </Text>
              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}
              {ticketData.valueType !== "I'M CHEAPER THAN" && (
                <Text
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    fontFamily: "Aptos",
                    marginBottom: values.productName.includes("\n")
                      ? "70px"
                      : "60px",
                    paddingBottom: isPDFView ? 10 : 0,
                  }}
                >
                  I&apos;M GREATER VALUE! {"\n"}
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

              {ticketData.valueType === "I'M CHEAPER THAN" && (
                <Text
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    marginBottom: values.productName.includes("\n")
                      ? "70px"
                      : "45px",
                    fontFamily: "Aptos",
                    paddingBottom: isPDFView ? 8 : 0,
                  }}
                >
                  I&apos;M CHEAPER THAN {"\n"}
                  <Text
                    style={{
                      fontSize: "14px",
                      textAlign: "center",
                      fontFamily: "AptosBold",
                      textTransform: "uppercase",
                    }}
                  >
                    {" "}
                    {values.productNameValue}
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
          );
        case "VALUE PACK TICKETS -I'M CHEAPER THAN TAGS":
          if (valueType !== "I'M GREATER VALUE!") {
            setValueType("I'M CHEAPER THAN");
          }
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "32px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 10 : 0,
                }}
              >
                VALUE PACK
              </Text>

              <Text
                style={{
                  fontSize: "42px",
                  marigin: 0,
                  padding: 0,
                  lineHeight: 1,
                  fontFamily: "Arial",
                }}
              >
                {values.price}
              </Text>
              <Text
                style={{
                  fontSize: "16px",
                  textTransform: "uppercase",
                  fontFamily: "AptosBold",
                  textAlign: "center",
                }}
              >
                {values.productName}
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
                {values.productDesc}
                {"\n"}
              </Text>
              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}
              {ticketData.valueType !== "I'M CHEAPER THAN" && (
                <Text
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    fontFamily: "Aptos",
                    marginBottom: values.productName.includes("\n")
                      ? "70px"
                      : "55px",
                    paddingBottom: isPDFView ? 10 : 0,
                  }}
                >
                  I&apos;M GREATER VALUE {"\n"}
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

              {ticketData.valueType === "I'M CHEAPER THAN" && (
                <Text
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    marginBottom: values.productName.includes("\n")
                      ? "70px"
                      : "40px",
                    fontFamily: "Aptos",
                    paddingBottom: isPDFView ? 5 : 0,
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
                    {values.productNameValue}
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
          );
        case "GREEN FRIDAY SALE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "24px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 10 : 0,
                }}
              >
                GREEN FRIDAY SALE
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                  marginTop: "3px",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                }}
              >
                {values.productDesc}
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
                {values.price}
              </Text>

              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}

              <Text
                style={{
                  fontSize: "9px",
                  textAlign: "center",
                  marginBottom: values.productName.includes("\n")
                    ? "70px"
                    : "75px",
                  fontFamily: "Aptos",
                  paddingBottom: isPDFView ? 10 : 0,
                }}
              >
                REVIVE OFFER AVAILABLE {"\n"}
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "GREEN FRIDAY SALE TAGS - PERCENTAGE OFF":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "24px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 10 : 0,
                }}
              >
                GREEN FRIDAY SALE
              </Text>
              <Text style={{ fontSize: "45px", fontFamily: "AptosBold" }}>
                {values.percentOff}
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
                {values.productName}
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
                {values.productDesc}
                {"\n"}
              </Text>

              <Text
                style={{
                  fontSize: "9px",
                  textAlign: "center",
                  marginBottom: values.productName.includes("\n")
                    ? "70px"
                    : "75px",
                  fontFamily: "Aptos",
                  paddingBottom: isPDFView ? 10 : 0,
                }}
              >
                REVIVE OFFER AVAILABLE {"\n"}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "DB FRAGRANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "27px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 10 : 0,
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
                {values.price}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  fontFamily: "AptosBold",
                  lineHeight: "1px",
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
                  marginBottom: "55px",
                  fontFamily: "Aptos",
                  paddingBottom: isPDFView ? 10 : 0,
                  marginTop: "5px",
                }}
              >
                ONGOING REVIVE OFFER
              </Text>
            </div>
          );
        case "MUST TRY TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "43px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 8 : 0,
                }}
              >
                MUST TRY
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                  marginTop: "3px",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                }}
              >
                {values.productDesc}
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
                {values.price}
              </Text>

              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}

              <Text
                style={{
                  fontSize: "17px",
                  textAlign: "center",
                  marginBottom: values.productName.includes("\n")
                    ? "70px"
                    : "60px",
                  fontFamily: "Aptos",
                  paddingBottom: isPDFView ? 5 : 0,
                }}
              >
                {values.reviveOffer}
              </Text>
            </div>
          );
        case "CLEARANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "40px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 8 : 0,
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
                {values.productName}
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
                {values.productDesc}
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
                {values.price}
              </Text>

              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                  RRP ${values.rrp}  Save ${values.save}
                </Text> */}

              <Text
                style={{
                  fontSize: "17px",
                  textAlign: "center",
                  marginBottom: values.productName.includes("\n")
                    ? "70px"
                    : "55px",
                  fontFamily: "Aptos",
                  paddingBottom: isPDFView ? 5 : 0,
                }}
              >
                {values.reviveOffer}
              </Text>
            </div>
          );
        case "NEW IN STORE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "33px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 8 : 0,
                }}
              >
                NEW IN STORE
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                  marginTop: "3px",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                }}
              >
                {values.productDesc}
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
                {values.price}
              </Text>

              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}

              <Text
                style={{
                  fontSize: "19px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  marginBottom: values.productName.includes("\n")
                    ? "70px"
                    : "65px",
                  fontFamily: "Aptos",
                  paddingBottom: isPDFView ? 5 : 0,
                }}
              >
                {values.tryMe}
              </Text>
            </div>
          );
        case "A4 TICKET - NEW IN STORE":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "100px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 8 : 0,
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
                {values.productName}
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
                {values.productDesc}
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
                {values.price}
              </Text>

              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}

              <Text style={{ fontSize: "20px", fontFamily: "Aptos" }}>
                REVIVE OFFER AVAILABLE &nbsp;
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "A4 TICKET - CLEARANCE":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "120px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontWeight: "600", // Semibold weight
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 8 : 0,
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
                {values.productName}
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
                {values.productDesc}
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
                {values.price}
              </Text>

              {/* <Text style={{ fontSize: "10px", fontFamily: "AptosBold", marginTop: "2px" }}>
                RRP ${values.rrp}  Save ${values.save}
              </Text> */}

              <Text style={{ fontSize: "20px", fontFamily: "Aptos" }}>
                REVIVE OFFER AVAILABLE &nbsp;
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "CATALOGUE SPECIALS PRICE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "24px",
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  textAlign: "center",
                  marginTop: isPDFView ? 10 : 0,
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
              {/* <Text style={{ fontSize: "65px", fontFamily: "BarlowCondensed", fontWeight: '600', lineHeight: "1px" }}>
                {values.percentOff}
                <Text style={{ fontSize: "32px", fontFamily: "BarlowCondensed", fontWeight: '600' }}>
                  OFF
                </Text>
              </Text> */}
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
                {values.price}
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
                {values.productName}
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
                {values.productDesc}
                {"\n"}
              </Text>
              <Text
                style={{
                  // paddingTop: "5px",
                  fontSize: "9px",
                  textAlign: "center",
                  fontFamily: "Aptos",
                  lineHeight: "1px",
                  marginBottom: values.productName.includes("\n")
                    ? "70px"
                    : "65px",
                  paddingBottom: isPDFView ? 8 : 0,
                }}
              >
                REVIVE OFFER &nbsp;
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "REVLON FRAGRANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

              <Text
                style={{
                  marginTop: "10px",
                  fontSize: "18px",
                  fontFamily: "Aptos",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                }}
              >
                {values.productName}
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
                {values.productDesc}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "50px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                  marginBottom: "10px",
                }}
              >
                {values.price}
                {"\n"}
              </Text>
              <Text
                style={{
                  paddingTop: "5px",
                  fontSize: "9px",
                  textAlign: "center",
                  fontFamily: "Aptos",
                  // lineHeight: "1px",
                  marginBottom: values.productDesc.includes("\n")
                    ? "30px"
                    : "85px",
                  paddingBottom: values.productDesc.includes("\n")
                    ? isPDFView
                      ? "50px"
                      : "40px"
                    : isPDFView
                    ? "20px"
                    : "0px",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    fontFamily: "AptosBold",
                    marginBottom: "3px",
                  }}
                >
                  {" "}
                  REVLON FRAGRANCES
                </Text>
                {"\n"}
                ONGOING REVIVE OFFER
              </Text>
            </div>
          );
        case "FROSTBLAND FRAGRANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

              <Text
                style={{
                  marginTop: "5px",
                  fontSize: "17px",
                  fontFamily: "AptosBold",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "17px",
                  fontFamily: "AptosBold",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                  marginBottom: "3px",
                }}
              >
                {values.productDesc}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "50px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                  marginBottom: "12px",
                  marginTop: "3px",
                }}
              >
                {values.price}
                {"\n"}
              </Text>
              <Text
                style={{
                  paddingTop: "5px",
                  fontSize: "9px",
                  textAlign: "center",
                  fontFamily: "Aptos",
                  lineHeight: "1px",
                  marginBottom: values.productDesc.includes("\n")
                    ? "25px"
                    : "90px",
                  paddingBottom: values.productDesc.includes("\n")
                    ? isPDFView
                      ? "65px"
                      : "50px"
                    : isPDFView
                    ? "15px"
                    : "0px",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    fontFamily: "AptosBold",
                    lineHeight: 1.2,
                    marginTop: "3px",
                  }}
                >
                  {" "}
                  FROSTBLAND FRAGRANCES
                </Text>
                {"\n"}
                ONGOING REVIVE OFFER
              </Text>
            </div>
          );
        case "BASIC PRICE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

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
                {values.productName}
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
                {values.productDesc}
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
                {values.price}
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
                RRP ${values.rrp}
                {"\n"}
                <Text
                  style={{
                    fontSize: "15px",
                    fontFamily: "AptosBold",
                    marginTop: "2px",
                    lineHeight: "1px",
                  }}
                >
                  Save ${values.save}{" "}
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
                  marginBottom: values.productDesc.includes("\n")
                    ? "50px"
                    : "65px",
                  paddingBottom: isPDFView ? 20 : 0,
                }}
              >
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "COSMAX FRAGRANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

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
                {values.productName}
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
                {values.productDesc}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "45px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                  marginBottom: "12px",
                  marginTop: "4px",
                }}
              >
                {values.price}
                {"\n"}
              </Text>
              <Text
                style={{
                  paddingTop: "5px",
                  fontSize: "9px",
                  textAlign: "center",
                  fontFamily: "Aptos",
                  lineHeight: "1px",
                  marginBottom: values.productDesc.includes("\n")
                    ? "20px"
                    : "90px",
                  paddingBottom: values.productDesc.includes("\n")
                    ? isPDFView
                      ? "70px"
                      : "50px"
                    : isPDFView
                    ? "15px"
                    : "0px",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    fontFamily: "AptosBold",
                    marginTop: "3px",
                    lineHeight: "1.2px",
                  }}
                >
                  {" "}
                  COSMAX FRAGRANCES
                </Text>
                {"\n"}
                ONGOING REVIVE OFFER
              </Text>
            </div>
          );
        case "DAVKA FRAGRANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

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
                {values.productName}
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
                {values.productDesc}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "45px",
                  fontFamily: "Arial",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: "1px",
                  marginBottom: "12px",
                  marginTop: "4px",
                }}
              >
                {values.price}
                {"\n"}
              </Text>
              <Text
                style={{
                  paddingTop: "5px",
                  fontSize: "9px",
                  textAlign: "center",
                  fontFamily: "Aptos",
                  lineHeight: "1px",
                  marginBottom: values.productDesc.includes("\n")
                    ? "20px"
                    : "90px",
                  paddingBottom: values.productDesc.includes("\n")
                    ? isPDFView
                      ? "70px"
                      : "50px"
                    : isPDFView
                    ? "15px"
                    : "0px",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    fontFamily: "AptosBold",
                    marginTop: "3px",
                    lineHeight: "1.2px",
                  }}
                >
                  {" "}
                  DAVKA FRAGRANCES
                </Text>
                {"\n"}
                ONGOING REVIVE OFFER
              </Text>
            </div>
          );
        case "COTY FRAGRANCE TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

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
                {values.productName}
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
                {values.productDesc}
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
                {values.price}
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
                RRP ${values.rrp}
                {"\n"}
                <Text
                  style={{
                    fontSize: "15px",
                    fontFamily: "AptosBold",
                    marginTop: "2px",
                    lineHeight: "1px",
                  }}
                >
                  Save ${values.save}{" "}
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
                  marginBottom: values.productDesc.includes("\n")
                    ? "50px"
                    : "70px",
                  paddingBottom: isPDFView ? 15 : 0,
                }}
              >
                OFFER ENDS {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        case "PERCENTAGE OFF TAGS":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

              <Text
                style={{
                  fontSize: "68px",
                  fontFamily: "BarlowCondensed",
                  marginTop: isPDFView ? 10 : 0,
                }}
              >
                {values.percentOff}
                <Text
                  style={{ fontSize: "36px", fontFamily: "BarlowCondensed" }}
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
                {values.productName}
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
                {values.productDesc}
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
                  marginBottom: values.productDesc.includes("\n")
                    ? "50px"
                    : "70px",
                  paddingBottom: isPDFView ? 8 : 0,
                }}
              >
                REVIVE OFFER AVAILABLE {"\n"}
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );

        case "A4 BIG TICKET LANDSCAPE":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 20,
                    height: "auto",
                    width: "auto",
                    padding: "4px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                    marginTop: 30,
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}

              <Text
                style={{
                  fontSize: "72px",
                  fontFamily: "BarlowCondensed",
                  textTransform: "uppercase",
                  marginTop: isPDFView ? 10 : 0,
                }}
              >
                {values.productBrand}
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
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "200px",
                  fontFamily: "Arial",
                  marginTop: "-20px",
                }}
              >
                {values.price}
              </Text>
              <Text
                style={{
                  fontSize: "20px",
                  fontFamily: "Aptos",
                  marginTop: "-10px",
                }}
              >
                REVIVE OFFER &nbsp;
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
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
          );
        case "A4 TICKET - PERCENTAGE OFF":
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    top: -5,
                    fontFamily: "BarlowCondensed",
                    fontSize: 20,
                    height: "auto",
                    width: "auto",
                    padding: "4px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                    marginTop: 30,
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "200px",
                  fontFamily: "AptosBold",
                  lineHeight: "1px",
                }}
              >
                {values.percentOff}
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
                {values.productName}
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
                {values.productDesc}
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
                {formatDateForDisplay(values.startDate)} -{" "}
                {formatDateForDisplay(values.expiry)}
              </Text>
            </div>
          );
        default:
          if (offerType !== "ONGOING REVIVE OFFER") {
            setOfferType("TEMPORARY REVIVE OFFER");
          }

          if (optionType !== "Without RRP") {
            setOptionType("With RRP");
          }
          return (
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!isPDFView && (
                <Text
                  style={{
                    position: "fixed",
                    fontFamily: "BarlowCondensed",
                    fontSize: 10,
                    lineHeight: 1,
                    textAlign: "center",
                    height: "auto",
                    width: "auto",
                    padding: "3px",
                    borderRadius: "5px",
                    backgroundColor: ticketData.addedToQueue
                      ? "#e3fae9"
                      : "#f7d7d7",
                    color: ticketData.addedToQueue ? "green" : "red",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }}
                  className="no-print"
                >
                  {ticketData.addedToQueue
                    ? "Added to Queue"
                    : "Not Added to Queue"}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "32px",
                  lineHeight: 1,
                  margin: 0,
                  padding: 0,
                  textTransform: "uppercase",
                  fontFamily: "BarlowCondensed",
                  // fontStretch: "condensed", // Condensed style
                  textAlign: "center",
                  marginTop: isPDFView ? 10 : 0,
                }}
              >
                HOT PRICE
              </Text>
              <Text
                style={{
                  fontSize: "42px",
                  margin: 0,
                  padding: 0,
                  lineHeight: 1,
                  fontFamily: "Arial",
                }}
              >
                {values.price}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                }}
              >
                {values.productName}
                {"\n"}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  fontFamily: "Aptos",
                  textAlign: "center",
                }}
              >
                {values.productDesc}
                {"\n"}
              </Text>

              {ticketData.optionType !== "Without RRP" && (
                <Text
                  style={{
                    fontSize: "10px",
                    fontFamily: "AptosBold",
                    marginTop: "2px",
                  }}
                >
                  RRP ${values.rrp} Save ${values.save}
                </Text>
              )}
              {ticketData.offerType !== "TEMPORARY REVIVE OFFER" && (
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                    fontFamily: "Aptos",
                    marginBottom:
                      ticketData.offerType === "With RRP" ? "70px" : "50px",
                    paddingBottom: isPDFView ? 8 : 0,
                  }}
                >
                  ONGOING REVIVE OFFER
                </Text>
              )}

              {ticketData.offerType === "TEMPORARY REVIVE OFFER" && (
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                    marginBottom:
                      ticketData.offerType === "With RRP" ? "70px" : "50px",
                    fontFamily: "Aptos",
                    paddingBottom: isPDFView ? 8 : 0,
                  }}
                >
                  REVIVE OFFER &nbsp;
                  {formatDateForDisplay(values.startDate)} -{" "}
                  {formatDateForDisplay(values.expiry)}
                </Text>
              )}
            </div>
          );
      }
    };

    const getTicketContainers = () => {
      const numberOfCopies = copies || 0;

      const livePreviewTicket = {
        productName: ticketData.productName || defaultValues.productName,
        productNameValue:
          ticketData.productNameValue || defaultValues.productNameValue,
        price: ticketData.price || defaultValues.price,
        rrp: ticketData.rrp || defaultValues.rrp,
        save: ticketData.save || defaultValues.save,
        offerType: offerType || defaultValues.offerType,
        optionType: optionType || defaultValues.optionType,
        valueType: valueType || defaultValues.valueType,
        expiry: expiry || defaultValues.expiry,
        startDate: startDate || defaultValues.startDate,
        percentOff: ticketData.percentOff || defaultValues.percentOff,
        productBrand: ticketData.productBrand || defaultValues.productBrand,
        productDesc: ticketData.productDesc || defaultValues.productDesc,
        reviveOffer: ticketData.reviveOffer || defaultValues.reviveOffer,
        tryMe: ticketData.tryMe || defaultValues.tryMe,
        addedToQueue: false,
      };

      const livePreviewTickets = Array(numberOfCopies).fill(livePreviewTicket);
      const allTickets = [...ticketQueue, ...livePreviewTickets];

      const containerGroups = [];
      const ticketStyle = getTicketStyle();
      const maxTicketsPerPage = template.includes("TAGS") ? 9 : 1;

      for (let i = 0; i < allTickets.length; i += maxTicketsPerPage) {
        const currentGroup = [
          ...Array(Math.min(maxTicketsPerPage, allTickets.length - i)),
        ].map((_, index) => {
          const currentTicket = allTickets[i + index];

          return (
            <View key={index} style={ticketStyle}>
              {renderContent(currentTicket)}
            </View>
          );
        });

        containerGroups.push(
          <View
            key={`container-${i}`}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "content-start",
              gap: "15px",
              alignItems: "center",
              paddingLeft: "9px",
              // paddingRight: "px",
            }}
          >
            {currentGroup}
          </View>
        );
      }

      return containerGroups;
    };

    const pageSize = template.includes("A4 BIG TICKET LANDSCAPE") ? "A4" : "A4";
    const pageOrientation =
      template.includes("A4 BIG TICKET LANDSCAPE") ||
      template.includes("A4 TICKET - PERCENTAGE OFF") ||
      template.includes("A4 TICKET - NEW IN STORE") ||
      template.includes("A4 TICKET - CLEARANCE")
        ? "landscape"
        : "portrait";
    const backgroundColor =
      template.includes("CATALOGUE") || template.includes("LANDSCAPE")
        ? "#FFFFFF"
        : "#FFFFFF";

    return (
      <Document>
        <Page
          size={pageSize}
          orientation={pageOrientation}
          style={{ backgroundColor: backgroundColor }}
        >
          {getTicketContainers()}
        </Page>
      </Document>
    );
  };

  //form fields
  const renderFormFields = () => {
    switch (template) {
      // case "HOT PRICE TAGS (without RRP + Save)":
      //   return (
      //     <>
      //       <div className="form-group">
      //         <label>Product Name</label>
      //         <input
      //           type="text"
      //           name="productName" // Added name
      //           className="form-control"
      //           value={ticketData.productName || ""}
      //           onChange={(e) =>
      //             handleTicketData({
      //               target: {
      //                 name: "productName",
      //                 value: formatText(e.target.value),
      //               },
      //             })
      //           }
      //         />
      //       </div>
      //       <div className="form-group">
      //         <label>Description</label>
      //         <input
      //           type="text"
      //           name="productDesc" // Added name
      //           className="form-control"
      //           value={ticketData.productDesc || ""}
      //           onChange={(e) =>
      //             handleTicketData({
      //               target: {
      //                 name: "productDesc",
      //                 value: formatText(e.target.value),
      //               },
      //             })
      //           }
      //         />
      //       </div>
      //       <div className="form-group">
      //         <label>Price</label>
      //         <input
      //           type="text"
      //           name="price" // Added name
      //           className="form-control"
      //           value={
      //             ticketData.price ? ticketData.price.replace("$", "") : ""
      //           }
      //           onChange={(e) => {
      //             const filteredValue = e.target.value.replace(/e/gi, "");
      //             handleTicketData({
      //               target: {
      //                 name: "price",
      //                 value: "$" + formatPrice(filteredValue),
      //               },
      //             });
      //           }}
      //         />
      //       </div>

      //       <div className="form-group">
      //         <label>Offer Type</label>
      //         <select
      //           className="form-control"
      //           value={offerType}
      //           onChange={handleOfferTypeChange}
      //         >
      //           <option value="TEMPORARY REVIVE OFFER">
      //             Temporary Revive Offer
      //           </option>
      //           <option value="ONGOING REVIVE OFFER">
      //             Ongoing Revive Offer
      //           </option>
      //         </select>
      //         <i className="fa fa-chevron-down custom-dropdown-icon-2"></i>
      //       </div>

      //       <div
      //         hidden={offerType === "ONGOING REVIVE OFFER"}
      //         className="form-group"
      //         style={{
      //           position: "relative",
      //           display: "flex",
      //           flexDirection: "row",
      //           justifyContent: "space-between",
      //         }}
      //       >
      //         <div style={{ display: "flex", flexDirection: "column" }}>
      //           <label>Start Date</label>
      //           <input
      //             type="date"
      //             name="startDate"
      //             className="form-control date-input"
      //             value={startDate}
      //             onChange={handleStartDateChange}
      //             min={getTodayDate()}
      //           />
      //           <i
      //             className="fa fa-calendar custom-date-icon-1"
      //             style={{ color: "black", zIndex: "1000" }}
      //           ></i>
      //         </div>
      //         <div style={{ display: "flex", flexDirection: "column" }}>
      //           <label>Expiry Date</label>
      //           <input
      //             type="date"
      //             name="expiry"
      //             className="form-control date-input"
      //             value={expiry}
      //             onChange={handleExpiryChange}
      //             min={getTodayDate()}
      //           />
      //           <i
      //             className="fa fa-calendar custom-date-icon"
      //             style={{ color: "black", zIndex: "1000" }}
      //           ></i>
      //         </div>
      //       </div>
      //     </>
      //   );
      case "SUPER SAVINGS TICKET - I'M GREAT VALUE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>

            <div className="form-group">
              <label>Value Type</label>
              <select
                className="form-control"
                value={valueType}
                onChange={handleValueTypeChange}
              >
                <option value="I'M GREATER VALUE!">
                  I&apos;M GREATER VALUE!
                </option>
                <option value="I'M CHEAPER THAN">I&apos;M CHEAPER THAN</option>
              </select>
              <i className="fa fa-chevron-down custom-dropdown-icon-2"></i>
            </div>

            <div
              hidden={valueType === "I'M GREATER VALUE!"}
              className="form-group"
            >
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productNameValue" // Added name
                  className="form-control"
                  value={ticketData.productNameValue || ""}
                  onChange={(e) =>
                    handleTicketData({
                      target: {
                        name: "productNameValue",
                        value: formatTextSuperSaving(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </>
        );
      case "VALUE PACK TICKETS -I'M CHEAPER THAN TAGS":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>

            <div className="form-group custom-icon-div">
              <label>Value Type</label>
              <select
                className="form-control"
                value={valueType}
                onChange={handleValueTypeChange}
              >
                <option value="I'M GREATER VALUE!">
                  I&apos;M GREATER VALUE!
                </option>
                <option value="I'M CHEAPER THAN">I&apos;M CHEAPER THAN</option>
              </select>
              <i className="fa fa-chevron-down custom-dropdown-icon-2"></i>
            </div>

            <div
              hidden={valueType === "I'M GREATER VALUE!"}
              className="form-group"
            >
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productNameValue" // Added name
                  className="form-control"
                  value={ticketData.productNameValue || ""}
                  onChange={(e) =>
                    handleTicketData({
                      target: {
                        name: "productNameValue",
                        value: formatTextSuperSaving(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </>
        );
      case "GREEN FRIDAY SALE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            {/* <div className="form-group">
              <label>RRP</label>
              <input
                type="text"
                name="rrp" // Added name
                className="form-control"
                value={ticketData.rrp || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, '');
                  handleTicketData({
                    target: {
                      name: "rrp",
                      value: formatRrp(filteredValue),
                    },
                  })
                }}
              />
            </div>
            <div className="form-group">
              <label>Save</label>
              <input
                type="text"
                name="save" // Added name
                className="form-control"
                value={ticketData.save || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, '');
                  handleTicketData({
                    target: {
                      name: "save",
                      value: formatSave(filteredValue),
                    },
                  })
                }}
              />
            </div> */}

            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
          </>
        );
      case "GREEN FRIDAY SALE TAGS - PERCENTAGE OFF":
        return (
          <>
            <div className="form-group">
              <label>Percent Off</label>
              <input
                name="percentOff"
                type="text"
                className="form-control"
                value={ticketData.percentOff?.replace("%", "") || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "percentOff",
                      value: PercentageformatText(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiry"
                className="form-control date-input-2"
                value={expiry}
                onChange={handleExpiryChange}
                min={getTodayDate()}
              />
              <i
                className="fa fa-calendar custom-date-icon-3"
                style={{ color: "black", zIndex: "1000" }}
              ></i>
            </div>
          </>
        );
      case "DB FRAGRANCE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
          </>
        );
      case "MUST TRY TAGS":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            {/* <div className="form-group">
                <label>RRP</label>
                <input
                  type="text"
                  name="rrp" // Added name
                  className="form-control"
                  value={ticketData.rrp || ""}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/e/gi, '');
                    handleTicketData({
                      target: {
                        name: "rrp",
                        value: formatRrp(filteredValue),
                      },
                    })
                  }}
                />
              </div>
              <div className="form-group">
                <label>Save</label>
                <input
                  type="text"
                  name="save" // Added name
                  className="form-control"
                  value={ticketData.save || ""}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/e/gi, '');
                    handleTicketData({
                      target: {
                        name: "save",
                        value: formatSave(filteredValue),
                      },
                    })
                  }}
                />
              </div> */}
            <div className="form-group">
              <label>Offer</label>
              <input
                type="text"
                name="reviveOffer" // Added name
                className="form-control"
                value={ticketData.reviveOffer || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "reviveOffer",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
          </>
        );
      case "CLEARANCE TAGS":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                type="text"
                name="productName"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
                variant="outlined"
                label="Product Name"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                type="text"
                name="productDesc"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
                variant="outlined"
                label="Description"
              />
            </Grid>
            <TextField
              type="text"
              name="price"
              value={ticketData.price ? ticketData.price.replace("$", "") : ""}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/e/gi, "");
                handleTicketData({
                  target: {
                    name: "price",
                    value: "$" + formatPrice(filteredValue),
                  },
                });
              }}
              variant="outlined"
              label="Price"
            />
            <TextField
              type="text"
              name="reviveOffer"
              value={ticketData.reviveOffer || ""}
              onChange={(e) =>
                handleTicketData({
                  target: {
                    name: "reviveOffer",
                    value: formatTextGreen(e.target.value),
                  },
                })
              }
              variant="outlined"
              label="Offer"
            />
          </Grid>
        );
      case "NEW IN STORE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            {/* <div className="form-group">
                <label>RRP</label>
                <input
                  type="text"
                  name="rrp" // Added name
                  className="form-control"
                  value={ticketData.rrp || ""}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/e/gi, '');
                    handleTicketData({
                      target: {
                        name: "rrp",
                        value: formatRrp(filteredValue),
                      },
                    })
                  }}
                />
              </div>
              <div className="form-group">
                <label>Save</label>
                <input
                  type="text"
                  name="save" // Added name
                  className="form-control"
                  value={ticketData.save || ""}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/e/gi, '');
                    handleTicketData({
                      target: {
                        name: "save",
                        value: formatSave(filteredValue),
                      },
                    })
                  }}
                />
              </div> */}
            <div className="form-group">
              <label>Offer</label>
              <input
                type="text"
                name="tryMe" // Added name
                className="form-control"
                value={ticketData.tryMe || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "tryMe",
                      value: formatTextGreen(e.target.value),
                    },
                  })
                }
              />
            </div>
          </>
        );
      case "A4 TICKET - NEW IN STORE":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextA4New(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatDescA4New(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>

            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
          </>
        );
      case "A4 TICKET - CLEARANCE":
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextA4Clearance(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatDescA4Clearance(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>

            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
          </>
        );
      case "CATALOGUE SPECIALS PRICE TAGS":
        return (
          <>
            {/* <div className="form-group">
              <label>Percent Off</label>
              <input
                type="text"
                className="form-control"
                value={percentOff.replace("%", "")}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                  setpercentOff(PercentageformatText(filteredValue))
                }}
                max="99"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={productDesc}
                onChange={(e) =>
                  setproductDesc(DescriptionformatText(e.target.value))
                }
              />
            </div> */}
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatText(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatText(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
            {/* <div className="form-group" style={{ position: "relative" }}>
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
                min={getTodayDate()}
              />
              <i className="fa fa-calendar custom-date-icon" style={{ color: "black" }}></i>
            </div> */}
          </>
        );
      // case "Big Tickets (P)":
      //   return (
      //     <>
      //       <div className="form-group">
      //         <label>Brand</label>
      //         <input
      //           type="text"
      //           className="form-control"
      //           value={productBrand}
      //           onChange={(e) =>
      //             setproductBrand(BrandformatText(e.target.value))
      //           }
      //         />
      //       </div>
      //       <div className="form-group">
      //         <label>Product Name</label>
      //         <input
      //           type="text"
      //           className="form-control"
      //           value={productName}
      //           onChange={(e) => setProductName(BigformatText(e.target.value))}
      //         />
      //       </div>
      //       <div className="form-group">
      //         <label>Price</label>
      //         <input
      //           type="text"
      //           className="form-control"
      //           value={price.replace("$", "")}
      //           onChange={(e) => {
      //             const filteredValue = e.target.value.replace(/e/gi, '');
      //             setPrice("$" + formatPrice(filteredValue))
      //           }}
      //         />
      //       </div>
      //       <div className="form-group" style={{ position: "relative" }}>
      //         <label>Expiry</label>
      //         <input
      //           type="date"
      //           className="form-control"
      //           value={expiry}
      //           onChange={handleExpiryChange}
      //           min={getTodayDate()}
      //         />
      //         <i className="fa fa-calendar custom-date-icon" style={{ color: "black" }}></i>
      //       </div>
      //     </>
      //   );
      case "REVLON FRAGRANCE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDesc"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productDesc || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 2 &&
                    lines.every((line) => line.length <= 16)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productDesc",
                        value: formatTextDescRevlon(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 2 ||
                    (lines.length === 2 && lines[1].length > 16)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productDesc || "";
                  }
                }}
                rows="2" // Set to 2 rows to match the limit
                maxLength={33} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>
          </>
        );
      case "FROSTBLAND FRAGRANCE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDesc"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productDesc || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 2 &&
                    lines.every((line) => line.length <= 16)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productDesc",
                        value: formatTextDescRevlon(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 2 ||
                    (lines.length === 2 && lines[1].length > 16)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productDesc || "";
                  }
                }}
                rows="2" // Set to 2 rows to match the limit
                maxLength={33} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>
          </>
        );
      case "DAVKA FRAGRANCE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDesc"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productDesc || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 2 &&
                    lines.every((line) => line.length <= 16)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productDesc",
                        value: formatTextDescRevlon(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 2 ||
                    (lines.length === 2 && lines[1].length > 16)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productDesc || "";
                  }
                }}
                rows="2" // Set to 2 rows to match the limit
                maxLength={33} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>
          </>
        );
      case "BASIC PRICE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>RRP</label>
              <input
                type="text"
                name="rrp" // Added name
                className="form-control"
                value={ticketData.rrp || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "rrp",
                      value: formatRrp(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Save</label>
              <input
                disabled
                type="text"
                name="save" // Added name
                className="form-control"
                value={ticketData.save || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "save",
                      value: formatSave(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
          </>
        );
      case "COSMAX FRAGRANCE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDesc"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productDesc || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 2 &&
                    lines.every((line) => line.length <= 16)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productDesc",
                        value: formatTextDescRevlon(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 2 ||
                    (lines.length === 2 && lines[1].length > 16)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productDesc || "";
                  }
                }}
                rows="2" // Set to 2 rows to match the limit
                maxLength={33} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>
          </>
        );
      case "COTY FRAGRANCE TAGS":
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="productDesc" // Added name
                className="form-control"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatTextNameRevlon(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>RRP</label>
              <input
                type="text"
                name="rrp" // Added name
                className="form-control"
                value={ticketData.rrp || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "rrp",
                      value: formatRrp(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>Save</label>
              <input
                disabled
                type="text"
                name="save" // Added name
                className="form-control"
                value={ticketData.save || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "save",
                      value: formatSave(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiry"
                className="form-control date-input-2"
                value={expiry}
                onChange={handleExpiryChange}
                min={getTodayDate()}
              />
              <i
                className="fa fa-calendar custom-date-icon-2"
                style={{ color: "black", zIndex: "1000" }}
              ></i>
            </div>
          </>
        );
      case "PERCENTAGE OFF TAGS":
        return (
          <>
            <div className="form-group">
              <label>Percent Off</label>
              <input
                name="percentOff"
                type="text"
                className="form-control"
                value={ticketData.percentOff?.replace("%", "") || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "percentOff",
                      value: PercentageformatText(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextPercentageName(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDesc"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productDesc || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 2 &&
                    lines.every((line) => line.length <= 15)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productDesc",
                        value: formatTextPercentage(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 2 ||
                    (lines.length === 2 && lines[1].length > 15)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productDesc || "";
                  }
                }}
                rows="2" // Set to 2 rows to match the limit
                maxLength={31} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>

            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
            {/* <div className="form-group" style={{ position: "relative" }}>
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
                min={getTodayDate()}
              />
              <i className="fa fa-calendar custom-date-icon" style={{ color: "black" }}></i>
            </div> */}
          </>
        );
      // case "Big Tickets (P)":
      //   return (
      //     <>
      //       <div className="form-group">
      //         <label>Brand</label>
      //         <input
      //           type="text"
      //           className="form-control"
      //           value={productBrand}
      //           onChange={(e) =>
      //             setproductBrand(BrandformatText(e.target.value))
      //           }
      //         />
      //       </div>
      //       <div className="form-group">
      //         <label>Product Name</label>
      //         <input
      //           type="text"
      //           className="form-control"
      //           value={productName}
      //           onChange={(e) => setProductName(BigformatText(e.target.value))}
      //         />
      //       </div>
      //       <div className="form-group">
      //         <label>Price</label>
      //         <input
      //           type="text"
      //           className="form-control"
      //           value={price.replace("$", "")}
      //           onChange={(e) => {
      //             const filteredValue = e.target.value.replace(/e/gi, '');
      //             setPrice("$" + formatPrice(filteredValue))
      //           }}
      //         />
      //       </div>
      //       <div className="form-group" style={{ position: "relative" }}>
      //         <label>Expiry</label>
      //         <input
      //           type="date"
      //           className="form-control"
      //           value={expiry}
      //           onChange={handleExpiryChange}
      //           min={getTodayDate()}
      //         />
      //         <i className="fa fa-calendar custom-date-icon" style={{ color: "black" }}></i>
      //       </div>
      //     </>
      //   );
      case "A4 BIG TICKET LANDSCAPE":
        return (
          <>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="productBrand" // Added name
                className="form-control"
                value={ticketData.productBrand || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productBrand",
                      value: BrandformatText(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <textarea
                name="productName"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productName || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 3 &&
                    lines.every((line) => line.length <= 25)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productName",
                        value: BigformatText(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 3 ||
                    (lines.length === 3 && lines[1].length > 25)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productName || "";
                  }
                }}
                rows="3" // Set to 2 rows to match the limit
                maxLength={75} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price" // Added name
                className="form-control"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </div>
            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
          </>
        );
      case "A4 TICKET - PERCENTAGE OFF":
        return (
          <>
            <div className="form-group">
              <label>Percent Off</label>
              <input
                name="percentOff"
                type="text"
                className="form-control"
                value={ticketData.percentOff?.replace("%", "") || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "percentOff",
                      value: PercentageformatText(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName" // Added name
                className="form-control"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatTextA4Ticket(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="productDesc"
                className="form-control"
                placeholder="Press Enter for a new line..."
                value={ticketData.productDesc || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const lines = inputValue.split("\n");

                  // Check for line count and character limits
                  if (
                    lines.length <= 2 &&
                    lines.every((line) => line.length <= 19)
                  ) {
                    handleTicketData({
                      target: {
                        name: "productDesc",
                        value: formatDescA4Ticket(inputValue),
                      },
                    });
                  } else if (
                    lines.length > 2 ||
                    (lines.length === 2 && lines[1].length > 19)
                  ) {
                    // Prevent entering a third line or exceeding 16 characters on the second line
                    e.target.value = ticketData.productDesc || "";
                  }
                }}
                rows="2" // Set to 2 rows to match the limit
                maxLength={39} // Set max length to 32 characters (16 chars x 2 lines)
              />
            </div>

            <div
              className="form-group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon-1"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  className="form-control date-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  min={getTodayDate()}
                />
                <i
                  className="fa fa-calendar custom-date-icon"
                  style={{ color: "black", zIndex: "1000" }}
                ></i>
              </div>
            </div>
          </>
        );
      default:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Product name"
                name="productName"
                value={ticketData.productName || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productName",
                      value: formatText(e.target.value),
                    },
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                name="productDesc"
                value={ticketData.productDesc || ""}
                onChange={(e) =>
                  handleTicketData({
                    target: {
                      name: "productDesc",
                      value: formatText(e.target.value),
                    },
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Price"
                name="price"
                value={
                  ticketData.price ? ticketData.price.replace("$", "") : ""
                }
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "price",
                      value: "$" + formatPrice(filteredValue),
                    },
                  });
                }}
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Rrp"
                name="rrp"
                value={ticketData.rrp || ""}
                onChange={(e) => {
                  const filteredValue = e.target.value.replace(/e/gi, "");
                  handleTicketData({
                    target: {
                      name: "rrp",
                      value: formatRrp(filteredValue),
                    },
                  });
                }}
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Save"
                name="save"
                disabled
                value={ticketData.save || ""}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Rrp option</InputLabel>
                <Select
                  label="Rrp option"
                  value={optionType}
                  onChange={handleOptionTypeChange}
                >
                  <MenuItem value="With RRP">With RRP + Save</MenuItem>
                  <MenuItem value="Without RRP">Without RRP + Save</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Offer type</InputLabel>
                <Select
                  label="Offer type"
                  value={offerType}
                  onChange={handleOfferTypeChange}
                >
                  <MenuItem value="TEMPORARY REVIVE OFFER">
                    Temporary Revive Offer
                  </MenuItem>
                  <MenuItem value="ONGOING REVIVE OFFER">
                    Ongoing Revive Offer
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {offerType !== "ONGOING REVIVE OFFER" && (
              <>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Start date"
                    InputLabelProps={{ shrink: true }}
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    inputProps={{ min: getTodayDate() }}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Expiry date"
                    InputLabelProps={{ shrink: true }}
                    name="expiry"
                    value={expiry}
                    onChange={handleExpiryChange}
                    inputProps={{ min: getTodayDate() }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        );
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    setExpiry(getTodayDate());
  }, []);

  useEffect(() => {
    setStartDate(getTodayDate());
  }, []);

  //handle expiry function
  const handleStartDateChange = (e) => {
    const inputValue = e.target.value;
    // eslint-disable-next-line no-unused-vars
    const [year, month, day] = inputValue.split("-");

    if (year.length > 4) {
      return;
    }

    // If there's an expiry date, check if the start date is within the valid range
    if (expiry && new Date(inputValue) > new Date(expiry)) {
      setDateError("Start date cannot be later than expiry date");
      setTimeout(() => setDateError(""), 3000);
      return;
    }

    setStartDate(inputValue);
    setDateError("");
  };

  const handleExpiryChange = (e) => {
    const inputValue = e.target.value;
    // eslint-disable-next-line no-unused-vars
    const [year, month, day] = inputValue.split("-");

    if (year.length > 4) {
      return;
    }

    setExpiry(inputValue);

    if (new Date(inputValue) <= new Date(startDate)) {
      setDateError("Expiry date must be later than start date");
      setTimeout(() => setDateError(""), 3000);
    } else {
      setDateError("");
    }
  };
  //handle radio button
  const handleOfferTypeChange = (e) => {
    setOfferType(e.target.value);
  };

  const handleOptionTypeChange = (e) => {
    setOptionType(e.target.value);
  };

  const handleValueTypeChange = (e) => {
    setValueType(e.target.value);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="tickets-create" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Revive Pharmacy Price Ticket Generator
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }} textAlign={"right"}>
                {role === "Admin" && (
                  <div className="ticket-category">
                    <Button
                      variant="contained"
                      component={Link}
                      to="/ticket-category"
                      sx={{ mr: 2 }}
                    >
                      Ticket Category
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/templates"
                    >
                      Manage Template Access
                    </Button>
                  </div>
                )}
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Typography className="section-heading" sx={{ my: 2 }}>
                  Select Ticket Template
                </Typography>
                <select
                  name="ticketTemplate"
                  className="filter"
                  onChange={(e) => {
                    setProductName("");
                    setproductBrand("");
                    setPrice("");
                    setRrp("");
                    setSave("");
                    setOfferType("");
                    setOptionType("");
                    setCopies(1);
                    ticketsCleared();
                    setTemplate(e.target.value);
                    setTicketData({});
                  }}
                  value={template}
                >
                  <option value="">
                    {template
                      ? `Selected: ${template}`
                      : "-- SELECT A TEMPLATE --"}
                  </option>
                  <option
                    style={{ fontWeight: "bold" }}
                    value="POPULAR TEMPLATES"
                  >
                    POPULAR TEMPLATES
                  </option>
                  <option
                    style={{ fontWeight: "bold" }}
                    value="OTHER FRAGRANCES"
                  >
                    OTHER FRAGRANCES
                  </option>

                  {/* General Templates */}
                  {assignedTickets
                    .filter(
                      (ticket) =>
                        !ticket.category.includes("POPULAR TEMPLATES") &&
                        !ticket.category.includes("OTHER FRAGRANCES")
                    )
                    .map((ticket, idx) => (
                      <option key={idx} value={ticket.ticket_name}>
                        {ticket.ticket_name}
                      </option>
                    ))}
                </select>

                {/* Other Fragrances Dropdown */}
                {(template === "OTHER FRAGRANCES" ||
                  assignedTickets.some(
                    (ticket) =>
                      ticket.category.includes("OTHER FRAGRANCES") &&
                      template === ticket.ticket_name
                  )) && (
                  <>
                    <Typography className="section-heading" sx={{ my: 2 }}>
                      Other Fragrances
                    </Typography>
                    <select
                      name="ticketTemplate"
                      className="filter"
                      onChange={(e) => {
                        setProductName("");
                        setproductBrand("");
                        setPrice("");
                        setRrp("");
                        setSave("");
                        setOfferType("");
                        setOptionType("");
                        setCopies(1);
                        ticketsCleared();
                        setTemplate(e.target.value);
                        setTicketData({});
                      }}
                      value={template}
                    >
                      <option value="">-- Select Other Fragrances --</option>
                      {assignedTickets
                        .filter((ticket) =>
                          ticket.category.includes("OTHER FRAGRANCES")
                        )
                        .map((ticket, idx) => (
                          <option key={idx} value={ticket.ticket_name}>
                            {ticket.ticket_name}
                          </option>
                        ))}
                    </select>
                  </>
                )}

                {/* Popular Templates Dropdown */}
                {(template === "POPULAR TEMPLATES" ||
                  assignedTickets.some(
                    (ticket) =>
                      ticket.category.includes("POPULAR TEMPLATES") &&
                      template === ticket.ticket_name
                  )) && (
                  <>
                    <Typography className="section-heading" sx={{ my: 2 }}>
                      Popular Templates
                    </Typography>
                    <select
                      name="ticketTemplate"
                      className="filter"
                      onChange={(e) => {
                        setProductName("");
                        setproductBrand("");
                        setPrice("");
                        setRrp("");
                        setSave("");
                        setOfferType("");
                        setOptionType("");
                        setCopies(1);
                        ticketsCleared();
                        setTemplate(e.target.value);
                        setTicketData({});
                      }}
                      value={template}
                    >
                      <option value="">-- Select Popular Templates --</option>
                      {assignedTickets
                        .filter((ticket) =>
                          ticket.category.includes("POPULAR TEMPLATES")
                        )
                        .map((ticket, idx) => (
                          <option key={idx} value={ticket.ticket_name}>
                            {ticket.ticket_name}
                          </option>
                        ))}
                    </select>
                  </>
                )}
                <Box
                  sx={{
                    height:
                      template === "HOT PRICE TAGS (RRP and non-RRP)" ||
                      template === "POPULAR TEMPLATES" ||
                      template === "OTHER FRAGRANCES" ||
                      template === ""
                        ? 755
                        : "",
                  }}
                >
                  <Typography className="section-heading" sx={{ my: 2 }}>
                    Enter Text Below
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      {successMessage && (
                        <div
                          className="alert alert-success"
                          style={{
                            position: "absolute",
                            top: "-50px",
                            width: "100%",
                          }}
                        >
                          {successMessage}
                        </div>
                      )}
                      {dateError && (
                        <div
                          className="alert error-message"
                          style={{
                            position: "absolute",
                            top: "-50px",
                            width: "100%",
                            color: "red",
                            backgroundColor: "#f7d7d7",
                          }}
                        >
                          {dateError}
                        </div>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>{renderFormFields()}</Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Copies"
                        placeholder="1"
                        inputProps={{
                          min: 0,
                          max: 99,
                        }}
                        className="ticket-copies-field"
                        value={copies}
                        onChange={handleCopiesChange}
                        disabled={
                          template === "" ||
                          template === "OTHER FRAGRANCES" ||
                          template === "POPULAR TEMPLATES"
                        }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        type="button"
                        variant="contained"
                        onClick={handleAddToQueue}
                        disabled={
                          copies === 0 ||
                          template === "" ||
                          template === "OTHER FRAGRANCES" ||
                          template === "POPULAR TEMPLATES"
                        }
                      >
                        Add to Queue
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="button"
                        variant="contained"
                        color="red"
                        fullWidth
                        disabled={
                          template === "" ||
                          template === "OTHER FRAGRANCES" ||
                          template === "POPULAR TEMPLATES"
                        }
                        onClick={() => {
                          setCopies(1);
                          setTicketData({
                            productName: "",
                            productDesc: "",
                            price: "",
                            rrp: "",
                            save: "",
                            copies: 1,
                          });
                          entriesCleared();
                        }}
                      >
                        Clear Entries
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        type="button"
                        variant="contained"
                        onClick={handleGenerateClick}
                        disabled={
                          template === "" ||
                          template === "OTHER FRAGRANCES" ||
                          template === "POPULAR TEMPLATES"
                        }
                      >
                        Generate Tickets
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        type="button"
                        variant="contained"
                        onClick={handlePrint}
                        disabled={
                          template === "" ||
                          template === "OTHER FRAGRANCES" ||
                          template === "POPULAR TEMPLATES"
                        }
                      >
                        Print
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, lg: 7 }}>
                <Typography className="section-heading">
                  PDF Live Preview
                </Typography>
                <PDFViewer
                  showToolbar={false}
                  style={{ width: "100%", height: 842 }}
                >
                  <MyDocument />
                </PDFViewer>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}
