// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, resetPassword } from '../services/firebase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const { user, error: loginError } = await loginUser(email, password);
        if (loginError) throw loginError;
        
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      } else {
        const { user, error: registerError } = await registerUser(email, password, name);
        if (registerError) throw registerError;
        
        // Redirect to pet profile creation on successful signup
        navigate('/create-pet-profile');
      }
    } catch (err) {
      // Handle authentication errors
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    try {
      setLoading(true);
      const { success, error: resetError } = await resetPassword(email);
      if (resetError) throw resetError;
      
      setResetSent(true);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get human-readable error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-green-100">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-peach-300 opacity-70 blur-md"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-mint-200 opacity-60 blur-md"></div>
      <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-blue-200 opacity-50 blur-md"></div>
      
      {/* Glass Card */}
      <div className="relative w-full max-w-md p-8 mx-4 bg-white bg-opacity-20 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-opacity-20 border-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome to PawPal</h2>
          <p className="text-gray-600 mt-2">The best companion for your pet's care</p>
        </div>
        
        {resetSent ? (
          <div className="text-center p-4 bg-green-100 bg-opacity-70 rounded-lg mb-6">
            <p className="text-green-700">Password reset email sent! Check your inbox.</p>
            <button 
              onClick={() => setResetSent(false)} 
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 bg-opacity-70 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={handlePasswordReset}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 border-opacity-50">
          <p className="text-center text-gray-600 text-sm">
            By continuing, you agree to PawPal's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
