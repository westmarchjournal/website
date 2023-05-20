const { DateTime } = require("luxon");

styles = {
    "turabian-note": function(data) {
        let authorstring = "";
        let i = 0;
        data["authors"].forEach(function(a) {
            console.log(a);
            if (a["name"] && a["surname"]) {
                authorstring = authorstring + a["name"] + " " + a["surname"];
            }
            else {
                authorstring = authorstring + a["author"]
            };
            if (data["authors"][i+1]) {
                authorstring = authorstring + ", "
            };
            i++;
        });
        let datestring = DateTime.fromJSDate(data["date"], {zone: 'utc'}).toFormat("LLLL dd, yyyy");
        let citationstring = `${authorstring}, &ldquo;${data["title"]},&rdquo; <i>${data["journaltitle"]}</i> ${data["volume"]}, no. ${data["issue"]} (${datestring}), ${data["url"]}.`
        return citationstring;
    }
}


module.exports = function(style, data) {
    return styles[style](data);
  };