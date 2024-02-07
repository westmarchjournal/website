const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const slugify = require("slugify");
const striptags = require("striptags");
const EleventyPluginOgImage = require('eleventy-plugin-og-image');
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.setDataDeepMerge(true);

  const OgImageOptions = {
    generateHTML: (outputUrl) => outputUrl,
    satoriOptions: {
        fonts: [
            {
                name: 'EB Garamond',
                data: fs.readFileSync('assets/fonts/static/EBGaramond-Regular.ttf'),
                style: 'normal',
                weight: 400
            },
            {
              name: 'EB Garamond',
              data: fs.readFileSync('assets/fonts/static/EBGaramond-Italic.ttf'),
              style: 'italic',
              weight: 400
            }
        ],
    },
}

  eleventyConfig.addPlugin(EleventyPluginOgImage, OgImageOptions);

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("article", "layouts/article.njk");

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL dd, yyyy");
  });
  eleventyConfig.addFilter("year", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("yyyy");
  });
  eleventyConfig.addFilter("slugify-removeChars", function(value) {
    let product = slugify(value, {
      replacement: '-',    // replace spaces with replacement
      remove: /[*+~.()'"!:@’“”]/g,    // regex to remove characters
      lower: true          // result in lower case
    })
    return product;
  });
  eleventyConfig.addFilter("striptags", function(value) {
      let product = striptags(value);
      return product;
  });
  eleventyConfig.addFilter("filterByAuthor", function(collection, author) {
    let product = collection.filter((article) => article.data.author === author )
    return product
  });
  eleventyConfig.addFilter("sortAuthorsByArticleNumber", function(collection) {
    let product = collection.sort((a, b) => {
      return Number(a.data.articlenumber) - Number(b.data.articlenumber)
    })
    return product
  });

  // shortcodes 
  eleventyConfig.addShortcode("ytEmbed", require("./_11ty/ytEmbed.js"));
  eleventyConfig.addShortcode("citation", require("./_11ty/citation.js"));
  // https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/36
  eleventyConfig.addShortcode("inlineImage", (path) => {
    const file = fs.readFileSync(path);
    return `data:image/jpeg;base64,${file.toString('base64')}`;
  });
  eleventyConfig.addShortcode("image", require("./_11ty/image.js"));

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));
// passthrough
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/files");
  eleventyConfig.addPassthroughCopy("assets/fonts");
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let markdownItDeflist = require("markdown-it-deflist");
  let markdownItFootnote = require('markdown-it-footnote');
  let markdownItAttrs = require("markdown-it-attrs");
  let markdownItResponsive = require("./_11ty/markdownItResponsive.js");
  let mdOptions = {
    html: true,
    breaks: false,
    linkify: true,
    typographer: true
  };
  let anchorOptions = {
    permalink: false,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };
  let riOptions = {
    widths: [150, 300, 600, 800, 1000, 2000],
    sizes:  "(max-width: 60rem) 100vw, 66vw"
  };

  let md = markdownIt(mdOptions)
    .use(markdownItAnchor, anchorOptions)
    .use(markdownItDeflist)
    .use(markdownItAttrs)
    .use(markdownItFootnote)
    .use(markdownItResponsive, riOptions);

  eleventyConfig.setLibrary("md", md);

  md.renderer.rules.footnote_block_open = function () {
      return '<h2>Footnotes</h2> \n <ol>';
  };
  md.renderer.rules.footnote_block_close = function () {
    return '</ol>';
  };
  md.renderer.rules.footnote_anchor = function () {
    return "";
  };

  md.renderer.rules.footnote_caption = function (tokens, idx) {
    var n = Number(tokens[idx].meta.id + 1).toString();

    if (tokens[idx].meta.subId > 0) {
      n += ':' + tokens[idx].meta.subId;
    }
  
    return  n;
  };

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  }
};