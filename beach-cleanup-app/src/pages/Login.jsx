import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Login Page
 * Allows users to log into their account
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        // Login successful, redirect to dashboard
        navigate('/');
      } else {
        // Show error from backend
        setErrors({
          submit: result.error || 'Invalid email or password.',
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
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Log in to continue your ocean cleanup journey
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              />

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-semibold text-ocean-600 hover:text-ocean-700 transition"
                >
                  Forgot password?
                </a>
              </div>

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
                  Log In
                </Button>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-ocean-600 hover:text-ocean-700 transition"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By logging in, you agree to our{' '}
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

export default Login;
