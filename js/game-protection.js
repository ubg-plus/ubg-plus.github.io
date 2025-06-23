
// Game Protection Script - Ensures only authenticated users can access games
function initGameProtection() {
    // Check if Clerk is loaded
    if (typeof window.Clerk === 'undefined') {
        console.log('Waiting for Clerk to load...');
        setTimeout(initGameProtection, 100);
        return;
    }

    // Wait for Clerk to fully initialize
    if (!window.Clerk.loaded) {
        console.log('Waiting for Clerk to initialize...');
        setTimeout(initGameProtection, 100);
        return;
    }

    // Enhanced authentication check with session validation
    const isAuthenticated = window.Clerk.user && 
                           window.Clerk.session && 
                           window.Clerk.session.status === 'active';
    
    console.log('Auth check:', {
        hasUser: !!window.Clerk.user,
        hasSession: !!window.Clerk.session,
        sessionStatus: window.Clerk.session?.status,
        isAuthenticated
    });

    if (!isAuthenticated) {
        // User is not authenticated
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    max-width: 400px;
                    width: 100%;
                ">
                    <h1 style="margin-bottom: 20px; font-size: 2.5em;">🔒 Login Required</h1>
                    <p style="margin-bottom: 30px; font-size: 1.2em; opacity: 0.9;">
                        You need to login to play this game!
                    </p>
                    <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                        <button onclick="openSignIn()" style="
                            background: linear-gradient(45deg, #667eea, #764ba2);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" 
                           onmouseout="this.style.transform='scale(1)'">
                            Sign In
                        </button>
                        <button onclick="openSignUp()" style="
                            background: linear-gradient(45deg, #764ba2, #667eea);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" 
                           onmouseout="this.style.transform='scale(1)'">
                            Sign Up
                        </button>
                    </div>
                    <button onclick="window.location.href='/'" style="
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        Back to Home
                    </button>
                </div>
            </div>
        `;
        
        // Add global functions for sign in and sign up
        window.openSignIn = function() {
            if (window.Clerk && window.Clerk.loaded) {
                try {
                    window.Clerk.openSignIn({
                        afterSignInUrl: window.location.href,
                        redirectUrl: window.location.href
                    });
                } catch (error) {
                    console.error('Sign in error:', error);
                    alert('Authentication service is currently unavailable. Please try again later.');
                }
            } else {
                console.error('Clerk not loaded');
            }
        };
        
        window.openSignUp = function() {
            if (window.Clerk && window.Clerk.loaded) {
                try {
                    window.Clerk.openSignUp({
                        afterSignUpUrl: window.location.href,
                        redirectUrl: window.location.href
                    });
                } catch (error) {
                    console.error('Sign up error:', error);
                    alert('Authentication service is currently unavailable. Please try again later.');
                }
            } else {
                console.error('Clerk not loaded');
            }
        };
        
        return;
    }

    // User is authenticated, show the game
    console.log('User authenticated, game access granted');
}

// Initialize protection when page loads
document.addEventListener('DOMContentLoaded', initGameProtection);

// Also check when Clerk loads
window.addEventListener('load', function() {
    setTimeout(initGameProtection, 1000);
});
