// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('uploadForm').addEventListener('submit', function(event) {
//       event.preventDefault();
  
//       const formData = new FormData(this);
  
//       fetch('http://localhost:3000/upload-json', { // Adjust this URL to the backend service name and port
//         method: 'POST',
//         body: formData
//       })
//       .then(response => response.text())
//       .then(result => {
//         alert("Upload successful.");
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         alert('File upload failed.');
//       });
//     });
//   });

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.querySelector('input[name="csvFile"]');
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const csv = e.target.result;

        Papa.parse(csv, {
          header: true,
          complete: function(results) {
            const jsonData = JSON.stringify(results.data);
            sendJSONToBackend(jsonData);
          },
          error: function(error) {
            console.error('Error parsing CSV:', error);
            alert('Failed to parse CSV file.');
          }
        });
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a CSV file.');
    }
  });

  function sendJSONToBackend(jsonData) {
    fetch('http://localhost:3000/upload-json', { // Adjust this URL to the backend service name and port
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    })
    .then(response => response.text())
    .then(result => {
      alert("Upload successful.");
    })
    .catch(error => {
      console.error('Error:', error);
      alert('File upload failed.');
    });
  }
});


  