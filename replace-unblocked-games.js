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
        
        // Replace 'Unblocked Games G+' with 'Unblocked Games G+'
        // Using a more specific regex to avoid replacing already modified text
        const updatedData = data.replace(/Unblocked Games G+(?! G\+)/g, 'Unblocked Games G+');
        
        // Only write if there were changes
        if (data !== updatedData) {
            fs.writeFileSync(filePath, updatedData, 'utf8');
            console.log(`Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main function
function main() {
    const projectDir = __dirname; // Current directory where script is located
    console.log(`Starting replacement in directory: ${projectDir}`);
    
    // Get all files in the project
    const allFiles = getAllFiles(projectDir);
    
    // Filter for text-based files (exclude binary files, images, etc.)
    const textFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.html', '.js', '.css', '.txt', '.json', '.md', '.xml'].includes(ext);
    });
    
    console.log(`Found ${textFiles.length} text files to process...`);
    
    let filesModified = 0;
    
    // Process each file
    textFiles.forEach(file => {
        if (replaceInFile(file)) {
            filesModified++;
        }
    });
    
    console.log(`\nReplacement complete!`);
    console.log(`Files modified: ${filesModified}`);
    console.log(`Total files processed: ${textFiles.length}`);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { main, replaceInFile, getAllFiles };