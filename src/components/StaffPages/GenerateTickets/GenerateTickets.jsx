import React from 'react';
import "../../../App.css";

function GenerateTickets() {
    return (
        <div className="container generate-ticket-container">
            <h3>Revive Pharmacy Price Ticket Generator</h3>
            <div className="col-md-12">
                <div className="row">
                    <div className="container-content">
                        <div>
                            <h5>Select Ticket Template</h5>
                            <select name="" id="">
                                <option value="">Small Tickets ($)</option>
                                <option value="">Small Tickets (%)</option>
                                <option value="">Big Tickets (P)</option>
                                <option value="">Big Ticket (L)</option>
                            </select>
                        </div>
                        <div className="col-md-5 p-3 mr-5 ticket-form">
                            <h5>Enter Text below</h5>
                            <form>
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" className='form-control' />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input type="number" className='form-control' />
                                </div>
                                <div className="form-group">
                                    <label>RRP</label>
                                    <input type="number" className='form-control' />
                                </div>
                                <div className="form-group">
                                    <label>Save</label>
                                    <input type="number" className='form-control' />
                                </div>
                                <div className="form-group">
                                    <label>Expiry</label>
                                    <input type="date" className='form-control' />
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <input type="number" className='form-control ticket-copies-field'/>
                                    <button className='btn btn-primary add-to-queue-btn'>Add to Queue</button>
                                    <button className='btn btn-primary clear-btn'>Clear Entries</button>

                                </div>
                            </form>

                        </div>
                        <div className="col-md-5">

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default GenerateTickets