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

// Function to replace text in a file
function replaceInFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Replace all variations of "Classroom 6x" with "Github Io Games"
        let result = data.replace(/Classroom 6x/g, 'Github Io Games');
        result = result.replace(/CLASSROOM 6X/g, 'GITHUB IO GAMES');
        result = result.replace(/classroom 6x/g, 'github io games');
        
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
function replaceClassroom6x() {
    const projectDir = __dirname; // Current directory where script is located
    console.log(`Starting replacement in: ${projectDir}`);
    
    // Get all files in the project
    const allFiles = getAllFiles(projectDir);
    
    // Filter for text files (exclude binary files, node_modules, etc.)
    const textFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        const fileName = path.basename(file).toLowerCase();
        
        // Skip this script file itself
        if (fileName === 'replace-classroom-6x.js') {
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
        if (replaceInFile(file)) {
            updatedCount++;
        }
    });
    
    console.log(`\nReplacement complete!`);
    console.log(`Files updated: ${updatedCount}`);
    console.log(`Total files processed: ${textFiles.length}`);
}

// Run the replacement
replaceClassroom6x();