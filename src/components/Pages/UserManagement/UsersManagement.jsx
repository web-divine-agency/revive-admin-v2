import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import view_icon from '../../../assets/images/view_icon.png';
import edit_icon from '../../../assets/images/edit_icon.png';
import delete_icon from '../../../assets/images/delete_icon.png';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

function UserRoleManagement() {
  const navigate = useNavigate();
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

//modal view
  const handleViewClick = (user) => {
    setSelectedUserRole(user);
    setShowModal(true);
  };
//close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

//table columns
  const columns = [
    {
      name: 'Name',
      selector: row =>  row.name,
      sortable: true
    },
    {
      name: 'Action',
      selector: row => row.action,
      sortable: false
    }
  ];

//table data
  const data = [
    {
      id: 1,
      name: 'Staff',
      branch: 'Manila',
      role: 'Staff',
      action: (
        <>
          <img
            src={view_icon}
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              name: 'Staff',
            })}
            style={{ cursor: 'pointer' }}
          />
          <img className='ml-3' src={edit_icon} onClick={() => navigate("#")} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 2,
      name: 'Admin',
      branch: 'Quezon City',
      role: 'Admin',
      action: (
        <>
          <img
            src={view_icon}
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              name: 'Admin',
            })}
            style={{ cursor: 'pointer' }}
          />
          <img className='ml-3' src={edit_icon} onClick={() => navigate("#")} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
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
              <h2>{selectedUserRole.name}</h2>
              <div className='user-details'>
           



              </div>
             

            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
}

export default UserRoleManagement;
