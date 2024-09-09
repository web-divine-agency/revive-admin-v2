import React, { useState } from "react";
import "../../../App.css";
import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";

function GenerateTickets() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [rrp, setRrp] = useState("");
  const [save, setSave] = useState("");
  const [expiry, setExpiry] = useState("");
  const [percentOff, setpercentOff] = useState("");
  const [productBrand, setproductBrand] = useState("");
  const [productDesc, setproductDesc] = useState("");
  const [copies, setCopies] = useState(1);
  const [template, setTemplate] = useState("Small Tickets ($)");
  const [successMessage, setSuccessMessage] = useState("");

  const getTicketStyle = () => {
    switch (template) {
      case "Small Tickets (%)":
        return {
          height: "165px",
          width: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid black",
          margin: "5px",

        };
      case "Big Tickets (P)":
      case "Big Ticket (L)":
        return {
          height: "510px",
          width: "500px",
          fontSize: "100px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          lineHeight: "60px"
        };
      default:
        return {
          height: "165px",
          width: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid black",
          margin: "5px",
        };
    }
  };

  const MyDocument = () => {
    const renderContent = () => {
      const commonStyle = {
        textAlign: "center",
        // fontWeight: "bolder",
      };
      switch (template) {
        case "Small Tickets (%)":
          return (
            <>
              <Text style={{ ...commonStyle, fontSize: "40px", lineHeight: "2px", fontWeight: "800" }}>
                {percentOff}%
              </Text>
              <br />
              <Text style={{ ...commonStyle, fontSize: "20px", lineHeight: "1px", fontWeight: "700" }}>
                {productDesc}
              </Text>
              <br />
              <Text
                style={{
                  ...commonStyle,
                  fontSize: "13px",
                  fontWeight: "lighter", lineHeight: "2px"
                }}
              >
                {expiry}
              </Text>
              <br />
            </>
          );
        case "Big Tickets (P)":
        case "Big Ticket (L)":
          return (
            <>

              <Text style={{ ...commonStyle, fontSize: "50px", lineHeight: "1px" }}>
                {productBrand}
              </Text>
              <br />

              <Text
                style={{
                  ...commonStyle,
                  fontSize: "70px",
                  lineHeight: "1px",
                }}
              >
                {productName}
              </Text>
              <br />
              <Text style={{ ...commonStyle, fontSize: "50px", lineHeight: "1px" }}>
                ${price}
              </Text>
              <br />
              <Text
                style={{
                  ...commonStyle,
                  fontSize: "18px",
                  fontWeight: "lighter", lineHeight: "1px"
                }}
              >
                {expiry}
              </Text>
              <br />

            </>
          );
        default:
          return (
            <>
              <Text style={{ ...commonStyle, fontSize: "15px", lineHeight: "1px" }}>
                {productName}
              </Text>
              <br />

              <Text style={{ ...commonStyle, fontSize: "40px", lineHeight: "1px" }}>${price}</Text>
              <br />
              <Text style={{ ...commonStyle, fontSize: "18px", lineHeight: "1px" }}>
                RRP ${rrp}
              </Text>
              <br />
              <Text style={{ ...commonStyle, fontSize: "20px", lineHeight: "1px" }}>
                Save ${save}
              </Text>
              <br />
              <Text
                style={{
                  ...commonStyle,
                  fontSize: "13px",
                  fontWeight: "lighter", lineHeight: "1px"
                }}
              >
                {expiry}
              </Text>
              <br />

            </>
          );
      }
    };

    const getTicketContainers = () => {
      const containerGroups = [];
      const ticketStyle = getTicketStyle();
      let maxTicketsPerPage;

      switch (template) {
        case "Small Tickets (%)":
          maxTicketsPerPage = 9;
          break;
        case "Big Tickets (P)":
        case "Big Ticket (L)":
          maxTicketsPerPage = 1;
          break;
        default:
          maxTicketsPerPage = 9;
          break;
      }

      for (let i = 0; i < copies; i += maxTicketsPerPage) {
        const currentGroup = [
          ...Array(Math.min(maxTicketsPerPage, copies - i)),
        ].map((_, index) => (
          <View key={index} style={ticketStyle}>
            {renderContent()}
          </View>
        ));

        containerGroups.push(
          <View
            key={`container-${i}`}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: "20px",
              position: "relative",
              border: "1px solid #000000",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: '20px',
              paddingBottom: '20px'
            }}
          >
            {currentGroup}
            {/* <Text className="page-style">
              Page {Math.floor(i / maxTicketsPerPage) + 1}
            </Text> */}
          </View>
        );
      }

      return containerGroups;
    };

    // const getTicketContainers = () => {
    //   const containerGroups = [];
    //   const ticketStyle = getTicketStyle();

    //   let maxTicketsPerPage;

    //   switch (template) {
    //     case "Small Tickets (%)":
    //       maxTicketsPerPage = 12;
    //       break;
    //     case "Big Tickets (P)":
    //     case "Big Ticket (L)":
    //       maxTicketsPerPage = 1;
    //       break;
    //     default:
    //       maxTicketsPerPage = 9; // default tempalte value
    //       break;
    //   }

    //   for (let i = 0; i < copies; i += maxTicketsPerPage) {
    //     const currentGroup = [
    //       ...Array(Math.min(maxTicketsPerPage, copies - i)),
    //     ].map((_, index) => (
    //       <View className="square-ticket" key={index} style={ticketStyle}>
    //         {renderContent()}
    //       </View>
    //     ));

    //     containerGroups.push(
    //       <View
    //         className="ticket-container mb-2"
    //         key={`container-${i}`}
    //         wrap={false}
    //         style={{ position: "relative" }}
    //       >
    //         {currentGroup}
    //         <Text className="page-style">
    //           Page {Math.floor(i / maxTicketsPerPage) + 1}
    //         </Text>
    //       </View>
    //     );
    //   }

    //   return containerGroups;
    // };

    return (
      <Document>
        <Page>{getTicketContainers()}</Page>
      </Document>
    );
  };

  const renderFormFields = () => {
    switch (template) {
      case "Small Tickets (%)":
        return (
          <>
            <div className="form-group">
              <label>Percent Off</label>
              <input
                type="number"
                className="form-control"
                value={percentOff}
                onChange={(e) => setpercentOff(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={productDesc}
                onChange={(e) => setproductDesc(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </>
        );
      case "Big Tickets (P)":
      case "Big Ticket (L)":
        return (
          <>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                className="form-control"
                value={productBrand}
                onChange={(e) => setproductBrand(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>RRP</label>
              <input
                type="number"
                className="form-control"
                value={rrp}
                onChange={(e) => setRrp(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Save</label>
              <input
                type="number"
                className="form-control"
                value={save}
                onChange={(e) => setSave(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="date"
                className="form-control"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </>
        );
    }
  };

  const entriesCleared = () => {
    setSuccessMessage("Entries cleared successfully.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  return (
    <div className="container generate-ticket-container">
      <div className="col-md-12">
        <div className="row pl-4">
          <h3>Revive Pharmacy Price Ticket Generator</h3>
          <div className="ticket-filter">
            <h5>Select Ticket Template</h5>
            <select
              name="ticketTemplate"
              id="ticketTemplate"
              onChange={(e) => setTemplate(e.target.value)}
              value={template}
            >
              <option value="Small Tickets ($)">Small Tickets ($)</option>
              <option value="Small Tickets (%)">Small Tickets (%)</option>
              <option value="Big Tickets (P)">Big Tickets (P)</option>
              <option value="Big Ticket (L)">Big Ticket (L)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="row">
          <div className="container-content">
            <div className="col-md-5 p-3 mr-5 ticket-form">
              <h5>Enter Text below</h5>

              <form>
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                {renderFormFields()}
                <label className="mb-2">Copies</label>
                <div className="d-flex justify-content-between">
                  <input
                    type="number"
                    placeholder="1"
                    min={1}
                    className="form-control ticket-copies-field"
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                  />
                  <button type="button" className="add-to-queue-btn">
                    Add to Queue
                  </button>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => {
                      setProductName("");
                      setPrice("");
                      setRrp("");
                      setSave("");
                      setExpiry("");
                      setCopies(1);
                      entriesCleared();
                    }}
                  >
                    Clear Entries
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-primary generate-tickets-btn"
                >
                  <PDFDownloadLink
                    document={<MyDocument />}
                    fileName="ticket.pdf"
                  >
                    {({ loading }) =>
                      loading ? (
                        "Loading PDF..."
                      ) : (
                        <span className="generate-ticket-text">
                          Generate Ticket
                        </span>
                      )
                    }
                  </PDFDownloadLink>
                </button>
              </form>
            </div>
            <div className="col-md-6 ticket-view">
              <h5>PDF Preview</h5>
              <div className="pdf-preview">
                <MyDocument />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;
