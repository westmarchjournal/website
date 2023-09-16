const fs = require("fs");

let authors = []

function getJSON (filePath) {
    return JSON.parse(
        fs.readFileSync(filePath)
    )
}

authors = getJSON("_data/authors.json")

// let pageAuthors = []
// for (page in data.collections.all) {
//     author = page.author
//     if (!authors.find(
//         (a) => a["name"] = author)) {
//         pageAuthors.push({"name": author})
//     }
// }

module.exports = function() {
    return authors
}