const path = require('path');
const fs = require('fs');
const async = require('async');

//TODO: we should be able to avoid requiring this
const directories = ["utils", "services"];

const filesToRead = [];
let filesContent = "";

async.eachSeries(directories, addFilesToReadFromDirectory, onDirectoryFilesAdded);

function addFilesToReadFromDirectory(directory, callback)
{
    const directoryPath = path.join(__dirname, '../dist/' + directory);
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            filesToRead.push(directoryPath + "\\" + file);
        });
        callback();
    });
}

function addFileContent(filename, callback) {
    return fs.readFile(filename, 'utf8', function(err, content) {
        if (!err) {
            filesContent += content;
            callback();
        } else {
            console.log(err);
        }
    });
}

function onDirectoryFilesAdded()
{
    filesToRead.push(path.join(__dirname, '../dist/main.js'));
    async.eachSeries(filesToRead, addFileContent, onFilesContentAdded);
}

function onFilesContentAdded()
{
    const arrayOfLines = filesContent.match(/[^\r\n]+/g);
    const removedLines = [];
    const arrayWithoutModules = [];
    for (const line of arrayOfLines)
    {
        if (line.includes('export') || line.includes('import'))
        {
            removedLines.push(line);
            continue;
        }
        arrayWithoutModules.push(line);
    }
    const mainFile = arrayWithoutModules.join('\r\n');

    fs.writeFile(path.join(__dirname, '../main.js'), mainFile, (err) => {});
}
