async function fetchMessage() {
    const responseDiv = document.getElementById('response');
    responseDiv.textContent = 'Loading...';
    
    try {
        const response = await fetch('http://<51.21.129.246>:3000/api/message');
        const data = await response.json();
        responseDiv.textContent = data.message;
    } catch (error) {
        responseDiv.textContent = 'Error connecting to backend';
    }
}

async function checkBackendStatus() {
    try {
        const response = await fetch('http://<51.21.129.246>:3000/health');
        const statusDiv = document.getElementById('backend-status');
        if (response.ok) {
            statusDiv.innerHTML = '✅ Backend is running';
            statusDiv.style.color = 'green';
        } else {
            statusDiv.innerHTML = '❌ Backend not responding';
            statusDiv.style.color = 'red';
        }
    } catch (error) {
        document.getElementById('backend-status').innerHTML = '❌ Cannot connect to backend';
    }
}

// Check status on page load
checkBackendStatus();
