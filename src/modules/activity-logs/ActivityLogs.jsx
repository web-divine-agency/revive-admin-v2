import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  Box,
  Chip,
  Container,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./ActivityLogs.scss";

import Global from "@/util/global";

import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "@/components/tables/TableDefault";

import LoggerService from "@/services/LoggerService";
import moment from "moment";

export default function ActivityLogs() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [logs, setLogs] = useState([]);

  const handleListLogs = (last, direction, show, find) => {
    LoggerService.list(
      {
        last: last || moment().format("YYYYMMDDhhmmss"),
        direction: direction || "next",
        show: show || 5,
        find: find || "",
      },
      authUser?.token
    )
      .then((response) => {
        setLogs(response.data.activity_logs);
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

  return (
    <React.Fragment>
      <Helmet>
        <title>Activity Logs | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="activity-logs" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Activity Logs
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={false}
                  data={logs}
                  tableName="activities"
                  header={["User", "Module", "Note", "Date", "User Status"]}
                  onChangeData={(last, direction, show, find) => {
                    handleListLogs(last, direction, show, find);
                  }}
                >
                  {logs?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {item.first_name} {item.last_name}
                      </TableCell>
                      <TableCell>{item.module}</TableCell>
                      <TableCell>{item.note}</TableCell>
                      <TableCell>
                        {moment(item.created_at).format(
                          "DD MMM, YYYY | hh:mm a"
                        )}
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Chip
                          label={!item.deleted_at ? "Active" : "Deactivated"}
                          color={!item.deleted_at ? "green" : "red"}
                        />
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
