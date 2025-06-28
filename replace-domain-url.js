const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip node_modules and other common directories
            if (!['node_modules', '.git', '.vscode', 'attached_assets'].includes(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    
    return arrayOfFiles;
}

// Function to check if file is a text file
function isTextFile(filePath) {
    const textExtensions = ['.html', '.js', '.css', '.txt', '.xml', '.json', '.md', '.yml', '.yaml'];
    const ext = path.extname(filePath).toLowerCase();
    return textExtensions.includes(ext);
}

// Function to replace text in a file
function replaceInFile(filePath, oldText, newText) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Use regex to replace all occurrences (case-sensitive)
        const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const newContent = content.replace(regex, newText);
        
        // Only write if content changed
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
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
    const projectRoot = __dirname;
    const oldDomain = 'ubg-plus.github.io';
    const newDomain = 'ubg-plus.github.io';
    
    console.log('Starting domain replacement...');
    console.log(`Replacing "${oldDomain}" with "${newDomain}"`);
    
    // Get all files in the project
    const allFiles = getAllFiles(projectRoot);
    const textFiles = allFiles.filter(isTextFile);
    
    console.log(`Found ${textFiles.length} text files to process`);
    
    let modifiedCount = 0;
    
    textFiles.forEach(filePath => {
        const wasModified = replaceInFile(filePath, oldDomain, newDomain);
        if (wasModified) {
            modifiedCount++;
            console.log(`Modified: ${path.relative(projectRoot, filePath)}`);
        }
    });
    
    console.log(`\nReplacement complete!`);
    console.log(`Files processed: ${textFiles.length}`);
    console.log(`Files modified: ${modifiedCount}`);
}

// Run the replacement
replaceDomainInProject();