import React from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';


function History() {
  

  //table columns
  const columns = [
    
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true
    },
   
    {
      name: 'Ticket Type',
      selector: row => row.ticketType,
      sortable: true
    },
    {
      name: 'Product Name',
      selector: row => row.productName,
      sortable: true
    }
  ];

  //table data
  const data = [
    {
      id: 1,
      date: '28/08/2024 2:09 pm',
      ticketType: 'Small Ticket ($)',
      productName: 'Catalogue Special',

      
    },
    {
      id: 2,
      date: '28/08/2024 10:30 am',
      ticketType: 'Small Ticket (%)',
      productName: 'Catalogue Special',
      
     
    }
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Tickets History List</h3>
          <div className='top-filter'>
            <select name="" id="filter">
              <option value="">All tickets</option>
              <option value="">Small Ticket</option>
              <option value="">Big Ticket</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' />
           
          </div>
          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={data}
              pagination
              paginationPerPage={5} 
              paginationRowsPerPageOptions={[5, 10, 20]} 
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default History;
