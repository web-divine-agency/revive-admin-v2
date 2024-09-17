import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import man from '../../../assets/images/man.png';
import woman from '../../../assets/images/woman.png';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../../axiosInstance';
import {format} from 'date-fns';

function TicketsHistory() {
  const navigate = useNavigate();
  const[data, setData] = useState([]);
  const[filter, setFilter ] = useState('');
  const[search, setSearch] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/tickets'); 
        const formattedData = response.data.map(tickets => ({
          ticketType: tickets.ticketType.ticket_type,
          product_id: tickets.product.product_name,
          data: tickets.data, 
          user_id: `${tickets.user.first_name} ${tickets.user.last_name}`,
          branch_id: tickets.branch.branch_name,
          date: new Date(tickets.createdAt)
        }));
        setData(formattedData); 
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchTickets(); 
  }, [navigate]);
 
  const columns = [
    {
      name: "User",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className='profile-image'
            src={row.sex === 'Male' ? man : woman}
            alt={row.name}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              marginRight: '10px'
            }}
          />
          {row.user_id}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => format(row.date, 'MMM dd, yyyy hh:mm a'), // Format using date-fns
      sortable: true
    },
    {
      name: "Branch",
      selector: (row) => row.branch_id,
      sortable: true
    },
    {
      name: "Ticket Type",
      selector: (row) => row.ticketType,
      sortable: true
    },
    {
      name: "Product",
      selector: (row) => row.product_id,
      sortable: true
    },
    {
      name: "View Ticket",  // jsonb data field
      selector: (row) => {
        // Display jsonb field appropriately
        if (typeof row.data === 'object') {
          return JSON.stringify(row.data); // You can format this for better display
        }
        return row.data;
      },
      sortable: false
    },
 
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Tickets History List</h3>
          <div className='top-filter'>
          <select name="filter" id="filter" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Users</option>
              <option value="">Staffs</option>
              <option value="">Admins</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' value={search} onChange={e => setSearch(e.target.value)} />
           
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

export default TicketsHistory;
