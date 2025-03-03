import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

interface LocationState {
  email?: string;
  isNewRegistration?: boolean;
}

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = () => {
      // Use the same isAuthenticated logic we defined in App.tsx
      const token = localStorage.getItem("token");
      
      if (!token) {
        // Also check sessionStorage in case "Remember me" wasn't selected
        const sessionToken = sessionStorage.getItem("token");
        if (!sessionToken) {
          return false;
        }
        
        // Here we could add JWT validation, but for now just check existence
        return true;
      }
      
      // Here we could add JWT validation, but for now just check existence
      return true;
    };
    
    // If user is already authenticated, redirect to home page
    if (checkAuthStatus()) {
      toast.info("You're already logged in");
      navigate('/');
    }
  }, [navigate]);

  // Extract email from location state
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.email) {
      setEmail(state.email);
    } else {
      // If no email in state, ask user to input it
      const userEmail = prompt('Please enter your email address to verify:');
      if (userEmail) {
        setEmail(userEmail);
      } else {
        // If user cancels, redirect back to auth page
        navigate('/auth');
      }
    }
  }, [location, navigate]);

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleResendVerification = async () => {
    if (resendDisabled) return;
    
    setIsResending(true);
    try {
      const response = await fetch('https://black-kohl.vercel.app/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      toast.success('Verification email has been resent');
      
      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setCountdown(60);
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Verify your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to{' '}
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        <div className="space-y-4 rounded-md bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            Please check your email inbox and click on the verification link to activate your account.
            If you don't see the email, please check your spam folder.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={isResending || resendDisabled}
            className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isResending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>
              {resendDisabled
                ? `Resend email (${countdown}s)`
                : isResending
                ? 'Sending...'
                : 'Resend verification email'}
            </span>
          </button>

          <button
            onClick={() => navigate('/auth')}
            className="flex items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;