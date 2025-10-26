import { useState } from 'react';
import { User, MapPin } from 'lucide-react';
import Modal, { ModalBody, ModalFooter } from './ui/Modal';
import Input, { Textarea } from './ui/Input';
import Button from './ui/Button';

/**
 * ProfileEditModal component
 * Modal for editing user profile information
 */
const ProfileEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be less than 50 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Location must be less than 100 characters';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      displayName: user?.displayName || '',
      username: user?.username || '',
      location: user?.location || '',
      bio: user?.bio || '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">

            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your display name"
              helperText="This is how your name appears on your profile and posts"
              required
            />

            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your username"
              helperText="Your unique identifier (cannot be changed after creation)"
              required
              disabled
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              leftIcon={<MapPin className="h-5 w-5" />}
              placeholder="e.g., Santa Monica, CA"
              helperText="Let others know where you're cleaning beaches"
            />

            <Textarea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              error={errors.bio}
              placeholder="Tell us about yourself and your passion for ocean conservation..."
              rows={4}
              helperText={`${formData.bio.length}/500 characters`}
            />

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ProfileEditModal;
