const image = require("@11ty/eleventy-img");
const { exit } = require("process");

async function imageShortcode(src, alt, widths, sizes, cls, loading) {
  let options = {
    widths: widths,
    sizes: sizes,
    urlPath: "/assets/images/",
    outputDir: "./_site/assets/images/",
    formats: ["webp", "jpeg", "svg"],
    svgShortCircuit: true
  }; 

  let imageAttributes = {
    alt,
    sizes,
    class: cls,
    loading: loading,
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  let metadata = await image(src, options);
  let html = image.generateHTML(metadata, imageAttributes);
  return html
}

module.exports = async function(src, alt, widths=[150, 300, 600, 800, 1000, 2000], sizes = '(min-width: 50rem) 40rem, 100vw', cls="image", loading="lazy") {
    return  imageShortcode("."+src, alt, widths, sizes, cls, loading);
  };