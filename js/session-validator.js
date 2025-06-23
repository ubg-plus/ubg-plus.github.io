
// Session validation helper
function validateUserSession() {
    if (!window.Clerk || !window.Clerk.loaded || !window.Clerk.user || !window.Clerk.session) {
        return false;
    }
    
    // Check if session is active
    if (window.Clerk.session.status !== 'active') {
        return false;
    }
    
    // Check session expiry if available
    if (window.Clerk.session.expiry) {
        const sessionExpiry = new Date(window.Clerk.session.expiry);
        const now = new Date();
        return sessionExpiry > now;
    }
    
    // If no expiry info, rely on session status
    return window.Clerk.session.status === 'active';
}

// Enhanced authentication check
function isUserAuthenticated() {
    return validateUserSession();
}

// Export for global use
window.isUserAuthenticated = isUserAuthenticated;
window.validateUserSession = validateUserSession;
