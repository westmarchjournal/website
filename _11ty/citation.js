const { DateTime } = require("luxon");
// I know that this is not DRY at all, but I want it to be modular. 

// TODO: make it say "et al." when necessary. I don't anticipate this being a problem for Westmarch, but it would be good practice to make it that flexible for other journals.
styles = {
    "turabian-note": function(data) {
        let authorstring = "";
        let i = 0;
        data["authors"].forEach(function(a) {
            
            if (a["name"] && a["surname"]) {
                authorstring = authorstring + a["name"] + " " + a["surname"];
            }
            else {
                authorstring = authorstring + a["author"]
            };
            if (data["authors"][i+2]) {
                authorstring = authorstring + ", "
            }
            else if (data["authors"][i+1]) {
                if (data["authors"].length > 2) {
                    authorstring = authorstring + ", "
                };
                authorstring = authorstring + "and "
            };
            i++;
        });
        let datestring = DateTime.fromJSDate(data["date"], {zone: 'utc'}).toFormat("LLLL dd, yyyy");
        let citationstring = `${authorstring}, &ldquo;${data["title"]},&rdquo; <i>${data["journaltitle"]}</i> ${data["volume"]}, no. ${data["issue"]} (${datestring}), ${data["url"]}.`
        return citationstring;
    },
    "turabian-bib": function(data) {
        let authorstring = "";
        let i = 0;
        data["authors"].forEach(function(a) {
            
            if (a["name"] && a["surname"]) {
                if (a[i-1]) {
                    authorstring = authorstring + a["name"] + " " + a["surname"] 
                }
                else {
                    authorstring = authorstring + a["surname"] + ", " + a["name"];
                }
            }
            else {
                authorstring = authorstring + a["author"]
            };
            if (data["authors"][i+2]) {
                authorstring = authorstring + ", "
            }
            else if (data["authors"][i+1]) {
                if (data["authors"].length > 2) {
                    authorstring = authorstring + ", "
                };
                authorstring = authorstring + "and "
            };
            i++;
        });
        let datestring = DateTime.fromJSDate(data["date"], {zone: 'utc'}).toFormat("LLLL dd, yyyy");
        let citationstring = `${authorstring}. &ldquo;${data["title"]}.&rdquo; <i>${data["journaltitle"]}</i> ${data["volume"]}, no. ${data["issue"]} (${datestring}). ${data["url"]}.`
        return citationstring;
    },
    "mla": function(data) {
        let authorstring = "";
        let i = 0;
        data["authors"].forEach(function(a) {
            
            if (a["name"] && a["surname"]) {
                if (a[i-1]) {
                    authorstring = authorstring + a["name"] + " " + a["surname"] 
                }
                else {
                    authorstring = authorstring + a["surname"] + ", " + a["name"];
                }
            }
            else {
                authorstring = authorstring + a["author"]
            };
            if (data["authors"][i+2]) {
                authorstring = authorstring + ", "
            }
            else if (data["authors"][i+1]) {
                if (data["authors"].length > 2) {
                    authorstring = authorstring + ", "
                };
                authorstring = authorstring + "and "
            };
            i++;
        });
        let datestring = DateTime.fromJSDate(data["date"], {zone: 'utc'}).toFormat("LLLL dd, yyyy");
        let citationstring = `${authorstring}. &ldquo;${data["title"]}.&rdquo; <i>${data["journaltitle"]}</i> vol. ${data["volume"]}, no. ${data["issue"]}, ${datestring}), ${data["url"]}.`
        return citationstring;   
    }, 
    "apa": function(data) {
        let authorstring = "";
        let i = 0;
        data["authors"].forEach(function(a) {
            
            if (a["name"] && a["surname"]) {
                authorstring = authorstring + a["surname"] + ", " + a["name"][0];
            }
            else {
                authorstring = authorstring + a["author"]
            };
            if (data["authors"][i+2]) {
                authorstring = authorstring + ", "
            }
            else if (data["authors"][i+1]) {
                if (data["authors"].length > 2) {
                    authorstring = authorstring + ", "
                };
                authorstring = authorstring + "& "
            };
            i++;
        });
        let datestring = DateTime.fromJSDate(data["date"], {zone: 'utc'}).toFormat("yyyy");
        let citationstring = `${authorstring}. (${datestring}). ${data["title"]}. <i>${data["journaltitle"]}</i>, <i>${data["volume"]}</i>(${data["issue"]}). ${data["url"]}`
        return citationstring;    
    }
}


module.exports = function(style, data) {
    return styles[style](data);
  };