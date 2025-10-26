import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { exportUserRegistration } from '../services/googleSheets';

/**
 * Register/Signup Page
 * Allows users to create a new profile/account
 */
const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bio: '',
    location: '',
  });

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation (optional but recommended)
    if (formData.name.trim() && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim() || formData.username.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
      });

      if (result.success) {
        // Export to Google Sheets
        try {
          await exportUserRegistration(result.user);
        } catch (exportError) {
          console.error('Failed to export registration to Google Sheets:', exportError);
          // Don't block registration if export fails
        }

        // Registration successful, redirect to dashboard or profile
        navigate('/profile');
      } else {
        // Show error from backend
        setErrors({
          submit: result.error || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join OceanClean
          </h1>
          <p className="text-lg text-gray-600">
            Create your profile and start making a difference
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Create Your Profile</h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in your information to get started
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="oceanwarrior123"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                leftIcon={<User className="h-5 w-5" />}
                required
                helperText="This will be your unique identifier on OceanClean"
              />

              {/* Email */}
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail className="h-5 w-5" />}
                required
                helperText="We'll never share your email with anyone"
              />

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock className="h-5 w-5" />}
                required
                helperText="Must be at least 6 characters"
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={<Lock className="h-5 w-5" />}
                required
              />

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Information <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </h3>
              </div>

              {/* Display Name */}
              <Input
                label="Display Name"
                name="name"
                type="text"
                placeholder="Alex Rivera"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                leftIcon={<User className="h-5 w-5" />}
                helperText="If not provided, we'll use your username"
              />

              {/* Location */}
              <Input
                label="Location"
                name="location"
                type="text"
                placeholder="Santa Monica, CA"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                leftIcon={<MapPin className="h-5 w-5" />}
                helperText="Help others find cleanup events near you"
              />

              {/* Bio */}
              <Textarea
                label="Bio"
                name="bio"
                placeholder="Tell us about yourself and why you're passionate about ocean conservation..."
                value={formData.bio}
                onChange={handleChange}
                error={errors.bio}
                rows={4}
                helperText="Share your story with the community"
              />

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Create Account
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-ocean-600 hover:text-ocean-700 transition"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-ocean-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-ocean-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
