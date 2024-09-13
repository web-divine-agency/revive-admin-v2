import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import view_icon from '../../../assets/images/view_icon.png';
import edit_icon from '../../../assets/images/edit_icon.png';
import delete_icon from '../../../assets/images/delete_icon.png';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosInstance from "../../../../axiosInstance";




function UserRoleManagement() {
  const navigate = useNavigate();
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  //get all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        setRoles(response.data);

        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchRoles();
  }, [navigate]);

  //delete users 
  const handleDeleteUserClick = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this? This action can’t be undone",
      showCancelButton: true,
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-role/${userId}`);
          setRoles(users.filter((user) => user.id !== userId));
          Swal.fire({
            title: "Success!",
            text: "User has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#0ABAA6",
            customClass: {
              confirmButton: "custom-success-confirm-button",
              title: "custom-swal-title",
            },
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the user.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#EC221F",
            customClass: {
              confirmButton: "custom-error-confirm-button",
              title: "custom-swal-title",
            },
          });
        }
      }
    });
  };
  // Modal view
  const handleViewClick = (role) => {
    setSelectedUserRole(role);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };


  // Table columns
  const columns = [
    {
      name: 'Role',
      selector: row => row.role_name,
      sortable: true
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <img
            src={view_icon}
            title="View Role Details"
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
            // onClick={() => handleEditUserClick(row.id)}
            alt="edit"
            width="25"
            height="25"
          />
          <img
            className="ml-3"
            src={delete_icon}
            title="Delete User"
            alt="delete"
            width="25"
            height="25"
            onClick={() => handleDeleteUserClick(row.id)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
      sortable: false,
    },
  ];

  // Table data
  // const data = [
  //   {
  //     id: 1,
  //     name: 'Staff',
  //     action: (
  //       <>
  //         <img
  //           src={view_icon}
  //           title='View User Role Details'
  //           alt="view"
  //           width="25"
  //           height="25"
  //           onClick={() => handleViewClick({
  //             name: 'Staff',
  //             permissions: ['Generate Ticket', 'View Ticket History', 'Manage Account'] // Use 'permissions'
  //           })}
  //           style={{ cursor: 'pointer' }}
  //         />
  //         <img
  //           className='ml-3'
  //           src={edit_icon}
  //           title='Edit User Role Details'
  //           onClick={() => navigate("/edit-user-role", { state: { roleData: { name: 'Staff', permissions: ['Manage Users', 'View Staff Logs', 'View Ticket History', 'View Users', 'Manage Account'] } } })}
  //           alt="edit"
  //           width="25"
  //           height="25"
  //         />
  //         <img className='ml-3' title='Delete User Role' src={delete_icon} onClick={handleDeleteRoleClick} alt="delete" width="25" height="25" />
  //       </>
  //     )
  //   },
  //   {
  //     id: 2,
  //     name: 'Admin',
  //     action: (
  //       <>
  //         <img
  //           src={view_icon}
  //           title='View User Role Details'
  //           alt="view"
  //           width="25"
  //           height="25"
  //           onClick={() => handleViewClick({
  //             name: 'Admin',
  //             permissions: ['Manage Users', 'View Staff Logs', 'View Ticket History', 'View Users', 'Manage Account'] // Use 'permissions'
  //           })}
  //           style={{ cursor: 'pointer' }}
  //         />
  //         <img
  //           className='ml-3'
  //           src={edit_icon}
  //           title='Edit User Role Details'
  //           onClick={() => navigate("/edit-user-role", { state: { roleData: { name: 'Admin', permissions: ['Manage Users', 'View Staff Logs', 'View Ticket History', 'View Users', 'Manage Account'] } } })}
  //           alt="edit"
  //           width="25"
  //           height="25"
  //         />
  //         <img className='ml-3' src={delete_icon} title='Delete User Role' onClick={handleDeleteRoleClick} alt="delete" width="25" height="25" />
  //       </>
  //     )
  //   }
  // ];

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
              data={roles}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 20]}
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
