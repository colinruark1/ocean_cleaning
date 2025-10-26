import { useState, useRef } from 'react';
import { Upload, MapPin, Loader } from 'lucide-react';
import Modal, { ModalBody, ModalFooter } from './Modal';
import Button from './Button';
import Input, { Textarea } from './Input';
import { uploadImage, validateImage, fileToDataURL } from '../../services/imageUpload';

/**
 * UploadPostModal Component
 * Modal for users to upload their beach cleanup posts
 */
const UploadPostModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    location: '',
    trashCollected: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    setIsGettingLocation(true);
    setErrors(prev => ({
      ...prev,
      location: ''
    }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error('Failed to get location name');
          }

          const data = await response.json();
          const locationName = data.address?.city || data.address?.town || data.address?.county || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          setFormData(prev => ({
            ...prev,
            location: locationName
          }));
        } catch (error) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.error('Geolocation error:', error);

        let errorMessage = 'Could not get your location';
        if (error.code === 1) {
          errorMessage = 'Location permission denied. Please enable it in your browser settings.';
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please try again.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }

        setErrors(prev => ({
          ...prev,
          location: errorMessage
        }));
      }
    );
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate the file
    const validation = validateImage(file);
    if (!validation.valid) {
      setErrors(prev => ({
        ...prev,
        image: validation.error
      }));
      return;
    }

    // Clear any previous errors
    setErrors(prev => ({
      ...prev,
      image: ''
    }));

    // Store the file
    setSelectedFile(file);

    // Generate preview
    try {
      const dataUrl = await fileToDataURL(file);
      setImagePreview(dataUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      setErrors(prev => ({
        ...prev,
        image: 'Failed to generate image preview'
      }));
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedFile && !imagePreview) {
      newErrors.image = 'Please select an image';
    }

    if (!formData.caption.trim()) {
      newErrors.caption = 'Caption is required';
    } else if (formData.caption.length < 10) {
      newErrors.caption = 'Caption must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.trashCollected.trim()) {
      newErrors.trashCollected = 'Trash collected amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      // If user selected a file, upload it
      if (selectedFile) {
        setUploadProgress(10);
        imageUrl = await uploadImage(
          selectedFile,
          currentUser?.id || 'anonymous',
          'post',
          (progress) => setUploadProgress(progress)
        );
        setUploadProgress(100);
      }

      const postData = {
        username: currentUser?.name || currentUser?.username || 'Anonymous',
        location: formData.location,
        imageUrl: imageUrl,
        caption: formData.caption,
        trashCollected: formData.trashCollected,
        upvotes: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: new Date().toISOString(),
      };

      await onSubmit(postData);

      // Reset form
      setFormData({
        imageUrl: '',
        caption: '',
        location: '',
        trashCollected: '',
      });
      setSelectedFile(null);
      setImagePreview('');
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrors({ submit: error.message || 'Failed to upload post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      imageUrl: '',
      caption: '',
      location: '',
      trashCollected: '',
    });
    setSelectedFile(null);
    setImagePreview('');
    setUploadProgress(0);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Your Cleanup Adventure">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image *
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload Button or Preview */}
              {!imagePreview ? (
                <button
                  type="button"
                  onClick={handleUploadButtonClick}
                  className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    errors.image
                      ? 'border-red-300 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, JPG, PNG, GIF, or WebP (max 5MB)
                  </p>
                </button>
              ) : (
                <div className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Preview:</p>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="aspect-square max-w-xs mx-auto overflow-hidden rounded-lg bg-white">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {errors.image && (
                <p className="text-red-600 text-xs mt-1">{errors.image}</p>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* Location Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      Getting...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3 w-3" />
                      Use My Location
                    </>
                  )}
                </button>
              </div>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Santa Monica Beach, CA"
                value={formData.location}
                onChange={handleInputChange}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-red-600 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            {/* Trash Collected Input */}
            <div>
              <label htmlFor="trashCollected" className="block text-sm font-medium text-gray-700 mb-1">
                Trash Collected *
              </label>
              <Input
                id="trashCollected"
                name="trashCollected"
                type="text"
                placeholder="e.g., 45 lbs or 20 kg"
                value={formData.trashCollected}
                onChange={handleInputChange}
                className={errors.trashCollected ? 'border-red-500' : ''}
              />
              {errors.trashCollected && (
                <p className="text-red-600 text-xs mt-1">{errors.trashCollected}</p>
              )}
            </div>

            {/* Caption Input */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                Caption *
              </label>
              <Textarea
                id="caption"
                name="caption"
                rows={4}
                placeholder="Share your cleanup story... What did you find? How did it feel?"
                value={formData.caption}
                onChange={handleInputChange}
                className={errors.caption ? 'border-red-500' : ''}
              />
              {errors.caption && (
                <p className="text-red-600 text-xs mt-1">{errors.caption}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.caption.length} characters (minimum 10)
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-3"
          >
            {isSubmitting ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Share Post
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default UploadPostModal;
