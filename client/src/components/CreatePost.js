import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput]
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Terjadi kesalahan saat membuat post');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Buat Post Baru
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Judul"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Konten
            </Typography>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thumbnail
            </Typography>
            <ImageUpload
              onUploadSuccess={(filePath) => setFormData({ ...formData, thumbnail: filePath })}
            />
            {formData.thumbnail && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={`http://localhost:5000${formData.thumbnail}`}
                  alt="Thumbnail"
                  style={{ maxWidth: '200px' }}
                />
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            label="Kategori"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Tags (tekan Enter untuk menambahkan)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              margin="normal"
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 2 }}
            >
              Simpan
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Batal
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePost;