// DOM Elements
const authForm = document.getElementById('auth-form');
const nameField = document.getElementById('name-field');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit-button');
const toggleButton = document.getElementById('toggle-button');
const toggleText = document.getElementById('toggle-text');
const resetPasswordButton = document.getElementById('reset-password');
const forgotPasswordSection = document.getElementById('forgot-password');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// State
let isLogin = true;

// Toggle between login and signup forms
function toggleForm() {
  isLogin = !isLogin;
  
  // Update UI
  nameField.style.display = isLogin ? 'none' : 'block';
  submitButton.textContent = isLogin ? 'Log In' : 'Sign Up';
  toggleText.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
  toggleButton.textContent = isLogin ? 'Sign Up' : 'Log In';
  forgotPasswordSection.style.display = isLogin ? 'flex' : 'none';
  
  // Clear messages
  hideMessages();
  
  // Optional: Clear form
  authForm.reset();
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  successMessage.style.display = 'none';
}

// Show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  errorMessage.style.display = 'none';
}

// Hide all messages
function hideMessages() {
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
}

// Handle password reset
async function handlePasswordReset() {
  const email = emailInput.value.trim();
  
  if (!email) {
    showError('Please enter your email address to reset your password');
    return;
  }
  
  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Please wait...';
    
    await auth.sendPasswordResetEmail(email);
    showSuccess('Password reset link has been sent to your email');
  } catch (error) {
    showError(formatErrorMessage(error));
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Log In';
  }
}

// Format Firebase error messages to be more user-friendly
function formatErrorMessage(error) {
  let message = error.message || 'An error occurred';
  // Remove Firebase prefix and clean up message
  return message
    .replace('Firebase: ', '')
    .replace('Error (auth/', '')
    .replace(').', '');
}

// Handle form submission (login or signup)
async function handleSubmit(e) {
  e.preventDefault();
  hideMessages();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();
  
  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Please wait...';
    
    if (isLogin) {
      // Handle login
      await auth.signInWithEmailAndPassword(email, password);
      showSuccess('Login successful!');
      
      // Redirect or do something after successful login
      // window.location.href = '/dashboard.html';
    } else {
      // Handle signup
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      
      // Save additional user data to Firestore
      await db.collection('users').doc(userCredential.user.uid).set({
        name,
        email,
        createdAt: new Date().toISOString()
      });
      
      showSuccess('Account created successfully!');
      
      // Optionally switch to login form after successful signup
      // toggleForm();
    }
  } catch (error) {
    showError(formatErrorMessage(error));
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = isLogin ? 'Log In' : 'Sign Up';
  }
}

// Event Listeners
toggleButton.addEventListener('click', toggleForm);
resetPasswordButton.addEventListener('click', handlePasswordReset);
authForm.addEventListener('submit', handleSubmit);

// Initialize the UI (this ensures the form starts in login mode)
toggleForm();
toggleForm(); // Call twice to reset to login mode (simpler than duplicating code)
