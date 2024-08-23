import React from 'react';
import DataTable from 'react-data-table-component'
import '../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import view_icon from '../../assets/images/view_icon.png';
import edit_icon from '../../assets/images/edit_icon.png';
import delete_icon from '../../assets/images/delete_icon.png';

function UsersList() {
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true
    },
    {
      name: 'Branch',
      selector: row => row.branch,
      sortable: true
    },
    {
      name: 'Action',
      selector: row => row.action,
      sortable: false
    }
  ];

  const data = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      branch: 'Manila',
      action: (
        <>
          <img src={view_icon} alt="view" width="25" height="25" />
          <img className='ml-3' src={edit_icon} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      username: 'janedoe',
      branch: 'Manila',
      action: (
        <>
          <img src={view_icon} alt="view" width="25" height="25" />
          <img className='ml-3' src={edit_icon} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 3,
      name: 'David Smith',
      email: 'david@example.com',
      username: 'davidsmit',
      branch: 'Manila',
      action: (
        <>
          <img src={view_icon} alt="view" width="25" height="25" />
          <img className='ml-3' src={edit_icon} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      username: 'sarahjohnson',
      branch: 'Manila',
      action: (
        <>
          <img src={view_icon} alt="view" width="25" height="25" />
          <img className='ml-3' src={edit_icon} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael@example.com',
      username: 'michaelbrown',
      branch: 'Manila',
      action: (
        <>
          <img src={view_icon} alt="view" width="25" height="25" />
          <img className='ml-3' src={edit_icon} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    }
  ];
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Users List</h3>
          <div className='top-filter'>
            <select name="" id="">
              <option value="">All Users</option>
              <option value="">Staffs</option>
              <option value="">Admins</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' />
            <button className='btn btn-primary float-end add-user-btn'> <i className="fa fa-plus"></i>Add New User</button>
          </div>
          <div className="data-table-container">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={data}
            ></DataTable>
          </div>
        </div>
      </div>
    </div>

  );
}

export default UsersList;
