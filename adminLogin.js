document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simple authentication logic (replace with backend validation)
  if (username === 'admin' && password === 'password') {
    alert('Login successful!');
    window.location.href = 'adminDashboard.html';
  } else {
    alert('Invalid credentials!');
  }
});