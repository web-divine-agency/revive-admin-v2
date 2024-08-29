import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../App.css';
import 'font-awesome/css/font-awesome.min.css';
import view_icon from '../../../assets/images/view_icon.png';
import edit_icon from '../../../assets/images/edit_icon.png';
import delete_icon from '../../../assets/images/delete_icon.png';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'


function Branches() {
  const navigate = useNavigate();
  const [selectedBranches, setSelectedBranches] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //modal view
  const handleViewClick = (role) => {
    setSelectedBranches(role);
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


  //table columns
  const columns = [
    {
      name: 'Branch',
      selector: row => row.branch,
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: false
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
      branch: 'Manila',
      status: 'Open',
      action: (
        <>
          <img
            src={view_icon}
            title='View Branch Details'
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              branch: 'Manila',
              address: '1234 Market Street, Tondo, 2112',
              operatingHours: ['Monday - Friday: 9:00 AM - 9:00 PM', 'Saturday: 10:00 AM - 8:00 PM', 'Sunday : Close'],
              staffLists: ['Jane Doe/Staff', 'John Doe/Staff']
            })}
            style={{ cursor: 'pointer' }}
          />
          <img
            className='ml-3'
            src={edit_icon}
            title='Edit Branch Details'
            onClick={() => navigate("/edit-branch", {
              state: {
                branchData: {
                  branch: 'Cebu',
                  addressLine1: 'Purok 3', addressLine2: 'Market Place', city: 'Cebu', state: 'Cebu City'
                }, zipCode: 1000, country: 'Philippines'
              }
            })}
            alt="edit"
            width="25"
            height="25"
          />

          <img className='ml-3' src={delete_icon} title='Delete Branch' onClick={handleDeleteBranchClick} alt="delete" width="25" height="25" />
        </>
      )
    },
    {
      id: 2,
      branch: 'Cebu',
      status: 'Close',
      action: (
        <>
          <img
            src={view_icon}
            title='View Branch Details'
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick({
              branch: 'Cebu',
              address: '1234Magallanes Street Street, Cebu city, 2112',
              operatingHours: ['Monday - Friday: 9:00 AM - 9:00 PM', 'Saturday: 10:00 AM - 8:00 PM', 'Sunday : Close'],
              staffLists: ['Jane Doe/Staff', 'John Doe/Staff']
            })}
            style={{ cursor: 'pointer' }}
          />
          <img
            className='ml-3'
            src={edit_icon}
            title='Edit Branch Details'
            onClick={() => navigate("/edit-branch", {
              state: {
                branchData: {
                  branch: 'Manila',
                  addressLine1: 'Purok 3', addressLine2: 'Market Place', city: 'Manila', state: 'Metro Manila'
                }, zipCode: 1096, country: 'Philippines'
              }
            })}
            alt="edit"
            width="25"
            height="25"
          />

          <img className='ml-3' src={delete_icon} title='Delete Branch' onClick={handleDeleteBranchClick} alt="delete" width="25" height="25" />
        </>
      )
    }
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Branches</h3>
          <div className='top-filter'>
            <select name="" id="">
              <option value="">All Branch</option>
              <option value="">Manila</option>
              <option value="">Cebu</option>
            </select>
            <input id='search-bar' type="text" placeholder='Search' />
            <button onClick={() => navigate("/add-branch")} className='btn btn-primary float-end add-user-btn'>
              <i className="fa fa-plus"></i> Add New Branch
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

      {selectedBranches && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Branch Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='branch-container'>
              <h2>{selectedBranches.branch}</h2>
              <h5>Full Address:</h5>
              <p>{selectedBranches.address}</p>
              <h5>Operating Hours</h5>
              <p>
                {selectedBranches.operatingHours.map((operatingHours, index) => (
                  <p key={index}>{operatingHours}</p>
                ))}
              </p>
              <h5>Staff Lists</h5>
              <p>
                {selectedBranches.staffLists.map((staffLists, index) => (
                  <p key={index}>{staffLists}</p>
                ))}
              </p>
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

export default Branches;
