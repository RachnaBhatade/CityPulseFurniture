// Contact Us Form Handling

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.left form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(form)) {
        const formData = {
          name: form.querySelector('input[type="text"]').value,
          email: form.querySelector('input[type="email"]').value,
          subject: form.querySelectorAll('input[type="text"]')[1]?.value || '',
          message: form.querySelector('textarea').value,
          timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (in a real app, this would be sent to a server)
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        showToast('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
      } else {
        showToast('Please fill in all required fields.', 'error');
      }
    });
  }
});

