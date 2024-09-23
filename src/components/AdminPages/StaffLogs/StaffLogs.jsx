import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import man from '../../../assets/images/man.png';
import check from "../../../assets/images/check.png";

import woman from '../../../assets/images/woman.png';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../../axiosInstance';
import Swal from 'sweetalert2'; // For alerts
import delete_icon from "../../../assets/images/delete_icon.png";


function StaffLogs() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLogs, setSelectedLogs] = useState([]); // To handle mass delete

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axiosInstance.get('/staffLogs');
        const formattedData = response.data.map(staff_logs => ({
          id: staff_logs.id,
          name: `${staff_logs.user.first_name} ${staff_logs.user.last_name}`,
          date: new Date(staff_logs.createdAt).toLocaleString(),
          role: staff_logs.user.roles[0]?.role_name || 'N/A',
          branch: staff_logs.user.branches?.map((r) => r.branch_name).join(", "),
          action: staff_logs.action,
          sex: staff_logs.user.sex
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchLogs();
  }, [navigate]);

  const handleDeleteLog = async (id) =>
  {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to revert this!.",
        showCancelButton: true,
        icon: 'warning',
        confirmButtonColor: "#EC221F",
        cancelButtonColor: "#00000000",
        cancelTextColor: "#000000",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          container: "custom-container",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
          title: "custom-swal-title",
        },
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`/delete-log/${id}`);
        setData(data.filter(log => log.id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'The staff log has been deleted.',
          imageUrl: check,
          imageWidth: 100,  
          imageHeight: 100, 
          confirmButtonText: 'OK',
          confirmButtonColor: '#0B3A07',
        });
      }
      
    } catch (error) {
      console.error('Error deleting staff log:', error);
      Swal.fire('Error!', 'Failed to delete the staff log.', 'error');
    }
  };

  const handleMassDelete = async () => {
    if (selectedLogs.length === 0) return;
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to revert this!.",
        showCancelButton: true,
        icon: 'warning',
        confirmButtonColor: "#EC221F",
        cancelButtonColor: "#00000000",
        cancelTextColor: "#000000",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          container: "custom-container",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
          title: "custom-swal-title",
        },
      });

      if (result.isConfirmed) {
        await axiosInstance.post('/mass-delete-logs', { ids: selectedLogs });
        setData(data.filter(log => !selectedLogs.includes(log.id)));
        setSelectedLogs([]); // Clear selection
        Swal.fire({
          title: 'Deleted!',
          text: 'Selected staff logs have been deleted.',
          imageUrl: check, 
          imageWidth: 100, 
          imageHeight: 100, 
          confirmButtonText: 'OK',
          confirmButtonColor: '#0ABAA6',
        });
      }
    } catch (error) {
      console.error('Error deleting staff logs:', error);
      Swal.fire('Error!', 'Failed to delete the selected staff logs.', 'error');
    }
  };

  const columns = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedLogs(prev =>
              checked ? [...prev, row.id] : prev.filter(id => id !== row.id)
            );
          }}
          checked={selectedLogs.includes(row.id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
    {
      name: "Name",
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
          {row.name}
        </div>
      ),
      sortable: true
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: true
    },
    {
      name: "Delete",
      button: true,
      cell: (row) => (
        <img
          className="ml-3"
          src={delete_icon} 
          title="Delete Log"
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteLog(row.id)} 
          alt="delete"
          width="25"
          height="25"
        />
      )
    }
    
  ];

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await axiosInstance.get("/user"); 
        setLoggedInUser(response.data); 
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    
    fetchLoggedInUser();
  }, []);

  const filteredData = data
  .filter(item => {
    // Apply role-based filtering from dropdown
    if (filter === 'Staffs') return item.role === 'Staff';
    if (filter === 'Admins') return item.role === 'Admin';
    return true;
  })
  .filter(item => {
    // Apply search-based filtering
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Staff Logs </h3>
          <div className='top-filter'>
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="">All Users</option>
              <option value="Staffs">Staffs</option>
              <option value="Admins">Admins</option>
            </select>
            <input
              id='search-bar'
              type="text"
              placeholder='Search'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="container-content">
            <button
              className="btn btn-danger m-3"
              onClick={handleMassDelete}
              disabled={selectedLogs.length === 0}
            >
              Delete Selected
            </button>
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