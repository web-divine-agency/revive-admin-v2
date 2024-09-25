import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../../../App.css";
import "font-awesome/css/font-awesome.min.css";
import view_icon from "../../../assets/images/view_icon.png";
import edit_icon from "../../../assets/images/edit_icon.png";
import delete_icon from "../../../assets/images/delete_icon.png";
import man from "../../../assets/images/man.png";
import woman from "../../../assets/images/woman.png";
import check from "../../../assets/images/check.png";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance";

function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // success login swal
    if (localStorage.getItem("loginSuccess") === "true") {
      Swal.fire({
        title: "Login Successful",
        text: `Welcome`,
        imageUrl: check,
        imageWidth: 100,  
        imageHeight: 100, 
        confirmButtonText: "OK",
        confirmButtonColor: "#0ABAA6",
      });
  
      localStorage.removeItem("loginSuccess");
    }
  }, []);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await axiosInstance.get("/user"); // Adjust the endpoint if needed
        setLoggedInUser(response.data); // Assuming response contains user data
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        const formattedData = response.data.map(branch => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }));
        setBranches(formattedData);
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchSelect = (e) => {
    setSelectedBranchId(e.target.value);
  };

  useEffect(() => {
    // Filter users whenever the filter or search state changes
    const applyFilters = () => {
  
      if (!loggedInUser) return; 

    let tempUsers = users.filter(
      (user) => user.id !== loggedInUser.id);

      if (filter) {
        tempUsers = tempUsers.filter((user) => {
          if (filter === "Staff") return user.roles?.map((r) => r.role_name).join(", ") === "Staff";
          if (filter === "Admin") return user.roles?.map((r) => r.role_name).join(", ") === "Admin";
          return true;
        }, );
      }

      if (search) {
        tempUsers = tempUsers.filter((user) =>
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (selectedBranchId) {
        tempUsers = tempUsers.filter((user) =>
          user.branches?.some(branch => branch.id === parseInt(selectedBranchId))
        );
      }

      setFilteredUsers(tempUsers);
    };

    applyFilters();
  }, [filter, search, users, loggedInUser, selectedBranchId]);
  
  

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleEditUserClick = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDeleteUserClick = async (userId) => {
    if (loggedInUser && userId === loggedInUser.id) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Your Own Account',
        text: 'You cannot delete your own account.',
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-user/${userId}`);
          setUsers(users.filter((user) => user.id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
          Swal.fire({
            title: "Success!",
            text: "User has been deleted.",
            imageUrl: check,
            imageWidth: 100,  
            imageHeight: 100, 
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

  const columns = [
    {
      name: "Name",
      selector: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            className="profile-image"
            src={row.sex === "Male" ? man : woman}
            alt={row.last_name}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          {row.first_name} {row.last_name}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username || "N/A",
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branches?.map((r) => r.branch_name).join(", ") || "N/A", 
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.roles?.map((r) => r.role_name).join(", ") || "N/A",
      sortable: true,
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
            onClick={() =>
              handleViewClick({
                name: `${row.first_name} ${row.last_name}`,
                email: row.email,
                username: row.username,
                branch: row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
                role: row.roles?.map((r) => r.role_name).join(", ") || "N/A",
                profileImage: row.sex === "Male" ? man : woman,
              })
            }
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
          {loggedInUser && row.id !== loggedInUser.id && (
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
        )}
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Users List</h3>
          <div className="top-filter">
            <select
              name="filter"
              id="filter"
              value={filter}
              className="mr-4"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Users</option>
              <option value="Staff">Staffs</option>
              <option value="Admin">Admins</option>
            </select>
            <select
                name="filter"
                id="filter"
                value={selectedBranchId}
                onChange={handleBranchSelect}
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            <input
              id="search-bar"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => navigate("/add-new-user")}
              className="btn btn-primary float-end add-user-btn"
            >
              <i className="fa fa-plus"></i> Add New User
            </button>
          </div>
          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={filteredUsers}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20]}
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
            <div className="profile-container">
              <img
                src={selectedUser.profileImage}
                alt={selectedUser.name}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h2>{selectedUser.name}</h2>
              <div className="user-details">
                <h5>
                  Username:<p>{selectedUser.username}</p>
                </h5>
                <h5>
                  Role: <p>{selectedUser.role}</p>
                </h5>
                <h5>
                  Branch: <p>{selectedUser.branch}</p>
                </h5>
                <h5>
                  Email:<p>{selectedUser.email}</p>
                </h5>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default UsersList;
