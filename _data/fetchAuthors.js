const fs = require("fs");

let authors = []

function getJSON (filePath) {
    return JSON.parse(
        fs.readFileSync(filePath)
    )
}

authors = getJSON("_data/authors.json")

 let pageAuthors = []
// I need to figure out how to get Eleventy collection data here. 
// for (page in data.collections.all) {
//     author = page.author
//     if (!authors.find(
//         (a) => a["name"] = author)) {
//         pageAuthors.push({"name": author})
//     }
// }

authors = authors.concat(pageAuthors)

module.exports = function() {
    return authors
}