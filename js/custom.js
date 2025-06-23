
// Authentication check functions
function checkAuthAndShowGame(slug) {
    if (typeof Clerk !== 'undefined' && Clerk.user) {
        showGame(slug);
    } else {
        showAuthModal();
    }
}

function showAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-jacarta-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-4 text-jacarta-700 dark:text-white text-center">Login Required</h2>
            <p class="text-jacarta-500 dark:text-jacarta-300 mb-6 text-center">You need to be logged in to play games. Please sign in or create an account to continue.</p>
            <div class="flex flex-col space-y-3">
                <div class="flex space-x-3">
                    <button id="modal-sign-in" class="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded transition-all">
                        Sign In
                    </button>
                    <button id="modal-sign-up" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-all">
                        Sign Up
                    </button>
                </div>
                <button id="modal-cancel" class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition-all">
                    Cancel
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    window.currentAuthModal = modal;
    
    // Add event listeners to modal buttons
    document.getElementById('modal-sign-in').addEventListener('click', function() {
        closeAuthModal();
        openSignIn();
    });
    
    document.getElementById('modal-sign-up').addEventListener('click', function() {
        closeAuthModal();
        openSignUp();
    });
    
    document.getElementById('modal-cancel').addEventListener('click', function() {
        closeAuthModal();
    });
}

function closeAuthModal() {
    if (window.currentAuthModal) {
        document.body.removeChild(window.currentAuthModal);
        window.currentAuthModal = null;
    }
}

function openSignIn() {
    closeAuthModal();
    if (typeof Clerk !== 'undefined' && Clerk.loaded) {
        try {
            Clerk.openSignIn({
                afterSignInUrl: window.location.href,
                redirectUrl: window.location.href
            });
        } catch (error) {
            console.error('Failed to open sign in:', error);
            alert('Authentication service is currently unavailable. Please try again later.');
        }
    } else {
        console.warn('Clerk not loaded, redirecting to home');
        window.location.href = '/?auth=required';
    }
}

function openSignUp() {
    closeAuthModal();
    if (typeof Clerk !== 'undefined' && Clerk.loaded) {
        try {
            Clerk.openSignUp({
                afterSignUpUrl: window.location.href,
                redirectUrl: window.location.href
            });
        } catch (error) {
            console.error('Failed to open sign up:', error);
            alert('Authentication service is currently unavailable. Please try again later.');
        }
    } else {
        console.warn('Clerk not loaded, redirecting to home');
        window.location.href = '/?auth=required';
    }
}


function logEventGame(id, type){
    analytics.logEvent(id, {
        type: type
    }); 

  }
function loadMainGame(){
    $('#preload').remove();
    $('.game-iframe-container').html('<iframe class="game-iframe" id="game-area" src="https://ubg77.github.io/edit/motoroadrash3d/" width="400" height="800" scrolling="none" frameborder="0" allowfullscreen=""></iframe>');
    logEventGame("road-rash-3d", "play");
    
}
function loadGame(slug){
    fetch("game/all.json",{
        headers: {
            'Content-Type': 'application/json',
            },
    }).then(response => response.json())
    .then(data => {
        listGame = data;
        for (var j=0; j<listGame.length; j++) {
            if (listGame[j].slug == slug) {
                var tmp_url = '';
                if(listGame[j].domain == 1){
                    tmp_url = 'https://webglmath.github.io/'+slug+"/";
                } else if(listGame[j].domain == 2){
                    tmp_url = 'https://ubg77.github.io/edit/'+slug+"/";
                }  else if(listGame[j].domain == 3){
                    tmp_url = 'https://ubg77.github.io/game131022/'+slug+"/";
                    
                }  else if(listGame[j].domain == 4){
                    tmp_url = 'https://ubg77.github.io/fix/'+slug+"/";
                    if(slug.indexOf("fnaf2") != -1){
                        tmp_url = 'https://ubg77.github.io/fix/'+slug;
                    }
                }
                $('#gameframe').src = tmp_url;
                $("html, body").animate({ scrollTop: 0 }, "slow");
                break;
            }
        }
    });
}
var search = window.location.search;
if(search){
    loadGame(search.replace('?class=',''));
    //addAdsClass();
}
function open_fullscreen() {
	let game = document.getElementById("gameframe");
	if (game.requestFullscreen) {
	  game.requestFullscreen();
	} else if (game.mozRequestFullScreen) { /* Firefox */
	  game.mozRequestFullScreen();
	} else if (game.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	  game.webkitRequestFullscreen();
	} else if (game.msRequestFullscreen) { /* IE/Edge */
	  game.msRequestFullscreen();
	}
};
function showGame(slug){
    for (var j=0; j<listGame.length; j++) {
        if (listGame[j].slug == slug) {
            var tmp_url = '';
            if(listGame[j].domain == 1){
                tmp_url = 'https://webglmath.github.io/'+slug+"/";
            } else if(listGame[j].domain == 2){
                tmp_url = 'https://ubg77.github.io/edit/'+slug+"/";
            }  else if(listGame[j].domain == 3){
                tmp_url = 'https://ubg77.github.io/game131022/'+slug+"/";
                
            }  else if(listGame[j].domain == 4){
                tmp_url = 'https://ubg77.github.io/fix/'+slug+"/";
                if(slug.indexOf("fnaf2") != -1){
                    tmp_url = 'https://ubg77.github.io/fix/'+slug;
                }
            }
            logEventGame(slug, "play");
            $('#preload').remove();
            $('.game-iframe-container').html('<iframe class="game-iframe" id="game-area" src="'+tmp_url+'" width="400" height="800" scrolling="none" frameborder="0" allowfullscreen=""></iframe>');
            $("#title").html(listGame[j].title);
            $("html, body").animate({ scrollTop: 0 }, "slow");
            break;
            
        }
    }
}
var listGame;
fetch("game/all.json",{
headers: {
    'Content-Type': 'application/json',
    },
}).then(response => response.json())
.then(data => {
    listGame = data;
});
// Show authentication modal
function showAuthModal() {
    const modalHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        " id="auth-modal">
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                color: white;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
            ">
                <h2 style="margin-bottom: 20px; font-size: 2em;">🔒 Login Required</h2>
                <p style="margin-bottom: 30px; font-size: 1.1em; opacity: 0.9;">
                    Please sign in to play games on Classroom 6x!
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
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
                    ">Sign In</button>
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
                    ">Sign Up</button>
                </div>
                <button onclick="closeAuthModal()" style="
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 20px;
                ">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close authentication modal
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.remove();
    }
}

// Open sign in modal
function openSignIn() {
    if (window.Clerk && window.Clerk.loaded) {
        try {
            window.Clerk.openSignIn({
                afterSignInUrl: window.location.href,
                redirectUrl: window.location.href
            });
            closeAuthModal();
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Authentication service is currently unavailable. Please try again later.');
        }
    } else {
        console.error('Clerk not loaded');
    }
}

// Open sign up modal
function openSignUp() {
    if (window.Clerk && window.Clerk.loaded) {
        try {
            window.Clerk.openSignUp({
                afterSignUpUrl: window.location.href,
                redirectUrl: window.location.href
            });
            closeAuthModal();
        } catch (error) {
            console.error('Sign up error:', error);
            alert('Authentication service is currently unavailable. Please try again later.');
        }
    } else {
        console.error('Clerk not loaded');
    }
}

// Authentication check function
async function checkAuthAndShowGame(gameSlug) {
    // Wait for Clerk to load if not already loaded
    if (typeof window.Clerk === 'undefined') {
        console.log('Clerk not loaded, showing auth modal');
        showAuthModal();
        return;
    }
    
    // Wait for Clerk initialization if needed
    if (!window.Clerk.loaded) {
        try {
            await window.Clerk.load();
        } catch (error) {
            console.error('Failed to load Clerk:', error);
            showAuthModal();
            return;
        }
    }
    
    // Enhanced authentication check
    if (window.Clerk.user && 
        window.Clerk.session && 
        window.Clerk.session.status === 'active') {
        // User is authenticated, redirect to game
        console.log('User authenticated, redirecting to game:', gameSlug);
        window.location.href = `/games/${gameSlug}.html`;
    } else {
        // User not authenticated, show proper modal
        console.log('User not authenticated, showing auth modal');
        showAuthModal();
    }
}

function searchGame(){
    var x = document.getElementById("searchInput").value;
    console.log(x);
    let html = "";
    document.getElementById('listgame').innerHTML = '';
    for (var j=0; j<listGame.length; j++) {
        if (listGame[j].title.toUpperCase().indexOf(x.toUpperCase()) >= 0) {
            var item = listGame[j];
            var img = item.slug;
            if(item.img){
                img = item.img;
            }
            var slug = item.slug;
                if(slug.indexOf("fnaf2") != -1 && listGame[j].domain == 4){
                   slug = listGame[j].slug_tmp;
                } 
            const htmlItem = `<div class="g-card">
                    <div class="pic">
                    <figure class="ratio ratio-1">
                        <a rel="noindex nofollow" title="${item.title}" onclick="checkAuthAndShowGame('${item.slug}')">
                        <img src="https://tbg95.co/${item.slug}/logo.png" class="small-thumb" alt="${item.title}">
                        </a>
                    </figure>
                    </div>
                    <div class="g-info">
                    <h3 class="grid-title ellipsis">
                        <a title="${item.title}" rel="noindex nofollow">${item.title}</a>
                    </h3>
        
                    <a class="bt-play" rel="noindex nofollow" title="${item.title}" onclick="checkAuthAndShowGame('${item.slug}')">
                        <img src="/images/play.svg" alt="Play game">
                    </a>
                    </div>
                </div>`;
            const e = document.createElement('div');
            e.className  = "column is-2-widescreen is-3-desktop is-4-tablet is-6-mobile show";
            e.innerHTML = htmlItem;  
            document.getElementById('listgame').appendChild(e);
        }
    }
    
}
function loadSimilar(){
    fetch("game/similar.json",{
        headers: {
            'Content-Type': 'application/json',
            },
    }).then(response => response.json())
    .then(data => {
        listGame = data;
        for (var j=0; j<listGame.length; j++) {
            var item = listGame[j];
            var img = item.slug;
            if(item.img){
                img = item.img;
            }
            const htmlItem = `<a rel="noindex nofollow" title="${item.title}" onclick="showGame('${item.slug}')">
                        <div class="pic">
                            <figure class="ratio ratio-1 circle list-thumbnail">
                            <img src="/images/logo/${img}.png" class="small-thumb" alt="${item.title}">
                            </figure>
                        </div>
                        <div class="text">
                            <h3>
                            <div class="list-title ellipsis">${item.title}</div>
                            </h3>
                            <div class="sub-text ellipsis">Car games</div>
                        </div>
                        </a>`;
            const e = document.createElement('li');
            e.className  = "widget-list-item";
            e.innerHTML = htmlItem;  
            document.getElementById('similar').appendChild(e);
            
        }
    });
}
function loadHot(){
    fetch("game/hot.json",{
        headers: {
            'Content-Type': 'application/json',
            },
    }).then(response => response.json())
    .then(data => {
        listGame = data;
        for (var j=0; j<listGame.length; j++) {
            var item = listGame[j];
            var img = item.slug;
            if(item.img){
                img = item.img;
            }
            var slug = item.slug;
            if(slug.indexOf("fnaf2") != -1 && listGame[j].domain == 4){
                slug = listGame[j].slug_tmp;
            } 
            const htmlItem = `<a rel="noindex nofollow" title="${item.title}" onclick="showGame('${item.slug}')">
                        <div class="pic">
                            <figure class="ratio ratio-1 circle list-thumbnail">
                            <img src="/images/logo/${img}.png" class="small-thumb" alt="${item.title}">
                            </figure>
                        </div>
                        <div class="text">
                            <h3>
                            <div class="list-title ellipsis">${item.title}</div>
                            </h3>
                            <div class="sub-text ellipsis">Hot</div>
                        </div>
                        </a>`;
            const e = document.createElement('li');
            e.className  = "widget-list-item";
            e.innerHTML = htmlItem;  
            document.getElementById('hotgame').appendChild(e);
            
        }
    });
}
function loadAllGame(){
    fetch("game/all.json",{
        headers: {
            'Content-Type': 'application/json',
            },
        }).then(response => response.json())
    .then(data => {
        listGame = data;
        for (var j=listGame.length-1; j>=0; j--) {
            var item = listGame[j];
            var img = "/images/logo/"+item.slug+".png";
            if(item.img){
                img = "/images/logo/"+item.img;
                if(item.img.indexOf("https://") != -1){
                    img = item.img;
                    } else {
                        img = `/images/logo/${item.img}.png`
                    }
            }
            var slug = item.slug;
            if(slug.indexOf("fnaf2") != -1 && listGame[j].domain == 4){
                slug = listGame[j].slug_tmp;
            }
            if(item.domain == 8){
                img = "https://ubg77.github.io/updatefaqs/"+item.slug+"/logo.png";
            }
            const htmlItem = `
            <div
              class="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 block rounded-[1.25rem] border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg"
            >
              <figure class="relative">
                <a title="${item.title}" onclick="checkAuthAndShowGame('${slug}')" style="cursor:pointer">
                  <img
                    src="${img}"
                    alt="${item.title}"
                    class="w-full rounded-[0.625rem]"
                    loading="lazy" style="height:230px"
                  />
                </a>
                <div
                  class="dark:bg-jacarta-700 absolute top-3 right-3 flex items-center space-x-1 rounded-md bg-white p-2"
                >
                  <span
                    class="js-likes relative cursor-pointer before:absolute before:h-4 before:w-4 before:bg-[url('../img/heart-fill.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-0"
                    data-tippy-content="Favorite"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      class="dark:fill-jacarta-200 fill-jacarta-500 hover:fill-red dark:hover:fill-red h-4 w-4"
                    >
                      <path fill="none" d="M0 0H24V24H0z" />
                      <path
                        d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z"
                      />
                    </svg>
                  </span>
                  <span class="dark:text-jacarta-200 text-sm">${(j+1995)*2 - (1234 -  Math.floor(Math.random() * j))  + Math.floor(Math.random() * 11)}</span>
                </div>
                
              </figure>
              <div class="mt-7 flex items-center justify-between">
                <a title="${item.title}" onclick="checkAuthAndShowGame('${slug}')" style="cursor:pointer">
                  <span class="font-display text-jacarta-700 hover:text-accent text-base dark:text-white"
                    >${item.title}</span
                  >
                </a>
              </div>
        
            </div>
          `;
            const e = document.createElement('article');
            e.innerHTML = htmlItem;  
            document.getElementById('listgame').appendChild(e);
        }
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
function loadCategory(cat){
    var tmp_cat = capitalizeFirstLetter(cat);
    fetch("game/all.json",{
        headers: {
            'Content-Type': 'application/json',
            },
    }).then(response => response.json())
    .then(data => {
        listGame = data;
        document.getElementById('listgame').innerHTML = '';
        logEventGame(cat, "searchCat");
        for (var j=listGame.length; j>0; j--) {
            if (listGame[j].cat.indexOf(tmp_cat) >= 0) {
            var item = listGame[j];
            var img = item.slug;
            if(item.img){
                img = item.img;
                if(item.img.indexOf("https://") != -1){
                    img = item.img;
                } else {
                    img = `/images/logo/${item.img}.png`
                }
                
            }
            const htmlItem = `<div class="g-card">
                    <div class="pic">
                    <figure class="ratio ratio-1">
                        <a rel="noindex nofollow" title="${item.title}" onclick="showGame('${item.slug}')">
                        <img src="${img}" class="small-thumb" alt="${item.title}">
                        </a>
                    </figure>
                    </div>
                    <div class="g-info">
                    <h3 class="grid-title ellipsis">
                        <a rel="noindex nofollow" title="${item.title}">${item.title}</a>
                    </h3>
                    <div class="info">
                        <div class="rating ellipsis">
                            ${item.cat}
                        </div>
                    </div>
                    <a class="bt-play" title="${item.title}" rel="noindex nofollow" onclick="showGame('${item.slug}')">
                        <img src="/images/play.svg" alt="Play game">
                    </a>
                    </div>
                </div>`;
            const e = document.createElement('div');
            e.className  = "column is-2-widescreen is-3-desktop is-4-tablet is-6-mobile show";
            e.innerHTML = htmlItem;  
            document.getElementById('listgame').appendChild(e);
            }
            
        }
        document.getElementById('listgame').scrollIntoView();
    });

}
window.addEventListener('load', function() {
    
    // loadSimilar();
    // loadHot();
    loadAllGame();
});
