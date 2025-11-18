document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const image = document.getElementById('chairImage').files[0];
  const price = document.getElementById('chairPrice').value;
  const description = document.getElementById('chairDescription').value;

  if (image && price && description) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const chairData = {
        image: e.target.result,
        price: price,
        description: description
      };

      // Save to localStorage
      const existingChairs = JSON.parse(localStorage.getItem('chairs')) || [];
      existingChairs.push(chairData);
      localStorage.setItem('chairs', JSON.stringify(existingChairs));

      document.getElementById('uploadStatus').innerText = 'Upload successful!';
    };
    reader.readAsDataURL(image);
  } else {
    document.getElementById('uploadStatus').innerText = 'Please fill all fields!';
  }
});