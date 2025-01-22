import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
} from "@mui/material";

const RateAdmin = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch Ratings Data
  const fetchRatings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ratings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings || []);
      } else {
        setError("Failed to fetch ratings data.");
      }
    } catch (err) {
      setError("Error fetching ratings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        User Ratings Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><strong>ID</strong></TableCell>
                  <TableCell align="center"><strong>Rating</strong></TableCell>
                  <TableCell align="center"><strong>Feedback</strong></TableCell>
                  <TableCell align="center"><strong>Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ratings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rating, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{rating.id}</TableCell>
                      <TableCell align="center">{rating.rating} ★</TableCell>
                      <TableCell align="center">
                        {rating.feedback || "No feedback provided"}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ratings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Container>
  );
};

export default RateAdmin;
