import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import view_icon from '../../../assets/images/view_icon.png';
import edit_icon from '../../../assets/images/edit_icon.png';
import delete_icon from '../../../assets/images/delete_icon.png';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function UserRoleManagement() {
  const navigate = useNavigate();
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Modal view
  const handleViewClick = (role) => {
    setSelectedUserRole(role);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle deleting of user role
  const handleDeleteRoleClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this? This action can’t be undone",
      showCancelButton: true,
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#00000000",
      cancelTextColor: "#000000",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: 'custom-container',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        title: 'custom-swal-title',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ABAA6",
          customClass: {
            confirmButton: 'custom-success-confirm-button',
            title: 'custom-swal-title'
          }
        });
      }
    });
  };

  // Table columns
  const columns = [
    {
      name: 'Role',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Action',
      selector: row => row.action,
      sortable: false
    }
  ];

  // Table data
  const data = [
    {
      id: 1,
      name: 'Staff',
      action: (
        <>
          <img
            src={view_icon}
            title='View User Role Details'
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              name: 'Staff',
              permissions: ['Generate Ticket', 'View Ticket History', 'Manage Account'] // Use 'permissions'
            })}
            style={{ cursor: 'pointer' }}
          />
          <img
            className='ml-3'
            src={edit_icon}
            title='Edit User Role Details'
            onClick={() => navigate("/edit-user-role", { state: { roleData: { name: 'Staff', permissions: ['Manage Users', 'View Staff Logs', 'View Ticket History', 'View Users', 'Manage Account'] } } })}
            alt="edit"
            width="25"
            height="25"
          />
          <img className='ml-3' title='Delete User Role' src={delete_icon} onClick={handleDeleteRoleClick} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 2,
      name: 'Admin',
      action: (
        <>
          <img
            src={view_icon}
            title='View User Role Details'
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              name: 'Admin',
              permissions: ['Manage Users', 'View Staff Logs', 'View Ticket History', 'View Users', 'Manage Account'] // Use 'permissions'
            })}
            style={{ cursor: 'pointer' }}
          />
          <img
            className='ml-3'
            src={edit_icon}
            title='Edit User Role Details'
            onClick={() => navigate("/edit-user-role", { state: { roleData: { name: 'Admin', permissions: ['Manage Users', 'View Staff Logs', 'View Ticket History', 'View Users', 'Manage Account'] } } })}
            alt="edit"
            width="25"
            height="25"
          />
          <img className='ml-3' src={delete_icon} title='Delete User Role' onClick={handleDeleteRoleClick} alt="delete" width="25" height="25" />
        </>
      )
    }
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>User Role Management</h3>
          <div className='top-filter'>
            <select name="" id="">
              <option value="">All Users</option>
              <option value="">Staffs</option>
              <option value="">Admins</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' />
            <button onClick={() => navigate("/add-new-role")} className='btn btn-primary float-end add-user-btn'>
              <i className="fa fa-plus"></i> Add New Role
            </button>
          </div>
          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={data}
            />
          </div>
        </div>
      </div>

      {selectedUserRole && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Role Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='profile-container'>
              <h2>{selectedUserRole.name} Permissions</h2>
              
                {selectedUserRole.permissions.map((permission, index) => ( // Use 'permissions'
                  <p key={index}>{permission}</p>
                ))}
              
              <div className='user-details'>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default UserRoleManagement;
