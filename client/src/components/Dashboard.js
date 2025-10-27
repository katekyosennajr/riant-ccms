import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            'x-auth-token': token
          }
        });
        setPosts(response.data);
      } catch (err) {
        setError('Gagal mengambil data post');
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah anda yakin ingin menghapus post ini?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        setError('Gagal menghapus post');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/posts/create"
        >
          Buat Post Baru
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Judul</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal Dibuat</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/posts/edit/${post._id}`}
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(post._id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;