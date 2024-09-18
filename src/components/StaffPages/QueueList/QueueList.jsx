import React from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import printer from '../../../assets/images/printer.png';
import "font-awesome/css/font-awesome.min.css";
import view_icon from "../../../assets/images/view_icon.png";
import edit_icon from "../../../assets/images/edit_icon.png";


function QueueList() {
  

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
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <img
            src={view_icon}
            title="View User Details"
            alt="view"
            width="25"
            height="25"
            // onClick={() =>
            //   handleViewClick({
            //     name: `${row.first_name} ${row.last_name}`,
            //     email: row.email,
            //     username: row.username,
            //     branch: row.branch?.branch_name || "N/A",
            //     role: row.role?.role_name || "N/A",
            //     profileImage: row.sex === "Male" ? man : woman,
            //   })
            // }
            style={{ cursor: "pointer" }}
          />
          <img
            className="ml-3"
            src={edit_icon}
            title="Edit User Details"
            onClick={() => handleEditUserClick(row.id)}
            alt="edit"
            width="25"
            height="25"
          />
          <img
            className="ml-3"
            src={printer}
            title="Generate Ticket"
            alt="Generate-Ticket"
            width="25"
            height="25"
            // onClick={() => handleDeleteUserClick(row.id)}
            // style={{ cursor: "pointer" }}
          />
        </div>
      ),
      sortable: false,
    },
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
              paginationPerPage={10} 
              paginationRowsPerPageOptions={[10, 20]} 
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default QueueList;
