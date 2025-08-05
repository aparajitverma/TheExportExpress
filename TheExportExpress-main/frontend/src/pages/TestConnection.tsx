import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config';

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [loginResult, setLoginResult] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const apiUrl = await getApiUrl();
      setStatus(`API URL: ${apiUrl}`);
      
      // Test health endpoint
      const healthResponse = await axios.get(`${apiUrl}/api/health`);
      setStatus(`Health check: ${healthResponse.data.message}`);
      
      // Test products endpoint
      const productsResponse = await axios.get(`${apiUrl}/api/products`);
      setStatus(`Products loaded: ${productsResponse.data.data?.length || 0} products`);
      
    } catch (error) {
      setStatus(`Connection failed: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      const apiUrl = await getApiUrl();
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: 'admin@example.com',
        password: 'Admin@123'
      });
      
      setLoginResult(`Login successful! Token: ${response.data.data.token.substring(0, 20)}...`);
    } catch (error: any) {
      setLoginResult(`Login failed: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Backend Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Connection Status:</h3>
        <p>{status}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Login Test:</h3>
        <button onClick={testLogin} style={{ padding: '10px 20px', marginBottom: '10px' }}>
          Test Login
        </button>
        <p>{loginResult}</p>
      </div>
      
      <div>
        <h3>Instructions:</h3>
        <ul>
          <li>If connection status shows "Connection failed", the backend is not running or there's a CORS issue</li>
          <li>If login test fails, check the backend authentication</li>
          <li>If both work, the frontend should be able to connect properly</li>
        </ul>
      </div>
    </div>
  );
};

export default TestConnection; 