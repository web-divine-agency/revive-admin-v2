import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../../../App.css";
import "font-awesome/css/font-awesome.min.css";
import view_icon from "../../../assets/images/view_icon.png";
import edit_icon from "../../../assets/images/edit_icon.png";
import delete_icon from "../../../assets/images/delete_icon.png";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance";

function Branches() {
  const navigate = useNavigate();
  const[data, setData] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches'); 
        const formattedData = response.data.map(branches => ({
          branch_name: branches.branch_name,
          address: branches.branch_address,
          operating_hours: branches.operating_hours,
          status: branches.status,
          action: (
            <>
              <img
                src={view_icon}
                title="View Branch Details"
                alt="view"
                width="25"
                height="25"
                onClick={() => handleViewClick(branches)} 
                style={{ cursor: "pointer" }}
              />
              <img
                className="ml-3"
                src={edit_icon}
                title="Edit Branch Details"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate("/edit-branch", {
                    state: {
                      branchData: {
                        branch: branches.branch_name,
                        addressLine1: branches.branch_address,
                        operating_hours: branches.operating_hours,
                        status: branches.status
                      },
                    },
                  })
                }
                alt="edit"
                width="25"
                height="25"
              />
    
              <img
                className="ml-3"
                src={delete_icon}
                title="Delete Branch"
                style={{ cursor: "pointer" }}
                onClick={handleDeleteBranchClick}
                alt="delete"
                width="25"
                height="25"
              />
            </>
          )
          
        }));
        setData(formattedData); 
      } catch (error) {
        console.error('Error fetching staff logs:', error);
      }
    };
    fetchBranches(); 
  }, [navigate]);


  //modal view
  const handleViewClick = (branch) => {
    setSelectedBranches(branch);
    setShowModal(true);
  };
  //close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //handle deleting of branch
  const handleDeleteBranchClick = () => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0ABAA6",
          customClass: {
            confirmButton: "custom-success-confirm-button",
            title: "custom-swal-title",
          },
        });
      }
    });
  };

  //table columns
  const columns = [
    {
      name: "Branch",
      selector: (row) => row.branch_name,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Operating Hours",
      selector: (row) => {
        if(typeof row.operating_hours === 'object'){
          return `${row.operating_hours.open} - ${row.operating_hours.close}`;
        }
        return row.operating_hours;
      },
      sortable: false,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: false,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: false,
    },
  ];



  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Branches</h3>
          <div className="top-filter">
            <select name="" id="filter">
              <option value="">All Branch</option>
              <option value="">Manila</option>
              <option value="">Cebu</option>
            </select>
            <input id="search-bar" type="text" placeholder="Search" />
            <button
              onClick={() => navigate("/add-branch")}
              className="btn btn-primary float-end add-user-btn"
            >
              <i className="fa fa-plus"></i> Add New Branch
            </button>
          </div>
          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={data}
              pagination
              paginationPerPage={5} 
              paginationRowsPerPageOptions={[5, 10, 20]} 
            />
          </div>
        </div>
      </div>

      {selectedBranches && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Branch Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="branch-container">
              <h2>{selectedBranches.branch_name}</h2>
              <h5>Full Address:</h5>
              <p>{selectedBranches.branch_address}</p>
              <h5>Operating Hours</h5>
              <p>
               Open: {selectedBranches.operating_hours?.open} - Close: {selectedBranches.operating_hours?.close}
              </p>
              <h5>Status</h5>
              <p>{selectedBranches.status}</p>
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

export default Branches;
