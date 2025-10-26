import { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Modal, { ModalBody, ModalFooter } from './Modal';
import Button from './Button';
import Input, { Textarea } from './Input';

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
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Update image preview when URL changes
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
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

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        username: currentUser?.name || currentUser?.username || 'Anonymous',
        location: formData.location,
        imageUrl: formData.imageUrl,
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
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrors({ submit: 'Failed to upload post. Please try again.' });
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
    setImagePreview('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Your Cleanup Adventure">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Image URL Input */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="text"
                placeholder="https://example.com/your-image.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className={errors.imageUrl ? 'border-red-500' : ''}
              />
              {errors.imageUrl && (
                <p className="text-red-600 text-xs mt-1">{errors.imageUrl}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Paste a link to your cleanup photo (from Imgur, Google Photos, etc.)
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview && isValidUrl(imagePreview) && (
              <div className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="aspect-square max-w-xs mx-auto overflow-hidden rounded-lg bg-white">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
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
