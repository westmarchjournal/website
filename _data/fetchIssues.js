// it looks like a point-and-click video game--Oh, it's Westmarch, which is basically a point-and-click video game.--Seth Nowak
const fs = require("fs");
const path = require("path")
// returns issue data in an array
// returns an array of subdirectories in a directory, see https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
function getSubdirs (dir) {
    return fs.readdirSync(dir, { withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

// returns the first JSON file as an object
// Potential problem: if there is more than one JSON file, this will throw an error
// TODO: fix this by matching the filename
function getJSON (filePath) {
    // gets a list of items
    items = fs.readdirSync(filePath, { withFileTypes: true })
        .filter(function(item) {
            return path.extname(filePath + "/" + item.name) == ".json"
        })
    // checks that we don't have more than one JSON file, viz. more than one item in the array
    if (items[1]) {
        throw error("More than one JSON file in" + filePath)
    }
    // selects the first item in the array
    f = items[0]
    // returns the parsed JSON object
    return JSON.parse(
        fs.readFileSync(filePath + "/" + f.name)
    )
}

// returns a list of all sub-sub-directories
function getDirList(dir) {
    let dircontent = getSubdirs(dir);
    let dirlist = [];
    // takes `dircontent` and return an array of all subdirectories
    dircontent.forEach(function(subdir) {
        let filePath = dir + "/" + subdir
        subdirs = getSubdirs(filePath)
        // adds each sub-sub directory to the `dirlist` array
        subdirs.forEach(function(subdir) {
            dirlist.push(filePath + "/" + subdir)
        })
    })
    return dirlist;
};

// the main function
function issues(dir) {
    let dirs = getDirList(dir)
    issueList = [];
    dirs.forEach(function(filePath) {
        json = getJSON(filePath)
        issueList.push(json)
    })
    return issueList
}

// weird things were happening when I passed a value through the function
// it was passing in a system data object instead of the default value
// I'm guessing that has to do with the internal anatomy of Eleventy, so this value is hard-coded
module.exports = function() {
    let i = issues("articles")
    return i
}