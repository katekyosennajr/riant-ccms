import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts/edit/:id" element={<EditPost />} />
          <Route path="/" element={<h1>Welcome to Riant CMS</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
