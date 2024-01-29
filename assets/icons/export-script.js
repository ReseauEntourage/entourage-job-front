const fs = require('fs');
const path = require('path');

// Get the current directory
const directoryPath = path.join(__dirname);

// method to format component Name
const getComponentName = (fileName) => {
    return fileName
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')
            .replace('.svg', '')
}

// Read files in directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    // only keep svg files
    files = files.filter((file) => {
        return file.includes(".svg")
    });

    // get number of icons
    const length = files.length;

    // Create a string with the import statements
    let fullStrings = files.map((file) => {
        return `import ${
            getComponentName(file)
        } from './${file}';`;
    });

    // Create a string with all the imports, each on a new line
    let fileNames = fullStrings.join('\n');

    // Add a new line and export statement
    fileNames += '\n\nexport {\n' + files.map(f => getComponentName(f)).join(',\n') + '\n};';

    // Write the string to a new file
    fs.writeFile(path.join(directoryPath, 'icons.ts'), fileNames, (err) => {
        if (err) {
            return console.log('Error writing file: ' + err);
        }
        console.log(`File list has been written to icons.ts (${length} icones)`);
    });
});