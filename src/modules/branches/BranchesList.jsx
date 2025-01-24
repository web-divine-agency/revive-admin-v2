import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import DataTable from "react-data-table-component";

import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import "./Branches.scss";

import { snackbar, toAmPm } from "@/util/helper";

import { useLoader } from "@/components/loaders/LoaderContext";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import BranchService from "../../services/BranchService";
import Global from "../../util/global";

export default function BranchesList() {
  const navigate = useNavigate();

  const { setLoading } = useLoader();

  const { authUser } = useContext(Global);

  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({});
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [branchDetailsModalOpen, setBranchDetailsModalOpen] = useState(false);
  const [branchDeleteModalOpen, setBranchDeleteModalOpen] = useState(false);

  const handleListBranches = () => {
    setLoading(true);

    BranchService.list({}, authUser?.token)
      .then((response) => {
        let temp = response.data.map((item) => {
          return {
            id: item.id,
            branchName: item.branch_name,
            address: formatAddress(item.branch_address),
            operatingHours: JSON.parse(item.operating_hours),
            status: getBranchStatus({
              ...item,
              operatingHours: JSON.parse(item.operating_hours),
            }),
          };
        });

        setBranches(temp);
        setFilteredBranches(temp);
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          snackbar(error.response.data.msg, "error", 3000);
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatAddress = (address) => {
    return address
      .split(",") // Split the address into parts based on commas
      .map((part) => part.trim()) // Remove extra spaces from each part
      .filter((part) => part.length > 0) // Filter out empty parts
      .join(", "); // Join the remaining parts back together with a comma
  };

  useEffect(() => {
    handleListBranches();
  }, []);

  //filter branches
  useEffect(() => {
    const results = branches.filter(
      (branch) =>
        (selectedBranchId ? branch.id === parseInt(selectedBranchId) : true) &&
        (branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBranches(results);
  }, [searchTerm, branches, selectedBranchId]);

  const getBranchStatus = (branch) => {
    if (!branch.operatingHours || typeof branch.operatingHours !== "object") {
      return "Undefined";
    }
    const currentTime = new Date();
    const options = {
      timeZone: "Australia/Sydney",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const [hours, minutes, seconds] = formatter.format(currentTime).split(":");
    const currentSeconds =
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10);

    const openTime = branch.operatingHours.open.split(":");
    const closeTime = branch.operatingHours.close.split(":");

    const openSeconds =
      parseInt(openTime[0], 10) * 3600 +
      parseInt(openTime[1], 10) * 60 +
      parseInt(openTime[2] || 0, 10);
    let closeSeconds =
      parseInt(closeTime[0], 10) * 3600 +
      parseInt(closeTime[1], 10) * 60 +
      parseInt(closeTime[2] || 0, 10);

    if (closeSeconds < openSeconds) {
      closeSeconds += 24 * 3600;
    }

    return currentSeconds >= openSeconds && currentSeconds <= closeSeconds
      ? "Open"
      : "Closed";
  };

  const handleDeleteBranchClick = () => {
    try {
      console.log("delete");
    } catch (error) {
      console.error(error);
    }

    setBranchDeleteModalOpen(false);
    setBranches(branches.filter((branch) => branch.id !== selectedBranch.id));
  };

  // table columns
  const columns = [
    {
      name: "Branch",
      selector: (row) => row.branchName,
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
        if (typeof row.operatingHours === "object") {
          return `${toAmPm(row.operatingHours.open)} - ${toAmPm(
            row.operatingHours.close
          )}`;
        }
        return row.operatingHours;
      },
      sortable: false,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            color: row.status === "Open" ? "green" : "red",
            marginLeft: 0,
          }}
        >
          {row.status}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Actions",
      selector: (row) => (
        <div>
          <IconButton
            onClick={() => {
              setBranchDetailsModalOpen(true);
              setSelectedBranch(row);
            }}
            color="green"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(`/branches/${row.id}`)}
            color="blue"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setBranchDeleteModalOpen(true);
              setSelectedBranch(row);
            }}
            color="red"
          >
            <RemoveCircleIcon />
          </IconButton>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>Branches | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="branches-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Branches
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/branches/create"
                >
                  Add New Branch
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <select
                  name="filter"
                  className="filter"
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  value={selectedBranchId}
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Search Branch or Address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DataTable
                  className="dataTables_wrapper"
                  columns={columns}
                  data={filteredBranches}
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[20, 30]}
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Modal
        open={branchDetailsModalOpen}
        onClose={() => setBranchDetailsModalOpen(false)}
        className="branch-details-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-lg">
          <Box className="modal-header">
            <Typography>Branch Details</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="branch-name">
              {selectedBranch.branchName}
            </Typography>
            <Typography className="branch-address">
              {selectedBranch.address}
            </Typography>
            <Typography className="branch-from">
              From: {toAmPm(selectedBranch.operatingHours?.open)}
            </Typography>
            <Typography className="branch-to">
              To: {toAmPm(selectedBranch.operatingHours?.close)}
            </Typography>
            <Typography className="branch-status"></Typography>
            <Chip
              label={selectedBranch.status?.toUpperCase()}
              color={
                selectedBranch.status?.toLowerCase() === "open"
                  ? "green"
                  : "grey"
              }
            />
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="grey"
              onClick={() => setBranchDetailsModalOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
      <Modal
        open={branchDeleteModalOpen}
        onClose={() => setBranchDeleteModalOpen(false)}
        className="branch-delete-modal"
      >
        <Paper elevation={4} className="modal-holder modal-holder-sm">
          <Box className="modal-header">
            <Typography>Delete Branch</Typography>
          </Box>
          <Box className="modal-body">
            <Typography className="are-you-sure">Are you sure?</Typography>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              color="black"
              onClick={() => setBranchDeleteModalOpen(false)}
              className="mui-btn mui-btn-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={() => handleDeleteBranchClick()}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
