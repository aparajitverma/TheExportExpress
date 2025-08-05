import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getApiUrl } from '../../config';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  CloudArrowUpIcon, 
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ImportResult {
  message: string;
  summary: {
    total: number;
    success: number;
    errors: number;
  };
  results: any[];
  errors: any[];
}

const BulkImport: React.FC = () => {
  const [importType, setImportType] = useState<'categories' | 'products'>('categories');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState('');

  React.useEffect(() => {
    const initializeApiUrl = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
      } catch (error) {
        console.error('Failed to initialize API URL:', error);
      }
    };
    initializeApiUrl();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setImportResult(null);
        toast.success(`File selected: ${selectedFile.name}`);
      } else {
        toast.error('Please select a valid CSV file');
        e.target.value = '';
      }
    }
  };

  const downloadTemplate = async (type: 'categories' | 'products') => {
    if (!currentApiUrl) {
      toast.error('API not initialized. Please try again.');
      return;
    }

    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Download template - Token present:', !!token);
      console.log('Download template - API URL:', currentApiUrl);
      console.log('Download template - Type:', type);
      
      if (!token) {
        toast.error('Please log in to download templates');
        return;
      }

      const response = await axios.get(`${currentApiUrl}/api/bulk/${type}/template`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_template.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded successfully`);
    } catch (error: any) {
      console.error('Download error:', error);
      console.error('Download error response:', error.response?.data);
      console.error('Download error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You need admin privileges.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to download template');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!currentApiUrl) {
      toast.error('API not initialized. Please try again.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${currentApiUrl}/api/bulk/${importType}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setImportResult(response.data);
      
      if (response.data.summary.errors > 0) {
        toast.error(`Import completed with ${response.data.summary.errors} errors`);
      } else {
        toast.success(`Successfully imported ${response.data.summary.success} ${importType}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearResults = () => {
    setImportResult(null);
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📥</span>
              Bulk Import
            </h1>
            <p className="text-gray-400 mt-1">Import multiple categories or products from CSV files</p>
          </div>
        </div>

        {/* Import Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>📋</span>
            Select Import Type
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setImportType('categories')}
              className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                importType === 'categories'
                  ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              <span>🏷️</span>
              Categories
            </button>
            <button
              onClick={() => setImportType('products')}
              className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                importType === 'products'
                  ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              <span>📦</span>
              Products
            </button>
          </div>
        </motion.div>

        {/* Template Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DocumentArrowDownIcon className="w-6 h-6 text-green-400" />
            Download Template
          </h2>
          <p className="text-gray-400 mb-4">
            Download the CSV template to see the required format for {importType}. 
            The template includes sample data and column headers.
          </p>
          <button
            onClick={() => downloadTemplate(importType)}
            disabled={isDownloading}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            {isDownloading ? 'Downloading...' : `Download ${importType.charAt(0).toUpperCase() + importType.slice(1)} Template`}
          </button>
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CloudArrowUpIcon className="w-6 h-6 text-blue-400" />
            Upload CSV File
          </h2>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
            <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Choose CSV File
            </label>
            {file && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-medium">Selected: {file.name}</p>
                <p className="text-sm text-green-300">Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>
          {file && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    Upload and Import
                  </>
                )}
              </button>
              <button
                onClick={clearResults}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                Clear
              </button>
            </div>
          )}
        </motion.div>

        {/* Import Results */}
        {importResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span>📊</span>
              Import Results
            </h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{importResult.summary.total}</div>
                <div className="text-sm text-gray-400">Total Rows</div>
              </div>
              <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{importResult.summary.success}</div>
                <div className="text-sm text-gray-400">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{importResult.summary.errors}</div>
                <div className="text-sm text-gray-400">Errors</div>
              </div>
            </div>

            {/* Success Results */}
            {importResult.results.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-green-400">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Successfully Imported ({importResult.results.length})
                </h3>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {importResult.results.map((item, index) => (
                    <div key={index} className="text-sm text-green-300 mb-1 flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      {item.name || item.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center text-red-400">
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Errors ({importResult.errors.length})
                </h3>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-300 mb-3">
                      <div className="font-medium flex items-center gap-2">
                        <XCircleIcon className="w-4 h-4" />
                        Row {index + 1}: {error.row?.name || 'Unknown'}
                      </div>
                      <div className="text-red-400 ml-6 mt-1">
                        {error.error}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
            <InformationCircleIcon className="w-6 h-6 mr-2" />
            Instructions
          </h2>
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">1.</span>
              <p>Download the template to see the required CSV format for {importType}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">2.</span>
              <p>Fill in your data following the template structure and column headers</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">3.</span>
              <p>Save the file as CSV format (UTF-8 encoding recommended)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">4.</span>
              <p>Upload the file and review the import results</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">5.</span>
              <p>Any errors will be displayed with details for correction</p>
            </div>
          </div>
        </motion.div>

        {/* Template Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center text-yellow-400">
            <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
            Template Information
          </h2>
          <div className="text-sm text-gray-300 space-y-3">
            {importType === 'categories' ? (
              <>
                <p><strong>Required Columns:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="bg-gray-700 px-1 rounded">name</code> - Category name (required)</li>
                  <li><code className="bg-gray-700 px-1 rounded">description</code> - Category description (optional)</li>
                  <li><code className="bg-gray-700 px-1 rounded">parentCategory</code> - Parent category name (optional)</li>
                </ul>
                <p className="mt-3 text-yellow-300">
                  <strong>Note:</strong> If parentCategory is specified, the parent category must exist in the database.
                </p>
              </>
            ) : (
              <>
                <p><strong>Required Columns:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="bg-gray-700 px-1 rounded">name</code> - Product name (required)</li>
                  <li><code className="bg-gray-700 px-1 rounded">description</code> - Product description (required)</li>
                  <li><code className="bg-gray-700 px-1 rounded">shortDescription</code> - Brief description (optional)</li>
                  <li><code className="bg-gray-700 px-1 rounded">category</code> - Category name (required)</li>
                  <li><code className="bg-gray-700 px-1 rounded">origin</code> - Product origin (optional, defaults to India)</li>
                  <li><code className="bg-gray-700 px-1 rounded">specifications</code> - JSON format specifications (optional)</li>
                  <li><code className="bg-gray-700 px-1 rounded">certifications</code> - Comma-separated certifications (optional)</li>
                  <li><code className="bg-gray-700 px-1 rounded">packagingOptions</code> - Comma-separated packaging options (optional)</li>
                </ul>
                <p className="mt-3 text-yellow-300">
                  <strong>Note:</strong> The category must exist in the database. Specifications should be in valid JSON format.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default BulkImport; 