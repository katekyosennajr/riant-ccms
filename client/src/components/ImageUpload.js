import React, { useState } from 'react';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });

            onUploadSuccess(response.data.filePath);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleFileSelect}
            />
            <label htmlFor="image-upload">
                <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Upload Gambar'}
                </Button>
            </label>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default ImageUpload;