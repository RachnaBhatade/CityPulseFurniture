document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('adminLoginForm');
  
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Simple authentication logic (replace with backend validation)
      if (username === 'admin' && password === 'password') {
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'adminDashboard.html';
        }, 1000);
      } else {
        showToast('Invalid credentials! Please try again.', 'error');
        document.getElementById('password').value = '';
      }
    });
  }
});