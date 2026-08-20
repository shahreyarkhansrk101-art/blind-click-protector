document.getElementById('scanBtn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = 'Reading page and analyzing with AI...';

  try {
    // Get the active browser tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Extract text from the active webpage DOM
    const [{ result: pageText }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    });

    if (!pageText || pageText.trim().length === 0) {
      resultDiv.innerHTML = '<b>Error:</b> No text found on this page.';
      return;
    }

    // Send the extracted text to your FastAPI backend
    const response = await fetch('http://localhost:8000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: pageText.substring(0, 15000) }) // Limit text payload size
    });

    const data = await response.json();

    if (data.status === 'success') {
      resultDiv.innerHTML = `
        <b>Risk Level:</b> <span style="color: red;">${data.risk_level}</span><br><br>
        <b>Data Tracking:</b> ${data.summary.data_tracking}<br><br>
        <b>Data Sharing:</b> ${data.summary.data_selling}<br><br>
        <b>Red Flags:</b> ${data.summary.red_flags}
      `;
    } else {
      resultDiv.innerHTML = '<b>Error:</b> Failed to analyze terms.';
    }
  } catch (error) {
    resultDiv.innerHTML = `<b>Connection Error:</b> Is your Docker backend running on localhost:8000?`;
    console.error(error);
  }
});
