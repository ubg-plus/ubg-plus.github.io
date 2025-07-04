const fs = require('fs');
const path = require('path');

const newBodyEnd = `<style>
/* Pop-Up Box by Fineshop */
.popSc{position:fixed;top:0;bottom:0;left:0;right:0;padding:20px;background:rgba(255, 255, 255, 0.1);z-index:99980;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);display:flex;justify-content:center;align-items:center}
.popSc.hidden{display:none}
.popSc .popBo{position:relative;background:rgba(255, 255, 255, 0.8);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);max-width:400px;display:flex;justify-content:center;align-items:center;flex-direction:column;padding:30px;border-radius:20px;box-shadow:0 5px 25px rgb(0 0 0 / 20%)}
.popSc .popBo svg{display:block;width:50px;height:50px;fill:none !important;stroke:#08102b;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5}
.popSc .popBo h2{margin:10px 0 15px 0;font-size:1.2rem;font-weight:800;color:#08102b}
.popSc .popBo p{margin:0;line-height:1.7em;font-size:0.9rem;color:#08102b}
.popSc .popBo .popBtn{display:inline-flex;justify-content:center;align-items:center;height:50px;width:50px;outline:none;border:none;background:#482dff;border-radius:50%;margin-top:20px;transition:all .2s ease;-webkit-transition:all .2s ease}
.popSc .popBo .popBtn:hover{transform:scale(1.05);-webkit-transform:scale(1.05)}
.popSc .popBo .popBtn svg{width:24px;height:24px;stroke:#fff;flex-shrink:0}
.popSc .popBo .popBtn svg.r{animation:rotateIcn 1.5s infinite linear;-webkit-animation:rotateIcn 1.5s infinite linear}
.popSc{animation:popupBlur .3s ease-in; -webkit-animation:popupBlur .3s}
.popSc >*{animation:popupScale .3s ease-in; -webkit-animation:popupScale .3s}
.darkMode .popSc{background:rgba(0, 0, 0, 0.1)}
.darkMode .popSc .popBo{background:rgba(50, 50, 50, 0.8)}
.darkMode .popSc .popBo svg{stroke:#fefefe}
.darkMode .popSc .popBo p, .darkMode .popSc .popBo h2{color:#fefefe}
@keyframes popupBlur {from{opacity:0}to{opacity:1}}
@-webkit-keyframes popupBlur{from{opacity:0}to{opacity:1}}
@keyframes popupScale{from{transform:scale(0);animation-timing-function:ease-in;opacity:0}to{transform:scale(1);opacity:1}}
@-webkit-keyframes popupScale{from{-webkit-transform:scale(0);-webkit-animation-timing-function: ease-in;opacity:0}to{-webkit-transform:scale(1);opacity:1}}
@keyframes rotateIcn{from{transform:rotate(0deg)} to{transform:rotate(359deg)}}
@-webkit-keyframes rotateIcn{from{-webkit-transform:rotate(0deg)} to{-webkit-transform:rotate(359deg)}}
</style>

</body>`;

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/<\/body>/g, newBodyEnd);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            replaceInFile(fullPath);
        }
    });
}

// Start processing from the current directory
const projectDir = __dirname;
processDirectory(projectDir);