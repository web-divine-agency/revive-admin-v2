import React, { useState } from 'react';
import "../../../App.css";
import { Document, Page, Text, View, PDFDownloadLink } from '@react-pdf/renderer';

function GenerateTickets() {
    // State hooks to store form input values
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [rrp, setRrp] = useState('');
    const [save, setSave] = useState('');
    const [expiry, setExpiry] = useState('');
    const [copies, setCopies] = useState(1);

    // Create a PDF document component
    const MyDocument = () => (
        <Document>
            <Page>
                <View className="ticket-container">
                    {[...Array(copies)].map((_, index) => (
                        <div className='square-ticket' key={index}>
                            <Text className="prod-name">{productName}</Text><br />
                            <Text className="price">${price}</Text><br />
                            <Text className="rrp">RRP ${rrp}</Text><br />
                            <Text className="save">SAVE ${save}</Text><br />
                            <Text className="expiry">Expiry {expiry}</Text><br />
                        </div>
                    ))}
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="container generate-ticket-container">
            <div className="col-md-12">
                <div className="row pl-4">
                    <h3>Revive Pharmacy Price Ticket Generator</h3>
                    <div className='ticket-filter'>
                        <h5>Select Ticket Template</h5>
                        <select name="" id="">
                            <option value="">Small Tickets ($)</option>
                            <option value="">Small Tickets (%)</option>
                            <option value="">Big Tickets (P)</option>
                            <option value="">Big Ticket (L)</option>
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
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        className='form-control'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>RRP</label>
                                    <input
                                        type="number"
                                        className='form-control'
                                        value={rrp}
                                        onChange={(e) => setRrp(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Save</label>
                                    <input
                                        type="number"
                                        className='form-control'
                                        value={save}
                                        onChange={(e) => setSave(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expiry</label>
                                    <input
                                        type="date"
                                        className='form-control'
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    />
                                </div>
                                <label className='mb-2'>Copies</label>
                                <div className='d-flex justify-content-between'>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        className='form-control ticket-copies-field'
                                        value={copies}
                                        onChange={(e) => setCopies(Number(e.target.value))}
                                    />
                                    <button className='btn btn-primary add-to-queue-btn'>Add to Queue</button>
                                    <button className='btn btn-primary clear-btn'>Clear Entries</button>
                                </div>
                                <button className='btn btn-primary generate-tickets-btn'>
                                    <PDFDownloadLink document={<MyDocument />} fileName="ticket.pdf">
                                        {({ loading }) => (loading ? 'Loading PDF...' : 'Generate Ticket')}
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
