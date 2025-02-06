import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";

import "./Tables.scss";
import moment from "moment";

export default function TableDefault({
  data,
  onChangeData,
  tableName,
  header,
  children,
  search,
  pagination,
  filter,
  filters,
}) {
  const [show, setShow] = useState(5);
  const [find, setFind] = useState("");

  const handleSearch = () => {
    onChangeData(moment().format("YYYYMMDDhhmmss"), "next", show, find);
  };

  const handleNext = () => {
    let last =
      data[data.length - 1]?.created_at_order ||
      moment().format("YYYYMMDDhhmmss");
    onChangeData(last, "next", show, find);
  };

  const handlePrev = () => {
    let last = data[0]?.created_at_order || moment().format("YYYYMMDDhhmmss");
    onChangeData(last, "prev", show, find);
  };

  const handleRefresh = () => {
    setFind("");
    onChangeData(moment().format("YYYYMMDDhhmmss"), "next", 5, "");
  };

  useEffect(() => {
    onChangeData(moment().format("YYYYMMDDhhmmss"), "next", show, find);
  }, [show]);

  return (
    <Box id="table-default">
      <TableContainer>
        <Box className="control-holder">
          {filter && <Box className="filter-holder">{filters}</Box>}
          {search && (
            <Box className="search-holder">
              <TextField
                size="small"
                label={`Search for ${tableName}`}
                value={find}
                onChange={({ target }) => setFind(target.value)}
                onKeyUp={({ code }) => code === "Enter" && handleSearch()}
              />
              <Button variant="contained" onClick={() => handleSearch()}>
                Search
              </Button>
            </Box>
          )}
        </Box>
        <Box className="table-holder">
          {data.length ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {header?.map((item, i) => (
                    <TableCell key={i}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{children}</TableBody>
            </Table>
          ) : (
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 256,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  color="black"
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
        {pagination && (
          <Box className="pagination">
            <Box className="show-control">
              <Typography>Showing</Typography>
              <Button
                variant={show === 5 ? "contained" : "outlined"}
                color="black"
                disabled={!data.length}
                onClick={() => setShow(5)}
              >
                5
              </Button>
              <Button
                variant={show === 10 ? "contained" : "outlined"}
                color="black"
                disabled={!data.length}
                onClick={() => setShow(10)}
              >
                10
              </Button>
              <Button
                variant={show === 25 ? "contained" : "outlined"}
                color="black"
                disabled={!data.length}
                onClick={() => setShow(25)}
              >
                25
              </Button>
              <Button
                variant={show === 50 ? "contained" : "outlined"}
                color="black"
                disabled={!data.length}
                onClick={() => setShow(50)}
              >
                50
              </Button>
            </Box>
            <Box className="page-control">
              <React.Fragment>
                <Button
                  variant="outlined"
                  disabled={!data.length}
                  onClick={handlePrev}
                  color="black"
                  startIcon={<KeyboardArrowLeftIcon />}
                >
                  BACK
                </Button>
                <Button
                  variant="outlined"
                  disabled={!data.length}
                  onClick={handleNext}
                  color="black"
                  endIcon={<KeyboardArrowRightIcon />}
                >
                  NEXT
                </Button>
              </React.Fragment>
            </Box>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}
