// so anyhow I started with markdown-it-responsive and ended up re-writing it
// TODO: move variables into .eleventy.js
// be careful that if you change anything here you also do in img.js
'use strict';

var path = require('path');
var wild2regex = require('./wildcardToRegex.js');
var image = require("@11ty/eleventy-img");
const { exit } = require('process');
var md = require('markdown-it')();

// https://www.11ty.dev/docs/plugins/image/

function responsiveImage(src, cls, alt, sizes, widths) {
    let options = {
      widths: widths,
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
      formats: ["webp", "jpeg", "svg"],
      svgShortCircuit: true
    };
  
    // generate images, while this is async we don’t wait
    image(src, options);
  
    let imageAttributes = {
      class: cls,
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };
    // get metadata even the images are not fully generated
    let metadata = image.statsSync(src, options);
    return image.generateHTML(metadata, imageAttributes);
  }

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md

var defaultRender = md.renderer.rules.image;

function renderResponsive(md, tokens, idx, options) {
    let token = tokens[idx];
    let src = "./"+ token.attrs[0][1];
    let alt = token.content;
    let cls = "image";
    let widths = options.widths;
    let sizes = options.sizes;
    let htmlResult = responsiveImage(src, cls, alt, sizes, widths);
    return htmlResult;
  };

function responsive_image(md, options) {
  return function (tokens, idx, opt, env, slf) {
    return renderResponsive(md, tokens, idx, options);
  };
};

module.exports = function responsive_plugin(md, options) {
  if (!options) {
    throw new Error('markdown-it-responsive needs options');
  }
  md.renderer.rules.image = responsive_image(md, options);
};
