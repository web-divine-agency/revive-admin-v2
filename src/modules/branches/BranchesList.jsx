import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";

import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Branches.scss";

import Global from "@/util/global";

import { snackbar, toAmPm } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "@/components/tables/TableDefault";

import BranchService from "@/services/BranchService";

export default function BranchesList() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({});
  const [branchNames, setBranchNames] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState("");

  const [branchDetailsModalOpen, setBranchDetailsModalOpen] = useState(false);
  const [branchDeleteModalOpen, setBranchDeleteModalOpen] = useState(false);

  const formatAddress = (branch) => {
    const { address_line_1, address_line_2, city, state, zip_code } = branch;

    return [address_line_1, address_line_2, city, state, zip_code]
      .filter(Boolean)
      .join(", ");
  };

  const getStatus = (opening, closing) => {
    const now = moment();
    const open = moment(opening, "HH:mm");
    const close = moment(closing, "HH:mm");

    // Check if the current time is within the opening hours
    if (now.isBetween(open, close, null, "[)")) {
      return "Open";
    }
    return "Closed";
  };

  const handleListBranches = (last, direction, show, find) => {
    BranchService.list(
      {
        last: last || moment().format("YYYYMMDDhhmmss"),
        direction: direction || "next",
        show: show || 5,
        find: find || "",
        name: selectedBranchName,
      },
      authUser?.token
    )
      .then((response) => {
        setBranches(response.data.branches);
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  const handleAllBranches = () => {
    BranchService.all(authUser?.token)
      .then((response) => {
        setBranchNames(response.data.branches);
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          snackbar(error.message, "error", 3000);
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          snackbar("Oops! Something went wrong", "error", 3000);
        }
      });
  };

  useEffect(() => {
    handleAllBranches();
  }, []);

  useEffect(() => {
    handleListBranches();
  }, [selectedBranchName]);

  const filtersEl = (
    <React.Fragment>
      <Box sx={{ minWidth: 128 }} className="filter-el">
        <FormControl fullWidth size="small">
          <InputLabel id="branches-select-label">Branches</InputLabel>
          <Select
            labelId="branches-select-label"
            id="branches-select"
            value={selectedBranchName}
            label="Branches"
            onChange={(event) => {
              setSelectedBranchName(event.target.value);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {branchNames?.map((item, i) => (
              <MenuItem value={item.name} key={i}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </React.Fragment>
  );

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
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={true}
                  filters={filtersEl}
                  data={branches}
                  tableName="branches"
                  header={[
                    "Name",
                    "Address",
                    "Status",
                    "Operations",
                    "Actions",
                  ]}
                  onChangeData={(last, direction, show, find) => {
                    handleListBranches(last, direction, show, find);
                  }}
                >
                  {branches?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{formatAddress(item)}</TableCell>
                      <TableCell>
                        {toAmPm(item.opening)} - {toAmPm(item.closing)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatus(item.opening, item.closing)}
                          color={
                            getStatus(item.opening, item.closing) === "Open"
                              ? "green"
                              : "grey"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedBranch(item);
                              setBranchDetailsModalOpen(true);
                            }}
                          >
                            <VisibilityIcon color="green" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            component={Link}
                            to={`/branches/${selectedBranch.id}`}
                          >
                            <EditIcon color="blue" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedBranch(item);
                              setBranchDeleteModalOpen(true);
                            }}
                          >
                            <DeleteIcon color="red" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableDefault>
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
              {selectedBranch.name}
            </Typography>
            <Typography className="branch-address">
              {formatAddress(selectedBranch)}
            </Typography>
            <Typography className="branch-from">
              From: {toAmPm(selectedBranch.opening)}
            </Typography>
            <Typography className="branch-to">
              To: {toAmPm(selectedBranch.closing)}
            </Typography>
            <Typography className="branch-status"></Typography>
            <Chip
              label={getStatus(selectedBranch.opening, selectedBranch.closing)}
              color={
                getStatus(selectedBranch.opening, selectedBranch.closing) ===
                "Open"
                  ? "green"
                  : "grey"
              }
            />
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="black"
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
            <Button variant="contained" color="red" onClick={() => {}}>
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
