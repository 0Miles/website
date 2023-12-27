const path = require('path')
const fs = require('fs')

const projectRootPath = path.resolve(__dirname, '..')
const assetsPath = path.join(projectRootPath, 'src/assets/')
function getFiles(dirPath) {
    let files = [];
    fs.readdirSync(dirPath).forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            files = files.concat(getFiles(filePath));
        } else {
            files.push({
                name: filePath,
                time: stat.mtime.getTime()
            });
        }
    });
    return files.sort((a, b) => b.time - a.time);
}

const assetsList = getFiles(assetsPath).map(x => x.name.replace(assetsPath, '').replace(/\\/g, '/'))
fs.writeFileSync(path.join(projectRootPath, 'src/assets-list.ts'), 'export const assetsList = ' + JSON.stringify(assetsList))