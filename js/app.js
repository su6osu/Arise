document.addEventListener('DOMContentLoaded', () => {
    // Default Credentials
    const DEFAULT_CREDENTIALS = {
        user: {
            username: 'user',
            password: 'user',
            type: 'patient'
        },
        doctor: {
            username: 'doctor', 
            password: 'doctor',
            type: 'therapist'
        }
    };

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const loginContainer = document.querySelector('.login-container');
    const homeSection = document.getElementById('home');
    const mainNavbar = document.getElementById('mainNavbar');

    // Navigation Elements
    const loginSignupBtn = document.querySelector('.login-signup-btn');

    // Logout Button Creation
    const createLogoutButton = () => {
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.classList.add('logout-btn');
        logoutBtn.addEventListener('click', () => {
            // Reset UI
            loginSignupBtn.style.display = 'block';
            loginContainer.style.display = 'flex';
            homeSection.classList.add('hidden');
            
            // Reset forms
            loginForm.reset();
            signupForm.reset();
            forgotPasswordForm.reset();
            
            // Remove logout button from navbar
            if (mainNavbar.contains(logoutBtn)) {
                mainNavbar.removeChild(logoutBtn);
            }
        });
        return logoutBtn;
    };

    // Login Submission Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const captchaInput = document.getElementById('captchaInput');
        const captchaDisplay = document.getElementById('captchaDisplay');

        // Validate Captcha
        if (captchaInput.value.toUpperCase() !== captchaDisplay.textContent) {
            alert('Incorrect Captcha. Please try again.');
            generateCaptcha(captchaDisplay);
            return;
        }

        // Check Credentials
        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;

        // Check against default credentials
        if (
            (enteredUsername === DEFAULT_CREDENTIALS.user.username && 
             enteredPassword === DEFAULT_CREDENTIALS.user.password) ||
            (enteredUsername === DEFAULT_CREDENTIALS.doctor.username && 
             enteredPassword === DEFAULT_CREDENTIALS.doctor.password)
        ) {
            // Determine user type
            const userType = enteredUsername === 'user' ? 'Patient' : 'Therapist';

            // Hide login container, show home
            loginContainer.style.display = 'none';
            loginSignupBtn.style.display = 'none';
            homeSection.classList.remove('hidden');
            
            // Remove any existing logout button first
            if (mainNavbar.contains(logoutBtn)) {
                mainNavbar.removeChild(logoutBtn);
            }
            
            // Add logout button to navbar
            const logoutBtn = createLogoutButton();
            mainNavbar.appendChild(logoutBtn);
            
            alert(`Welcome ${userType} ${enteredUsername}! You are now logged in.`);
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    // Captcha Generation Function
    function generateCaptcha(displayElement) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        displayElement.textContent = captcha;
        return captcha;
    }

    // Generate Captchas on page load
    generateCaptcha(document.getElementById('captchaDisplay'));
    generateCaptcha(document.getElementById('signupCaptchaDisplay'));
    generateCaptcha(document.getElementById('resetCaptchaDisplay'));

    // Form Transition Functions
    function showForm(formToShow) {
        // Hide all forms
        [loginForm, signupForm, forgotPasswordForm].forEach(form => {
            form.classList.remove('active');
        });
        
        // Show the selected form
        formToShow.classList.add('active');
    }

    // Form Navigation Elements
    const showSignupBtn = document.getElementById('showSignup');
    const backToLoginBtn = document.getElementById('backToLogin');
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    const backToLoginFromResetBtn = document.getElementById('backToLoginFromReset');

    // Event Listeners for Form Navigation
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(signupForm);
        generateCaptcha(captchaDisplay);
    });

    backToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(loginForm);
    });

    forgotPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(forgotPasswordForm);
        generateCaptcha(resetCaptchaDisplay);
    });

    backToLoginFromResetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(loginForm);
    });

    // Function to save user to local storage
    function saveUser(username, password, email, userType) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            alert('Username already exists. Please choose another.');
            return false;
        }

        users.push({ username, password, email, userType });
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    // Function to get users from local storage
    function getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    // Signup Form Submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newUsername = document.getElementById('newUsername').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userType = document.getElementById('userType').value;
        const enteredCaptcha = captchaInput.value;
        const generatedCaptcha = captchaDisplay.textContent;

        // Validation
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        if (enteredCaptcha !== generatedCaptcha) {
            alert('Incorrect Captcha. Please try again.');
            generateCaptcha(captchaDisplay);
            return;
        }

        // Save user
        if (saveUser(newUsername, newPassword, email, userType)) {
            alert('Account created successfully! You can now log in.');
            showForm(loginForm);
            signupForm.reset();
        }
    });

    // Forgot Password Form Submission
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const resetEmail = document.getElementById('resetEmail').value;
        const enteredCaptcha = resetCaptchaInput.value;
        const generatedCaptcha = resetCaptchaDisplay.textContent;

        if (enteredCaptcha !== generatedCaptcha) {
            alert('Incorrect Captcha. Please try again.');
            generateCaptcha(resetCaptchaDisplay);
            return;
        }

        // In a real application, this would trigger a password reset process
        alert('Password reset instructions will be sent to ' + resetEmail);
        showForm(loginForm);
    });

    // Mobile Menu Functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-content a');
    const body = document.body;

    // Toggle mobile menu
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (mobileMenuOverlay.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when a link is clicked
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    mobileMenuOverlay.addEventListener('click', (event) => {
        if (event.target === mobileMenuOverlay) {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });

    // Add close button to login container
    const loginWrapper = document.querySelector('.login-wrapper');
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.classList.add('login-close-btn');
    loginWrapper.appendChild(closeBtn);

    // Close login form
    closeBtn.addEventListener('click', () => {
        loginContainer.classList.remove('active');
    });

    // Close login form when clicking outside
    loginContainer.addEventListener('click', (e) => {
        if (e.target === loginContainer) {
            loginContainer.classList.remove('active');
        }
    });

    // AI Chat Functionality
    const aiChatStartBtn = document.querySelector('.ai-chat-start-btn');
    const aiChatModal = document.createElement('div');
    aiChatModal.classList.add('ai-chat-modal');
    aiChatModal.innerHTML = `
        <div class="ai-chat-container">
            <div class="ai-chat-header">
                <h3>Therify AI Companion</h3>
                <button class="ai-chat-close">&times;</button>
            </div>
            <div class="ai-chat-messages"></div>
            <div class="ai-chat-input-area">
                <input type="text" class="ai-chat-input" placeholder="Type your message...">
                <button class="ai-chat-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(aiChatModal);

    const aiChatMessages = aiChatModal.querySelector('.ai-chat-messages');
    const aiChatInput = aiChatModal.querySelector('.ai-chat-input');
    const aiChatSend = aiChatModal.querySelector('.ai-chat-send');
    const aiChatClose = aiChatModal.querySelector('.ai-chat-close');

    console.log('AI Chat Elements:', {
        aiChatStartBtn,
        aiChatModal,
        aiChatMessages,
        aiChatInput,
        aiChatSend,
        aiChatClose
    });

    // AI Responses
    const aiResponses = [
        "I understand that you're going through a challenging time. Would you like to talk more about it?",
        "Mental health is a journey. Remember that seeking help is a sign of strength, not weakness.",
        "It's okay to not be okay. Your feelings are valid, and you're not alone.",
        "Would you like some coping strategies or resources to help you manage your current emotions?",
        "Every small step you take towards your mental health is significant. Be kind to yourself.",
        "Sometimes talking can help. I'm here to listen without judgment.",
        "Your mental well-being is important. Would you like to explore some self-care techniques?",
        "Healing isn't linear. It's okay to have ups and downs. What matters is that you're trying.",
        "Your emotions are valid. Let's work through this together, one moment at a time."
    ];

    // Function to add a message to the chat
    function addMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        aiChatMessages.appendChild(messageElement);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    // Function to get AI response
    function getAIResponse() {
        return aiResponses[Math.floor(Math.random() * aiResponses.length)];
    }

    // Send message functionality
    function sendMessage() {
        const message = aiChatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user-message');
            
            // Clear input
            aiChatInput.value = '';

            // Simulate AI typing
            setTimeout(() => {
                const aiResponse = getAIResponse();
                addMessage(aiResponse, 'ai-message');
            }, 1000);
        }
    }

    // Event Listeners
    aiChatStartBtn.addEventListener('click', () => {
        console.log('AI Chat Start Button Clicked');
        aiChatModal.style.display = 'flex';
    });

    aiChatClose.addEventListener('click', () => {
        console.log('AI Chat Close Button Clicked');
        aiChatModal.style.display = 'none';
    });

    aiChatSend.addEventListener('click', sendMessage);

    aiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Close modal when clicking outside
    aiChatModal.addEventListener('click', (e) => {
        if (e.target === aiChatModal) {
            aiChatModal.style.display = 'none';
        }
    });

    // Community Connection Functionality
    const oneOnOneChatBtn = document.querySelector('.one-on-one-call-btn');
    const groupCallBtn = document.querySelector('.group-call-btn');

    // One-on-One Call Modal
    const oneOnOneCallModal = document.createElement('div');
    oneOnOneCallModal.classList.add('community-modal', 'one-on-one-call-modal');
    oneOnOneCallModal.innerHTML = `
        <div class="community-modal-container">
            <div class="community-modal-header">
                <h3>Peer Support Call</h3>
                <button class="community-modal-close">&times;</button>
            </div>
            <div class="community-modal-content">
                <div class="peer-matching">
                    <div class="matching-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Finding a compassionate peer supporter for a call...</p>
                </div>
                <div class="call-area" style="display: none;">
                    <div class="video-grid">
                        <div class="video-placeholder">
                            <i class="fas fa-phone-volume"></i>
                            <p>Connected with a Peer Supporter</p>
                        </div>
                    </div>
                    <div class="call-controls">
                        <button class="mute-btn"><i class="fas fa-microphone"></i></button>
                        <button class="end-call-btn"><i class="fas fa-phone-slash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(oneOnOneCallModal);

    // Group Call Modal
    const groupCallModal = document.createElement('div');
    groupCallModal.classList.add('community-modal', 'group-call-modal');
    groupCallModal.innerHTML = `
        <div class="community-modal-container">
            <div class="community-modal-header">
                <h3>Group Support Circle</h3>
                <button class="community-modal-close">&times;</button>
            </div>
            <div class="community-modal-content">
                <div class="group-selection">
                    <h4>Select a Support Group</h4>
                    <div class="group-options">
                        <div class="group-option" data-group="anxiety-warriors">
                            <i class="fas fa-heart"></i>
                            <h5>Anxiety Warriors</h5>
                            <span>42 Members</span>
                        </div>
                        <div class="group-option" data-group="depression-recovery">
                            <i class="fas fa-brain"></i>
                            <h5>Depression Recovery</h5>
                            <span>67 Members</span>
                        </div>
                        <div class="group-option" data-group="self-care">
                            <i class="fas fa-hand-holding-heart"></i>
                            <h5>Self-Care Sanctuary</h5>
                            <span>55 Members</span>
                        </div>
                    </div>
                </div>
                <div class="group-call-area" style="display: none;">
                    <div class="video-grid">
                        <div class="video-placeholder">
                            <i class="fas fa-video"></i>
                            <p>Waiting for participants...</p>
                        </div>
                    </div>
                    <div class="call-controls">
                        <button class="mute-btn"><i class="fas fa-microphone"></i></button>
                        <button class="video-btn"><i class="fas fa-video"></i></button>
                        <button class="end-call-btn"><i class="fas fa-phone-slash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(groupCallModal);

    // One-on-One Call Functionality
    const oneOnOneCallClose = oneOnOneCallModal.querySelector('.community-modal-close');
    const peerMatching = oneOnOneCallModal.querySelector('.peer-matching');
    const callArea = oneOnOneCallModal.querySelector('.call-area');
    const muteBtn = oneOnOneCallModal.querySelector('.mute-btn');
    const endCallBtn = oneOnOneCallModal.querySelector('.end-call-btn');

    // One-on-One Call Event Listeners
    oneOnOneChatBtn.addEventListener('click', () => {
        oneOnOneCallModal.style.display = 'flex';
        
        // Simulate peer matching
        setTimeout(() => {
            peerMatching.style.display = 'none';
            callArea.style.display = 'block';
        }, 2000);
    });

    oneOnOneCallClose.addEventListener('click', () => {
        oneOnOneCallModal.style.display = 'none';
        peerMatching.style.display = 'flex';
        callArea.style.display = 'none';
    });

    // Call Controls
    muteBtn.addEventListener('click', () => {
        muteBtn.classList.toggle('muted');
        muteBtn.querySelector('i').classList.toggle('fa-microphone');
        muteBtn.querySelector('i').classList.toggle('fa-microphone-slash');
    });

    endCallBtn.addEventListener('click', () => {
        oneOnOneCallModal.style.display = 'none';
        peerMatching.style.display = 'flex';
        callArea.style.display = 'none';
    });

    // Group Call Functionality
    const groupCallModalClose = groupCallModal.querySelector('.community-modal-close');
    const groupOptions = groupCallModal.querySelectorAll('.group-option');
    const groupCallArea = groupCallModal.querySelector('.group-call-area');
    const muteBtn = groupCallModal.querySelector('.mute-btn');
    const videoBtn = groupCallModal.querySelector('.video-btn');
    const endCallBtn = groupCallModal.querySelector('.end-call-btn');

    // Group Call Event Listeners
    groupCallBtn.addEventListener('click', () => {
        groupCallModal.style.display = 'flex';
    });

    groupCallModalClose.addEventListener('click', () => {
        groupCallModal.style.display = 'none';
    });

    // Group Selection
    groupOptions.forEach(option => {
        option.addEventListener('click', () => {
            groupOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Simulate joining group call
            setTimeout(() => {
                document.querySelector('.group-selection').style.display = 'none';
                groupCallArea.style.display = 'block';
            }, 1000);
        });
    });

    // Call Controls
    muteBtn.addEventListener('click', () => {
        muteBtn.classList.toggle('muted');
        muteBtn.querySelector('i').classList.toggle('fa-microphone');
        muteBtn.querySelector('i').classList.toggle('fa-microphone-slash');
    });

    videoBtn.addEventListener('click', () => {
        videoBtn.classList.toggle('video-off');
        videoBtn.querySelector('i').classList.toggle('fa-video');
        videoBtn.querySelector('i').classList.toggle('fa-video-slash');
    });

    endCallBtn.addEventListener('click', () => {
        groupCallModal.style.display = 'none';
        document.querySelector('.group-selection').style.display = 'block';
        groupCallArea.style.display = 'none';
    });

    // Form Transition Variables
    const formContainer = document.querySelector('.form-container');

    // Show Signup Form
    const showSignupBtn = document.getElementById('showSignup');
    showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('slide-left');
        signupForm.classList.add('slide-in');
        formContainer.classList.add('signup-active');
    });

    // Back to Login from Signup
    const backToLoginBtn = document.getElementById('backToLogin');
    backToLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.remove('slide-left');
        signupForm.classList.remove('slide-in');
        formContainer.classList.remove('signup-active');
    });

    // Forgot Password Link
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const backToLoginFromResetBtn = document.getElementById('backToLoginFromReset');

    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        forgotPasswordForm.style.display = 'flex';
    });

    backToLoginFromResetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'flex';
        forgotPasswordForm.style.display = 'none';
    });

    // Simple Form Validation
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                });
            }
        });

        return isValid;
    }

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm(this)) {
            // Perform login logic here
            alert('Login Successful!');
        }
    });

    // Signup Form Submission
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm(this)) {
            // Perform signup logic here
            alert('Signup Successful!');
        }
    });

    // Forgot Password Form Submission
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm(this)) {
            // Perform password reset logic here
            alert('Password Reset Instructions Sent!');
        }
    });
}); 