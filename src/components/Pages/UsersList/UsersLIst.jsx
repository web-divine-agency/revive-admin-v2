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

function UsersList() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
          <img className='ml-3' src={delete_icon} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      username: 'janedoe',
      branch: 'Quezon City',
      role: 'Admin',
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
              role: 'Admin',
              profileImage: woman
            })}
            style={{ cursor: 'pointer' }}
          />
          <img className='ml-3' src={edit_icon} onClick={() => navigate("/edit-user")} alt="edit" width="25" height="25" />
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
              {/* <p>Username: <br /> {selectedUser.username} </p>
              
              <p>Role: <br /> {selectedUser.role}</p>
              <p>Email: <br />{selectedUser.email}</p>
              <p>Branch: <br />{selectedUser.branch}</p> */}

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

export default UsersList;
