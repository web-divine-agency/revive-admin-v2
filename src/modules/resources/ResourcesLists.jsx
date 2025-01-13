import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import video_play_icon from "../../../assets/images/playbutton.svg";
// import images_outline from "../../../assets/images/images-outline.svg";
// import filetype_pdf from "../../../assets/images/filetype-pdf.svg";

import axiosInstance from "@/services/axiosInstance.js";
import "./Resources.scss";
import { Helmet } from "react-helmet";
import NavTopbar from "@/components/navigation/NavTopbar";
import NavSidebar from "@/components/navigation/NavSidebar";
import {
  Box,
  Button,
  Container,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import TableDefault from "@/components/tables/TableDefault";
import moment from "moment";

function ResourcesLists() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState({});

  const [resources, setResources] = useState({});

  // eslint-disable-next-line no-unused-vars
  const handleListResources = (page = 1, show = 10) => {
    axiosInstance
      .get("/all-resources")
      .then((response) => {
        setResources({
          todo: "this response is dull",
          list: response.data?.resource_data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReadUser = () => {
    axiosInstance
      .get("/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    handleListResources();
    handleReadUser();
  }, []);

  useEffect(() => {
    handleListResources();
  }, [searchParams]);

  // const handleViewResource = (resourceID, slug) => {
  //   if (role === "Admin") {
  //     navigate(`/view-resource/${resourceID}`);
  //   } else if (role === "Staff") {
  //     navigate(`/staff-view-resource/${slug}`);
  //   }
  // };

  // const renderResourceCard = (resource) => {
  //   const hasVideoContent = resource?.resource_media.some((item) =>
  //     item.endsWith(".mp4")
  //   );
  //   const hasPDFContent = resource?.resource_media.some((item) =>
  //     item.endsWith(".pdf")
  //   );
  //   // filetype_pdf
  //   return (
  //     <div
  //       key={resource.id}
  //       className="resources-card"
  //       onClick={() => handleViewResource(resource.id, resource.resource_link)}
  //       style={{ cursor: "pointer" }}
  //     >
  //       {/* {`https://dev.server.revivepharmacyportal.com.au/uploads/${resource?.resource_media[0]}`} */}
  //       <div
  //         className="card"
  //         style={{
  //           backgroundImage:
  //             "url('https://dev.server.revivepharmacyportal.com.au/uploads/" +
  //             resource?.resource_media[0] +
  //             "')",
  //         }}
  //       >
  //         <div className="card-body">
  //           <div>
  //             <h5 className="card-title">{resource.resource_title}</h5>
  //             <p className="card-text author-card">
  //               Author:{" "}
  //               {resource.user
  //                 ? `${resource.user.first_name} ${resource.user.last_name}`
  //                 : "Unknown"}
  //             </p>

  //             {(() => {
  //               if (hasVideoContent) {
  //                 return (
  //                   <div className="contentBadgeCard">
  //                     <img
  //                       className="video_play_icon"
  //                       src={video_play_icon}
  //                       alt="No Media"
  //                       width="100%"
  //                       height="200"
  //                     />
  //                   </div>
  //                 );
  //               } else if (hasPDFContent) {
  //                 return (
  //                   <div className="contentBadgeCard">
  //                     <img
  //                       className="filetype_pdf"
  //                       src={filetype_pdf}
  //                       alt="No Media"
  //                       width="100%"
  //                       height="200"
  //                     />
  //                   </div>
  //                 );
  //               } else {
  //                 return (
  //                   <div className="contentBadgeCard">
  //                     <img
  //                       className="images_outline"
  //                       src={images_outline}
  //                       alt="No Media"
  //                       width="100%"
  //                       height="200"
  //                     />
  //                   </div>
  //                 );
  //               }
  //             })()}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

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
            Resources
          </Typography>
          <Paper variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Resources
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                {/* <select
                  name="filter"
                  className="filter"
                  value={authorFilter}
                  onChange={handleAuthorFilterChange}
                >
                  <option value="">All Authors</option>
                  {[
                    ...new Set(
                      resources.map((resource) =>
                        resource?.user
                          ? `${resource?.user?.first_name} ${resource?.user?.last_name}`
                          : "Unknown"
                      )
                    ),
                  ].map((author, index) => (
                    <option key={index} value={author}>
                      {author}
                    </option>
                  ))}
                </select> */}
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Search by title or author"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography className="section-heading">
                  {decodeURI(searchParams.get("category"))}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TableDefault
                  data={resources}
                  tableName="Resources"
                  header={["Title", "Author", "Status", "Last Update"]}
                  onChangeData={(page, show) => () => {
                    handleListResources(page, show);
                  }}
                >
                  {resources?.list
                    ?.filter(
                      (i) =>
                        i.category === decodeURI(searchParams.get("category"))
                    )
                    .map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Link to={`/resources/${item.id}`}>
                            {item.resource_title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {item.user.first_name} {item.user.last_name}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          {moment(item.updatedAt).format(
                            "D MMM YYYY | hh:mm:ss a"
                          )}
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
