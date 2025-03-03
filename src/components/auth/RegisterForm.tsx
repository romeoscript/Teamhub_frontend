import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onSwitch: () => void;
}

export const RegisterForm = ({ onSwitch }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    subscribedToUpdates: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('subscribedToUpdates', String(formData.subscribedToUpdates));
      
      // Only append the image if it exists
      if (profileImage) {
        formDataToSend.append('profilePhoto', profileImage);
      }
      
      const response = await fetch('https://black-kohl.vercel.app/api/auth/signup', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header when using FormData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      toast.success('Registration successful!');
      
      // Redirect to email verification page
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          isNewRegistration: true
        } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
        <p className="mt-2 text-sm text-gray-500">
          Please enter your details to sign up
        </p>
      </div>

      <ImageUpload 
        onImageSelect={(file) => setProfileImage(file as File)} 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex items-center">
          <input
            id="subscribedToUpdates"
            type="checkbox"
            checked={formData.subscribedToUpdates}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="subscribedToUpdates" className="ml-2 block text-sm text-gray-700">
            Receive product updates and notifications
          </label>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};