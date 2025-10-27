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
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Article as ArticleIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    totalCategories: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch posts
        const postsResponse = await axios.get('http://localhost:5000/api/posts', {
          headers: { 'x-auth-token': token }
        });
        setPosts(postsResponse.data);

        // Fetch users
        const usersResponse = await axios.get('http://localhost:5000/api/users', {
          headers: { 'x-auth-token': token }
        });
        setUsers(usersResponse.data);

        // Calculate statistics
        const totalViews = postsResponse.data.reduce((sum, post) => sum + (post.views || 0), 0);
        const categories = [...new Set(postsResponse.data.map(post => post.category))];

        setStats({
          totalPosts: postsResponse.data.length,
          totalUsers: usersResponse.data.length,
          totalViews: totalViews,
          totalCategories: categories.length
        });

        // Prepare chart data
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
          const postsCount = postsResponse.data.filter(post => 
            new Date(post.createdAt).toISOString().split('T')[0] === date
          ).length;
          return { date: date.split('-').slice(1).join('/'), posts: postsCount };
        });

        setChartData(chartData);

      } catch (err) {
        setError('Gagal mengambil data');
      }
    };

    fetchData();
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

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: color, mr: 1 }} />
          <Typography color="textSecondary" variant="h6">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>

      {/* Kartu Statistik */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ArticleIcon}
            title="Total Artikel"
            value={stats.totalPosts}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PersonIcon}
            title="Total Pengguna"
            value={stats.totalUsers}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={VisibilityIcon}
            title="Total Dilihat"
            value={stats.totalViews}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CategoryIcon}
            title="Total Kategori"
            value={stats.totalCategories}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Grafik Artikel */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Aktivitas Artikel (7 Hari Terakhir)</Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="posts" name="Artikel" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Posts Table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Recent Posts</Typography>
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