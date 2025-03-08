document.addEventListener('DOMContentLoaded', function() {
    const chatbotTrigger = document.querySelector('.chatbot-trigger');
    const chatbotModal = document.querySelector('.chatbot-modal');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.querySelector('.chatbot-input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotMessages = document.querySelector('.chatbot-messages');

    // Toggle chatbot modal
    chatbotTrigger.addEventListener('click', function() {
        chatbotModal.classList.toggle('active');
    });

    // Close chatbot modal
    chatbotClose.addEventListener('click', function() {
        chatbotModal.classList.remove('active');
    });

    // Send message functionality
    function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText === '') return;

        // Add user message
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('chatbot-message', 'user-message');
        userMessageElement.innerHTML = `
            <div class="message-content user-content">${messageText}</div>
        `;
        chatbotMessages.appendChild(userMessageElement);

        // Clear input
        chatbotInput.value = '';

        // Simulate AI response (replace with actual AI integration later)
        setTimeout(() => {
            const aiMessageElement = document.createElement('div');
            aiMessageElement.classList.add('chatbot-message', 'ai-message');
            aiMessageElement.innerHTML = `
                <div class="message-content ai-content">Thanks for your message! I'm an AI assistant designed to help with mental health support. How can I assist you today?</div>
            `;
            chatbotMessages.appendChild(aiMessageElement);

            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);

    // Send message on Enter key press
    chatbotInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
}); 