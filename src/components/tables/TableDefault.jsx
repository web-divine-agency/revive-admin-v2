import { useEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
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
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import "./Tables.scss";

export default function TableDefault({
  data,
  onChangeData,
  tableName,
  header,
  children,
  search,
  pagination,
}) {
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(10);

  useEffect(() => {
    onChangeData(page, show);
  }, [page, show]);

  return (
    <Box id="table-default">
      <TableContainer>
        {search && (
          <Box className="search-holder">
            <TextField size="small" label={`Search for ${tableName}`} />
            <Button variant="contained" className="btn">
              Search
            </Button>
          </Box>
        )}
        <Box className="table-holder">
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
        </Box>
        {pagination && (
          <Box className="pagination">
            <Box className="show-control">
              <Typography>Showing</Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setShow(10);
                  setPage(1);
                }}
              >
                10
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShow(25);
                  setPage(1);
                }}
              >
                25
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShow(50);
                  setPage(1);
                }}
              >
                50
              </Button>
            </Box>
            <Box className="page-control">
              <IconButton
                disabled={!data.prev_page}
                onClick={() => setPage(data.first_page)}
              >
                <KeyboardDoubleArrowLeftIcon />
              </IconButton>
              <IconButton
                disabled={!data.prev_page}
                onClick={() => setPage(page - 1)}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Box
                component="select"
                value={page}
                onChange={(event) => setPage(parseInt(event.target.value))}
              >
                {[...Array(data.pages)].map((item, i) => (
                  <Box component="option" value={item} key={i}>
                    {i + 1}
                  </Box>
                ))}
              </Box>
              of {data.pages}
              <IconButton
                disabled={!data.next_page}
                onClick={() => setPage(page + 1)}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
              <IconButton
                disabled={!data.next_page}
                onClick={() => setPage(data.last_page)}
              >
                <KeyboardDoubleArrowRightIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}
