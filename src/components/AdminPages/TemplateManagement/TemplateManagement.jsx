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
import { useLoader } from "../../Loaders/LoaderContext";

function TemplateManagement() {
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
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  const [ticketTypes, setTicketTypes] = useState([]);

  const { setLoading } = useLoader();
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
      setLoading(true);
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        setRoles(response.data);
      } catch (error) {
        console.error(response.status.error);
      }
    };

    fetchUsers();
    fetchRoles();
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
        const response = await axiosInstance.get("/branches");
        const formattedData = response.data.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }));
        setBranches(formattedData);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchSelect = (e) => {
    setSelectedBranchId(e.target.value);
  };

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await axiosInstance.get("/ticketTypes");
        const formattedData = response.data.map((ticket_type) => ({
          id: ticket_type.id,
          ticket_type: ticket_type.ticket_type,
        }));
        setTicketTypes(formattedData);
        //console.log(ticketTypes);
      } catch (error) {
        console.error("Error fetching staff logs:", error);
      }
    };
    fetchTicketTypes();
  }, []);

  useEffect(() => {
    // Filter users whenever the filter or search state changes
    const applyFilters = () => {
      if (!loggedInUser) return;

      let tempUsers = users.filter(
        (user) =>
          user.id !== loggedInUser.id &&
          user.roles?.map((r) => r.role_name).join(", ") !== "Admin"
      );

      if (roleFilter) {
        tempUsers = tempUsers.filter(
          (user) =>
            user.roles?.map((r) => r.role_name).join(", ") === roleFilter
        );
      }

      if (search) {
        tempUsers = tempUsers.filter((user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }

      if (selectedBranchId) {
        tempUsers = tempUsers.filter((user) =>
          user.branches?.some(
            (branch) => branch.id === parseInt(selectedBranchId)
          )
        );
      }

      setFilteredUsers(tempUsers);
    };

    applyFilters();
  }, [filter, roleFilter, search, users, loggedInUser, selectedBranchId]);

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditAccessClick = (userId) => {
    navigate(`/assign-tickets/${userId}`);
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
      name: "Branch",
      selector: (row) =>
        row.branches?.map((r) => r.branch_name).join(", ") || "N/A",
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
            title="View Allowed Templates"
            alt="view"
            width="25"
            height="25"
            onClick={() =>
              handleViewClick({
                name: `${row.first_name} ${row.last_name}`,
                profileImage: row.sex === "Male" ? man : woman,
                ticket_type:
                  row.ticketTypes?.map((r) => r.ticket_type).join(", ") ||
                  "Default",
              })
            }
            style={{ cursor: "pointer" }}
          />

          <img
            className="ml-3"
            src={edit_icon}
            title="Edit Template Access"
            onClick={() => handleEditAccessClick(row.id)}
            alt="edit"
            width="25"
            height="25"
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Manage Staff Template Access</h3>
          <div className="top-filter">
            <select
              name="filter"
              className="mr-4"
              id="filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.role_name}>
                  {role.role_name}
                </option>
              ))}
            </select>
            <select
              name="filter"
              id="filter"
              value={selectedBranchId}
              onChange={handleBranchSelect}
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
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
        <Modal show={showModal} size="lg" onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="profile-container">
              <div className="profile-image">
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.name}
                  style={{
                    width: "170px",
                    height: "auto",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
               <center> <h2> {selectedUser.name} </h2></center> 
              </div>
             
              <div className="ticketTypeListContainer">
                <p> Allowed Templates: </p>
                <h5>
                  {selectedUser.ticket_type.split(",").map((type, index) => (
                    <p className="allowedTickets" key={index}>
                      {type.trim()}
                    </p>
                  ))}
                </h5>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default TemplateManagement;
