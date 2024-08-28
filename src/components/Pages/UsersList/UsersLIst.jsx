import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import view_icon from '../../../assets/images/view_icon.png';
import edit_icon from '../../../assets/images/edit_icon.png';
import delete_icon from '../../../assets/images/delete_icon.png';
import man from '../../../assets/images/man.png';
import woman from '../../../assets/images/woman.png';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';


function UsersList() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);



  // View modal(user)
  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close view modal(user)
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //handle deleting of user
  const handleDeleteUserClick = () => {
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
      name: 'Name',
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className='profile-image'
            src={row.profileImage}
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

  // Table data
  const data = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      branch: 'Manila',
      role: 'Staff',
      profileImage: man,
      action: (
        <>
          <img
            src={view_icon}
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              name: 'John Doe',
              email: 'john@example.com',
              username: 'johndoe',
              branch: 'Manila',
              role: 'Staff',
              profileImage: man
            })}
            style={{ cursor: 'pointer' }}
          />
          <img className='ml-3' src={edit_icon} onClick={() => navigate("/edit-user")} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" onClick={handleDeleteUserClick} />
        </>
      )
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      username: 'janedoe',
      branch: 'Quezon City',
      role: 'Staff',
      profileImage: woman,
      action: (
        <>
          <img
            src={view_icon}
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              name: 'Jane Doe',
              email: 'jane@example.com',
              username: 'janedoe',
              branch: 'Quezon City',
              role: 'Staff',
              profileImage: woman
            })}
            style={{ cursor: 'pointer' }}
          />
          <img className='ml-3' src={edit_icon} onClick={() => navigate("/edit-user")} alt="edit" width="25" height="25" />
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" onClick={handleDeleteUserClick} />
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
            <select name="" id="filter">
              <option value="">All Users</option>
              <option value="">Staffs</option>
              <option value="">Admins</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' />
            <button onClick={() => navigate("/add-new-user")} className='btn btn-primary float-end add-user-btn'>
              <i className="fa fa-plus"></i> Add New User
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

      {/* View User Modal */}
      {selectedUser && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='profile-container'>
              <img
                src={selectedUser.profileImage}
                alt={selectedUser.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <h2>{selectedUser.name}</h2>
              <div className='user-details'>
                <h5>Username:<p>{selectedUser.username}</p></h5>
                <h5>Role: <p>{selectedUser.role}</p></h5>
                <h5>Branch: <p>{selectedUser.branch}</p></h5>
                <h5>Email:<p>{selectedUser.email}</p></h5>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

    </div>
  );
}

export default UsersList;
