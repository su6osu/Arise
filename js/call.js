document.addEventListener('DOMContentLoaded', () => {
    // Timer functionality
    const timerElement = document.querySelector('.call-timer');
    let seconds = 0;
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Emoji Slider Interaction
    const emojiOptions = document.querySelectorAll('.emoji-option');
    const emojiContainer = document.querySelector('.emoji-container');

    emojiOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            // Remove active state from all emojis
            emojiOptions.forEach(el => el.classList.remove('active'));
            
            // Add active state to selected emoji
            option.classList.add('active');
            
            const selectedMood = option.getAttribute('data-mood');
            console.log(`Selected mood: ${selectedMood}`);

            // Create flying emoji
            const flyingEmoji = document.createElement('div');
            flyingEmoji.textContent = option.textContent;
            flyingEmoji.classList.add('emoji-flying');

            // Calculate global position
            const rect = option.getBoundingClientRect();
            
            // Position the emoji at the center of the clicked emoji
            flyingEmoji.style.position = 'fixed';
            flyingEmoji.style.left = `${rect.left + rect.width / 2}px`;
            flyingEmoji.style.top = `${rect.top + rect.height / 2}px`;

            // Add to body to ensure it's above all other elements
            document.body.appendChild(flyingEmoji);

            // Remove the flying emoji after animation
            flyingEmoji.addEventListener('animationend', () => {
                flyingEmoji.remove();
            });
        });
    });

    // Call Controls
    const muteBtn = document.querySelector('.mute-btn');
    const videoBtn = document.querySelector('.video-btn');
    const speakerBtn = document.querySelector('.speaker-btn');
    const callBtn = document.querySelector('.call-btn');
    const moodBtn = document.querySelector('.mood-btn');
    const moodModal = document.querySelector('.mood-modal');

    // Mute Toggle
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            muteBtn.classList.toggle('active');
            const icon = muteBtn.querySelector('i');
            icon.classList.toggle('fa-microphone');
            icon.classList.toggle('fa-microphone-slash');
        });
    }

    // Video Toggle
    if (videoBtn) {
        videoBtn.addEventListener('click', () => {
            videoBtn.classList.toggle('active');
            const icon = videoBtn.querySelector('i');
            icon.classList.toggle('fa-video');
            icon.classList.toggle('fa-video-slash');
        });
    }

    // Speaker Toggle
    if (speakerBtn) {
        speakerBtn.addEventListener('click', () => {
            speakerBtn.classList.toggle('active');
            const icon = speakerBtn.querySelector('i');
            icon.classList.toggle('fa-volume-up');
            icon.classList.toggle('fa-volume-mute');
        });
    }

    // Call Button (End Call)
    if (callBtn) {
        callBtn.addEventListener('click', () => {
            stopTimer();
            // Redirect to main page or show end call modal
            window.location.href = '../index.html';
        });
    }

    // Mood modal
    if (moodBtn && moodModal) {
        moodBtn.addEventListener('click', () => {
            moodModal.classList.remove('hidden');
        });

        // Close mood modal when clicking outside
        moodModal.addEventListener('click', (e) => {
            if (e.target === moodModal) {
                moodModal.classList.add('hidden');
            }
        });

        // Mood option selection
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedMood = option.getAttribute('data-mood');
                console.log(`Selected mood: ${selectedMood}`);
                moodModal.classList.add('hidden');
                // You can add more functionality here, like sending mood to peer
            });
        });
    }

    // Group call specific controls
    const miniControls = document.querySelectorAll('.mini-control');
    miniControls.forEach(control => {
        control.addEventListener('click', () => {
            if (control.classList.contains('mute-btn')) {
                control.classList.toggle('muted');
                const icon = control.querySelector('i');
                icon.classList.toggle('fa-microphone');
                icon.classList.toggle('fa-microphone-slash');
            }

            if (control.classList.contains('video-btn')) {
                control.classList.toggle('video-off');
                const icon = control.querySelector('i');
                icon.classList.toggle('fa-video');
                icon.classList.toggle('fa-video-slash');
            }
        });
    });

    // Group chat functionality
    const groupChatInput = document.querySelector('.group-chat-input input');
    const groupChatSendBtn = document.querySelector('.group-chat-input .send-btn');
    const groupChatMessages = document.querySelector('.group-chat-messages');

    function addChatMessage(message, sender = 'You') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        groupChatMessages.appendChild(messageElement);
        groupChatMessages.scrollTop = groupChatMessages.scrollHeight;
    }

    if (groupChatInput && groupChatSendBtn) {
        groupChatSendBtn.addEventListener('click', sendMessage);
        groupChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const message = groupChatInput.value.trim();
            if (message) {
                addChatMessage(message);
                groupChatInput.value = '';

                // Simulate peer response
                setTimeout(() => {
                    const responses = [
                        "That's a great point!",
                        "I understand how you feel.",
                        "Thank you for sharing.",
                        "You're not alone in this.",
                        "Your feelings are valid."
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addChatMessage(randomResponse, 'Emily');
                }, 1000);
            }
        }
    }

    // Group Call Slider Navigation
    const participantsSlider = document.querySelector('.participants-slider');
    const leftNav = document.querySelector('.left-nav');
    const rightNav = document.querySelector('.right-nav');

    if (participantsSlider && leftNav && rightNav) {
        leftNav.addEventListener('click', () => {
            participantsSlider.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });

        rightNav.addEventListener('click', () => {
            participantsSlider.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });
    }

    // Start timer when page loads
    startTimer();
}); 