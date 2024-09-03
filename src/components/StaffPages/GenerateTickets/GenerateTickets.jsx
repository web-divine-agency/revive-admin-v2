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
  const [productDesc, setproductDesc] = useState("");
  const [copies, setCopies] = useState(1);
  const [template, setTemplate] = useState("Small Tickets ($)");

  const getTicketStyle = () => {
    switch (template) {
      case "Big Tickets (P)":
        return {
          height: "510px",
          width: "500px",
          fontSize: "100px",
          paddingTop: "10rem",
        };
      case "Big Ticket (L)":
        return { height: "600px", width: "300px" };
      default:
        return { width: "150px" };
    }
  };

  const MyDocument = () => {
    const renderContent = () => {
      switch (template) {
        case "Small Tickets (%)":
          return (
            <>
              <Text className="percent-off">{percentOff}%</Text>
              <br />
              <Text className="prod-description">{productDesc}</Text>
              <br />

              <Text className="expiry">{expiry}</Text>
              <br />
            </>
          );
        case "Big Tickets (P)":
        case "Big Ticket (L)":
          return (
            <>
              <Text className="brand"> {productName}</Text>
              <br />
              <Text className="prod-name"> {productName}</Text>
              <br />
              <Text className="price">${price}</Text>
              <br />
              <Text className="expiry"> {expiry}</Text>
              <br />
            </>
          );
        default:
          return (
            <>
              <Text className="prod-name">{productName}</Text>
              <br />
              <Text className="price">${price}</Text>
              <br />
              <Text className="rrp">RRP ${rrp}</Text>
              <br />
              <Text className="save">Save ${save}</Text>
              <br />
              <Text className="expiry"> {expiry}</Text>
              <br />
            </>
          );
      }
    };

    return (
      <Document>
        <Page>
          <View className="ticket-container">
            {[...Array(copies)].map((_, index) => (
              <View
                className="square-ticket"
                key={index}
                style={getTicketStyle()}
              >
                {renderContent()}
              </View>
            ))}
          </View>
        </Page>
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
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
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
                {renderFormFields()}
                <label className="mb-2">Copies</label>
                <div className="d-flex justify-content-between">
                  <input
                    type="number"
                    placeholder="1"
                    min={0}
                    className="form-control ticket-copies-field"
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    className="btn btn-primary add-to-queue-btn"
                  >
                    Add to Queue
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary clear-btn"
                    onClick={() => {
                      setProductName("");
                      setPrice("");
                      setRrp("");
                      setSave("");
                      setExpiry("");
                      setCopies(1);
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
