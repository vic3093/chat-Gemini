document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-input');
  const chatContainer = document.getElementById('chat-container');
  const themeToggle = document.getElementById('theme-toggle');

  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Dark Mode' : 'Light Mode';
  });
});

async function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Append user's message (without any avatar images)
  appendMessage(userMessage, 'outgoing');
  messageInput.value = '';

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA2sOpZnLQr94Vg5JYrr5xVjYiFGTPjlcQ',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data && data.candidates && data.candidates.length > 0) {
      const botReply = data.candidates[0].content.parts[0].text;
      appendMessage(botReply, 'incoming');
    } else {
      appendMessage('Sorry, no response from Gemini API.', 'incoming');
    }
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    appendMessage('Error communicating with Gemini API.', 'incoming');
  }
}

function appendMessage(message, type) {
  const chatContainer = document.getElementById('chat-container');
  const chatDiv = document.createElement('div');
  chatDiv.classList.add('chat', type);

  // Instead of an image avatar, we now only add a paragraph with the message text.
  const messageP = document.createElement('p');
  messageP.textContent = message;
  chatDiv.appendChild(messageP);
  
  chatContainer.appendChild(chatDiv);
  
  // Scroll to the bottom of the chat container after appending the message
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
