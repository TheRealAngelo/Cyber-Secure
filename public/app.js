document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tabs = document.querySelectorAll('.tab');
  const formSections = document.querySelectorAll('.form-section');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const usernameDisplay = document.getElementById('user-name');

  // API URL - adjust if needed
  const API_URL = 'http://localhost:3000/api';

  // Check if user is already logged in
  checkAuthStatus();

  // Add animation class to form container after initial load
  setTimeout(() => {
    document.querySelector('.form-container').classList.add('loaded');
  }, 200);

  // Tab switching with animation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Don't do anything if current tab is clicked
      if (tab.classList.contains('active')) {
        return;
      }
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Animate out current form
      const activeSection = document.querySelector('.form-section.active');
      activeSection.style.animation = 'fadeOut 0.3s forwards';
      
      setTimeout(() => {
        // Hide all sections and reset animations
        formSections.forEach(section => {
          section.classList.remove('active');
          section.style.animation = '';
        });
        
        // Show and animate in new section
        const newSection = document.querySelector(`.${targetTab}-section`);
        newSection.classList.add('active');
        
        // Reset opacity for input groups to trigger animations
        const inputGroups = newSection.querySelectorAll('.input-group');
        inputGroups.forEach(group => {
          group.style.opacity = '0';
          setTimeout(() => { group.style.opacity = ''; }, 50);
        });
        
        const button = newSection.querySelector('.btn');
        if (button) {
          button.style.opacity = '0';
          setTimeout(() => { button.style.opacity = ''; }, 50);
        }
      }, 300);
    });
  });

  // Add ripple effect to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = 'ripple';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Disable the button and show loading state
    const submitBtn = loginForm.querySelector('.btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging in...';
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success notification
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          showDashboard();
        }, 1500);
      } else {
        // Show error notification
        showNotification(data.message || 'Login failed. Please try again.', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
      console.error('Login error:', error);
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Register form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Disable the button and show loading state
    const submitBtn = registerForm.querySelector('.btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Registering...';
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success notification
        showNotification('Registration successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          showDashboard();
        }, 1500);
      } else {
        // Show error notification
        showNotification(data.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
      console.error('Registration error:', error);
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Logout button
  logoutBtn.addEventListener('click', async () => {
    // Add loading spinner
    logoutBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging out...';
    logoutBtn.disabled = true;
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Reset button state
      logoutBtn.innerHTML = 'Logout <i class="fas fa-sign-out-alt"></i>';
      logoutBtn.disabled = false;
      
      // Show login form
      showLoginForm();
      showNotification('You have been logged out successfully.', 'success');
    }
  });

  // Utility functions
  function showNotification(message, type) {
    notificationMessage.textContent = message;
    notification.classList.add('show', type);
    
    setTimeout(() => {
      notification.classList.remove('show', type);
      
      // After hiding, remove type class
      setTimeout(() => {
        notification.classList.remove(type);
      }, 300);
    }, 3000);
  }

  function showDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    usernameDisplay.textContent = user.username || 'User';
    
    // Animate transition
    const activeSection = document.querySelector('.form-section.active');
    activeSection.style.animation = 'fadeOut 0.3s forwards';
    
    setTimeout(() => {
      formSections.forEach(section => {
        section.classList.remove('active');
        section.style.animation = '';
      });
      
      tabs.forEach(tab => tab.classList.remove('active'));
      
      const dashboardSection = document.querySelector('.dashboard-section');
      dashboardSection.classList.add('active');
    }, 300);
  }

  function showLoginForm() {
    // Animate transition
    const activeSection = document.querySelector('.form-section.active');
    activeSection.style.animation = 'fadeOut 0.3s forwards';
    
    setTimeout(() => {
      formSections.forEach(section => {
        section.classList.remove('active');
        section.style.animation = '';
      });
      
      const loginSection = document.querySelector('.login-section');
      loginSection.classList.add('active');
      
      // Reset animations for input groups
      const inputGroups = loginSection.querySelectorAll('.input-group');
      inputGroups.forEach((group, index) => {
        group.style.opacity = '0';
        setTimeout(() => { group.style.opacity = ''; }, 50 * index);
      });
      
      tabs.forEach(tab => tab.classList.remove('active'));
      document.querySelector('.login-tab').classList.add('active');
    }, 300);
  }

  function checkAuthStatus() {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (accessToken && user) {
      showDashboard();
    }
  }

  // Add animation to the keydown events
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', () => {
      const icon = input.previousElementSibling || input.nextElementSibling;
      if (icon && icon.tagName === 'I') {
        icon.classList.add('icon-pulse');
        setTimeout(() => {
          icon.classList.remove('icon-pulse');
        }, 300);
      }
    });
  });

  // Add CSS for the new animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
    
    .icon-pulse {
      animation: iconPulse 0.3s ease;
    }
    
    @keyframes iconPulse {
      0% { transform: translateY(-50%) scale(1); }
      50% { transform: translateY(-50%) scale(1.2); }
      100% { transform: translateY(-50%) scale(1); }
    }
    
    .ripple {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes rippleEffect {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});