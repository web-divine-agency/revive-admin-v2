import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import man from '../../../assets/images/man.png';
import woman from '../../../assets/images/woman.png';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../../axiosInstance';

function StaffLogs() {
  const navigate = useNavigate();
  const[data, setData] = useState([]);
  const[filter, setFilter ] = useState('');
  const[search, setSearch] = useState('');


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axiosInstance.get('/staffLogs'); 
        const formattedData = response.data.map(staff_logs => ({
          id: staff_logs.id,
          name: `${staff_logs.user.first_name} ${staff_logs.user.last_name}`, 
          date: new Date(staff_logs.createdAt).toLocaleString(), 
          role: staff_logs.user.roles[0]?.role_name || 'N/A', 
          action: staff_logs.action
        }));
        setData(formattedData); 
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchLogs(); 
  }, [navigate]);

  
  const columns = [
    {
      name: "Name",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className='profile-image'
            src={row.sex === 'Male' ? man : woman}
            alt={row.last_name}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              marginRight: '10px'
            }}
          />
          {row.name}
        </div>
      ),
      sortable: true
    },
    {
      name:  "Date",
      selector: (row) => row.date,
      sortable: true
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: true
    }
  ];

  const filteredData = data.filter(item => {
    if (filter === 'Staffs') return item.role === 'Staff';
    if (filter === 'Admins') return item.role === 'Admin';
    return true;
  }).filter(item => item.name.toLowerCase().includes(search.toLowerCase()));


  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Staff Logs </h3>
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
              data={filteredData}
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

export default StaffLogs;
