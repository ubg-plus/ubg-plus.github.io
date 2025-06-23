const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    
    return arrayOfFiles;
}

// Function to remove "Unblocked" from a file
function removeUnblockedFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Replace all variations of "Unblocked" with empty string
        let result = data.replace(/\s*Unblocked\s*/g, ' '); // Remove with surrounding spaces
        result = result.replace(/\s*UNBLOCKED\s*/g, ' '); // Remove uppercase version
        result = result.replace(/\s*unblocked\s*/g, ' '); // Remove lowercase version
        
        // Clean up multiple spaces and trim
        result = result.replace(/\s+/g, ' ');
        result = result.replace(/\s+</g, '<'); // Remove spaces before HTML tags
        result = result.replace(/>\s+/g, '>'); // Remove spaces after HTML tags
        
        // Only write if changes were made
        if (result !== data) {
            fs.writeFileSync(filePath, result, 'utf8');
            console.log(`Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err.message);
        return false;
    }
}

// Main function
function removeUnblocked() {
    const projectDir = __dirname; // Current directory where script is located
    console.log(`Starting removal of 'Unblocked' in: ${projectDir}`);
    
    // Get all files in the project
    const allFiles = getAllFiles(projectDir);
    
    // Filter for text files (exclude binary files, node_modules, etc.)
    const textFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        const fileName = path.basename(file).toLowerCase();
        
        // Skip this script file itself and the previous replacement script
        if (fileName === 'remove-unblocked.js' || fileName === 'replace-classroom-6x.js') {
            return false;
        }
        
        // Include common text file extensions
        return ['.html', '.js', '.css', '.txt', '.json', '.md', '.xml'].includes(ext) ||
               fileName === 'robots.txt' || fileName === '.replit';
    });
    
    console.log(`Found ${textFiles.length} text files to process...`);
    
    let updatedCount = 0;
    
    // Process each file
    textFiles.forEach(file => {
        if (removeUnblockedFromFile(file)) {
            updatedCount++;
        }
    });
    
    console.log(`\nRemoval complete!`);
    console.log(`Files updated: ${updatedCount}`);
    console.log(`Total files processed: ${textFiles.length}`);
}

// Run the removal
removeUnblocked();