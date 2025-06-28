const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip node_modules and .git directories
            if (file !== 'node_modules' && file !== '.git') {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    
    return arrayOfFiles;
}

// Function to replace text in a file
function replaceInFile(filePath, oldText, newText) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Check if file contains the old text
        if (data.includes(oldText)) {
            const result = data.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
            fs.writeFileSync(filePath, result, 'utf8');
            console.log(`Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error.message);
        return false;
    }
}

// Main function
function replaceDomainInProject() {
    const projectDir = __dirname; // Current directory where script is located
    const oldDomain = 'unblockedgamesgplus.gitlab.io';
    const newDomain = 'ubg-plus.github.io';
    
    console.log('Starting domain replacement...');
    console.log(`Replacing '${oldDomain}' with '${newDomain}'`);
    console.log(`Project directory: ${projectDir}`);
    
    // Get all files in the project
    const allFiles = getAllFiles(projectDir);
    
    let filesUpdated = 0;
    let totalFiles = 0;
    
    allFiles.forEach(filePath => {
        // Skip this script file itself
        if (path.basename(filePath) === 'replace-domain-script.js') {
            return;
        }
        
        // Skip binary files and certain file types
        const ext = path.extname(filePath).toLowerCase();
        const skipExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.exe', '.zip', '.rar'];
        
        if (skipExtensions.includes(ext)) {
            return;
        }
        
        totalFiles++;
        
        if (replaceInFile(filePath, oldDomain, newDomain)) {
            filesUpdated++;
        }
    });
    
    console.log(`\nReplacement completed!`);
    console.log(`Files processed: ${totalFiles}`);
    console.log(`Files updated: ${filesUpdated}`);
}

// Run the replacement
replaceDomainInProject();