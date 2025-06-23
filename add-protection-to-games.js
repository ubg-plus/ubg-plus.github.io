
const fs = require('fs');
const path = require('path');

// Clerk script and protection script to be added
const clerkScript = `
<!-- Clerk Authentication -->
<script
  async
  crossorigin="anonymous"
  data-clerk-publishable-key="pk_test_YW1wbGUtZ3VwcHktODUuY2xlcmsuYWNjb3VudHMuZGV2JA"
  src="https://ample-guppy-85.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
  type="text/javascript"
></script>

<script>
  window.addEventListener('load', async function () {
    await Clerk.load()
    console.log('ClerkJS loaded for game protection')
  })
</script>

<!-- Game Protection Script -->
<script src="/js/game-protection.js"></script>
`;

function addProtectionToGameFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if protection already exists
    if (content.includes('game-protection.js') || content.includes('pk_test_YW1wbGUtZ3VwcHktODUuY2xlcmsuYWNjb3VudHMuZGV2JA')) {
      console.log(`Protection already exists in ${filePath}`);
      return;
    }
    
    // Add protection scripts before closing head tag
    if (content.includes('</head>')) {
      content = content.replace('</head>', clerkScript + '\n</head>');
      fs.writeFileSync(filePath, content);
      console.log(`Added protection to ${filePath}`);
    } else {
      console.log(`No </head> tag found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.')) {
      walkDir(filePath);
    } else if (file.endsWith('.html')) {
      addProtectionToGameFile(filePath);
    }
  });
}

// Process all game HTML files
console.log('Adding authentication protection to all game files...');
walkDir('./games');
console.log('Game protection setup complete!');
