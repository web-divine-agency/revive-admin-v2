import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import "./Resources.scss";

import Global from "@/util/global";
import { snackbar } from "@/util/helper";

import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import TableDefault from "@/components/tables/TableDefault";

import ResourceService from "@/services/ResourceService";

export default function ResourceCategoriesList() {
  const navigate = useNavigate();

  const { authUser } = useContext(Global);

  const [resourceCategories, setResourceCategories] = useState([]);

  const [selectedResourceCategory, setSelectedResourceCategory] = useState({});

  const [
    // eslint-disable-next-line no-unused-vars
    resourceCategoryDetailsModalOpen,
    setResourceCategoryDetailsModalOpen,
  ] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [resourceCategoryDeleteModalOpen, setResourceCategoryDeleteModalOpen] =
    useState(false);

  const handleListResourceCategories = (
    page = 1,
    show = 10,
    find = "",
    sortBy = ""
  ) => {
    ResourceService.listCategories(
      {
        page: page,
        show: show,
        find: find,
        sort_by: sortBy,
      },
      authUser?.token
    )
      .then((response) => {
        setResourceCategories(response.data.resource_categories);
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
        <title>Resources | Revive Pharmacy </title>
      </Helmet>
      <NavTopbar />
      <NavSidebar />
      <Box component={"section"} id="resources-list" className="panel">
        <Container maxWidth="false">
          <Typography component={"h1"} className="section-title">
            Resource Categories
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  component={Link}
                  to="/resource-categories/create"
                  variant="contained"
                >
                  Create Resource Category
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  search={true}
                  pagination={true}
                  filter={false}
                  data={resourceCategories}
                  tableName="resource categories"
                  header={["Name", "Description", "Actions"]}
                  onChangeData={(page, show, find) =>
                    handleListResourceCategories(page, show, find)
                  }
                >
                  {resourceCategories?.list?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Tooltip title="View" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedResourceCategory(item);
                              setResourceCategoryDetailsModalOpen(true);
                            }}
                          >
                            <VisibilityIcon color="green" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            component={Link}
                            to={`/resource-categories/${selectedResourceCategory.id}`}
                          >
                            <EditIcon color="blue" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton
                            onClick={() => {
                              setSelectedResourceCategory(item);
                              setResourceCategoryDeleteModalOpen(true);
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
    </React.Fragment>
  );
}
