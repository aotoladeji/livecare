import React, { useState, useRef } from 'react';
import { uploadCaregiverIDDB } from '../../utils/db';
import './IDUploadDialog.css';

const ID_TYPES = [
  { value: 'NIN', label: 'National ID (NIN)', icon: '🆔' },
  { value: 'DRIVERS_LICENSE', label: "Driver's License", icon: '🚗' },
  { value: 'PASSPORT', label: 'Passport', icon: '📕' },
];

export default function IDUploadDialog({ applicationId, applicantName, onClose, onSuccess }) {
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Please upload a JPG, PNG, or PDF file');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setUploadError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      setUploadError('Please select an ID type');
      return;
    }

    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      await uploadCaregiverIDDB(applicationId, file, selectedType);
      setUploadSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error('ID upload failed:', err);
      setUploadError(err.message || 'Failed to upload ID. Please try again.');
      setUploading(false);
    }
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    onClose?.();
  };

  if (uploadSuccess) {
    return (
      <div className="id-upload-overlay">
        <div className="id-upload-dialog id-upload-dialog--success">
          <div className="id-upload-success__icon">✅</div>
          <h2>ID Uploaded Successfully!</h2>
          <p>
            Thanks, <strong>{applicantName.split(' ')[0]}</strong>! We've received your ID. Our team will verify it
            and get back to you within 24–48 hours.
          </p>
          <p className="id-upload-success__note">
            📧 Check your email for verification updates and next steps.
          </p>
        </div>
      </div>
    );
  }

  if (showSkipConfirm) {
    return (
      <div className="id-upload-overlay">
        <div className="id-upload-dialog">
          <h2 style={{ marginBottom: 16 }}>Skip ID Upload?</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            You can upload your ID later from your account dashboard. However, we recommend uploading now to speed up the verification process.
          </p>
          <div className="id-upload-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowSkipConfirm(false)}
            >
              Go back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmSkip}
            >
              ✓ Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="id-upload-overlay">
      <div className="id-upload-dialog">
        <button className="id-upload-close" onClick={handleSkip} title="Skip for now">
          ✕
        </button>

        <div className="id-upload-header">
          <h2>Verify Your Identity</h2>
          <p>Please upload a valid ID to complete your application. This helps us ensure safety and trust.</p>
        </div>

        <form onSubmit={handleUpload} className="id-upload-form">
          {/* ID Type Selection */}
          <div className="id-upload-section">
            <label className="id-upload-label">Select ID Type *</label>
            <div className="id-type-grid">
              {ID_TYPES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  className={`id-type-btn ${selectedType === value ? 'selected' : ''}`}
                  onClick={() => setSelectedType(value)}
                >
                  <span className="id-type-icon">{icon}</span>
                  <span className="id-type-text">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="id-upload-section">
            <label className="id-upload-label">Upload Document *</label>
            <div className="file-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="file-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="file-upload-icon">📎</span>
                <span className="file-upload-text">
                  {fileName ? (
                    <>
                      ✓ <strong>{fileName}</strong>
                    </>
                  ) : (
                    <>
                      Click to upload or drag & drop
                      <br />
                      <small>JPG, PNG, or PDF • Max 10MB</small>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {uploadError && <p className="id-upload-error">⚠️ {uploadError}</p>}

          {/* Action Buttons */}
          <div className="id-upload-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSkip}
              disabled={uploading}
            >
              Skip for now
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${uploading ? 'loading' : ''}`}
              disabled={uploading || !selectedType || !file}
            >
              {uploading ? (
                <>
                  <span className="id-upload-spinner" /> Uploading...
                </>
              ) : (
                '✓ Upload & Continue'
              )}
            </button>
          </div>

          <p className="id-upload-disclaimer">
            🔒 Your ID is encrypted and stored securely. We only use it for verification purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
