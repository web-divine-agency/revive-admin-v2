import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";

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
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import "./Resources.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "@/components/tables/TableDefault";

import ResourceService from "@/services/ResourceService";

function ResourcesLists() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [searchParams] = useSearchParams();

  const [resources, setResources] = useState([]);

  const handleListResources = (last, direction, show, find) => {
    ResourceService.list(
      {
        category_id: searchParams.get("category_id"),
        last: last || moment().format("YYYYMMDDHHmmss"),
        direction: direction || "next",
        show: show || 10,
        find: find || "",
      },
      authUser?.token
    )
      .then((response) => {
        setResources(response.data.resources);
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
    handleListResources();
  }, []);

  useEffect(() => {
    handleListResources();
  }, [searchParams]);

  return (
    <React.Fragment>
      <Helmet>
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="resources-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            {decodeURI(searchParams.get("category_name"))}
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Go Back
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={false}
                  data={resources}
                  tableName="resources"
                  header={[
                    "Title",
                    "Author",
                    "Status",
                    "Last Update",
                    "Actions",
                  ]}
                  onChangeData={(last, direction, show, find) =>
                    handleListResources(last, direction, show, find)
                  }
                >
                  {resources?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        {item.first_name} {item.last_name}
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        {moment(item.updatedAt).format("D MMM, YYYY | hh:mm a")}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View" placement="top">
                          <IconButton
                            component={Link}
                            to={`/resources/${item.slug}`}
                          >
                            <VisibilityIcon color="green" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            component={Link}
                            to={`/resources/${item.slug}/update`}
                          >
                            <EditIcon color="blue" />
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

export default ResourcesLists;
