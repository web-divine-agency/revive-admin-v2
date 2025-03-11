import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "../../components/tables/TableDefault";

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);

  const handleListTickets = (page = 1, show = 10, find = "") => {
    console.log(page, show, find);
    setTickets([]);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Ticket List | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="users-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Tickets
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  component={Link}
                  to="/tickets/create"
                  variant="contained"
                >
                  Create New Tickets
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={false}
                  data={tickets}
                  tableName="roles"
                  header={["Name", "Description", "Actions"]}
                  onChangeData={(page, show, find) => {
                    handleListTickets(page, show, find);
                  }}
                >
                  {tickets?.list?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ width: "20%" }}>
                        <Typography>{item.role_name}</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "70%" }}>
                        <Typography>{item.role_description}</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Tooltip title="View" placement="top">
                          <IconButton onClick={() => {}}>
                            <VisibilityIcon color="green" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton onClick={() => {}}>
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
    </React.Fragment>
  );
}
