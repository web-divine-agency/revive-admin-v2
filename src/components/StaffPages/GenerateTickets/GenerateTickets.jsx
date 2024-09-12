import React, { useState, useEffect } from "react";
import "../../../App.css";
import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import Swal from "sweetalert2";

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5Q.ttf' }, // normal weight
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 700 }, // bold weight
  ],
});


function GenerateTickets() {
  const [productName, setProductName] = useState("Product Name");
  const [price, setPrice] = useState("Price");
  const [rrp, setRrp] = useState("");
  const [save, setSave] = useState("");
  const [expiry, setExpiry] = useState("Expiry");
  const [percentOff, setpercentOff] = useState("Percent");
  const [productBrand, setproductBrand] = useState("Brand");
  const [productDesc, setproductDesc] = useState("Description");
  const [copies, setCopies] = useState(1);
  const [template, setTemplate] = useState("Small Tickets ($)");
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    if (localStorage.getItem('loginSuccess') === 'true') {
      Swal.fire({
        title: 'Login Successful',
        text: `Welcome`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0ABAA6'
      });
      localStorage.removeItem('loginSuccess');
    }
  }, []);

  //limit ng text 17chars per line
  const formatText = (text) => {
    const lines = [];
    for (let i = 0; i < text.length; i += 17) {
      lines.push(text.substring(i, i + 17));
    }
    return lines.join('\n');
  };


  const getTicketStyle = () => {
    switch (template) {
      case "Small Tickets (%)":
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "80px",
        };
      case "Big Tickets (P)":
      case "Big Ticket (L)":
        return {
          height: "auto",
          width: "550px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingBottom: "10px",
        };
      default:
        return {
          height: "auto",
          width: "185px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "30px",
          paddingBottom: "80px",
        };
    }
  };

  const MyDocument = () => {
    const renderContent = () => {
      // const commonStyle = {
      //   color: "#FFFFFF",
      // };
      switch (template) {
        case "Small Tickets (%)":
          return (
            <>
              <Text style={{ fontSize: "50px", fontFamily: "Roboto", fontWeight: 700 }}>
                {percentOff}<Text style={{ fontSize: "22px", fontFamily: "Roboto", fontWeight: 700 }}>OFF</Text>
              </Text>
              <Text style={{ fontSize: "17px", textAlign: "center", fontFamily: "Roboto", fontWeight: 700, textTransform: "uppercase" }}>
                {productDesc}
              </Text>
              <Text style={{ fontSize: "8px", textAlign: "center" }}>
              {"\n"}
              REVIVE OFFER AVAILABLE{"\n"}
                {expiry}
              </Text>
            </>
          );
        case "Big Tickets (P)":
        case "Big Ticket (L)":
          return (
            <>
              <Text style={{ fontSize: "72px", fontFamily: "Roboto", fontWeight: 700 }}>{productBrand}</Text>
              <Text style={{ fontSize: "45px", fontFamily: "Roboto", fontWeight: 700 }}>{productName}</Text>
              <Text style={{ fontSize: "180px",fontFamily: "Roboto", fontWeight: 700 }}>{price}</Text>
              <Text style={{ fontSize: "14px" }}>
                {expiry}
              </Text>
            </>
          );
        default:
          return (
            <>
              <Text style={{ fontSize: "16px", textTransform: "uppercase", fontFamily: "Roboto", fontWeight: 700 }}>
                {productName}
              </Text>
              <Text style={{ fontSize: 48, paddingBottom: 7, paddingTop: 7, fontFamily: "Roboto", fontWeight: 700 }}>{price}</Text>
              <Text style={{ fontSize: "10px", fontFamily: "Roboto", fontWeight: 700 }}>RRP ${rrp}</Text>
              <Text style={{ fontSize: "14px", fontFamily: "Roboto", fontWeight: 700 }}>Save ${save}</Text>
              <Text style={{ fontSize: "10px", textAlign: "center" }}>
                REVIVE OFFER AVAILABLE{"\n"}
                {expiry}
              </Text>
            </>
          );
      }
    };

    const getTicketContainers = () => {
      const containerGroups = [];
      const ticketStyle = getTicketStyle();
      let maxTicketsPerPage = template.includes("Big") ? 1 : 9;

      for (let i = 0; i < copies; i += maxTicketsPerPage) {
        const currentGroup = [...Array(Math.min(maxTicketsPerPage, copies - i))].map(
          (_, index) => (
            <View key={index} style={ticketStyle}>
              {renderContent()}
            </View>
          )
        );
        containerGroups.push(
          <View
            key={`container-${i}`}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: '20px',
              paddingBottom: '20px'
            }}
          >
            {currentGroup}
          </View>
        );
      }
      return containerGroups;
    };
   
    return (
      <Document>
        <Page size="A4">{getTicketContainers()}</Page>
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
                value={percentOff.replace('%', '')}
                onChange={(e) => setpercentOff(e.target.value + '%')}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input

                type="text"
                className="form-control"
                value={productDesc}
                onChange={(e) => setproductDesc(formatText(e.target.value))}
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
                onChange={(e) => setProductName(formatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price.replace('$', '')}
                onChange={(e) => setPrice('$' + e.target.value)}
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
                onChange={(e) => setProductName(formatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={price.replace('$', '')}
                onChange={(e) => setPrice('$' + e.target.value)}
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
    setTimeout(() => setSuccessMessage(""), 3000);
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
              <option value="Small Tickets ($)" >Small Tickets ($)</option>
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
                      setproductBrand("");
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
                  <PDFDownloadLink document={<MyDocument />} fileName="tickets.pdf">
                    {({ loading }) =>
                      loading ? "Loading document..." : "Generate Ticket"
                    }
                  </PDFDownloadLink>
                </button>
              </form>
            </div>

            <div className="col-md-6 ticket-view">
              <h5>PDF Preview</h5>
              <div className="pdf-preview">
                <PDFViewer showToolbar={false} style={{ width: '100%', height: '600px', scale: 1 }}>
                  <MyDocument />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;
