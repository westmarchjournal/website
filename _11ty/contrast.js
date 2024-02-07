module.exports = function(color, light, dark) {
    let r = 0;
    let g = 0;
    let b = 0;
    if (color[0] == "#") {
        // parse hex code to decimal
        r = parseInt(color[1] + color[2], 16)
        g = parseInt(color[3] + color[4], 16)
        b = parseInt(color[5] + color[6], 16)
    }
    else {throw new Error("Error: contrast.js only accepts hexadecimal color codes")};
    // should probably add parsing for rgb() and hsl()...
    // also this should probably be able to have more variance than just light and dark...
    // https://css-tricks.com/css-variables-calc-rgb-enforcing-high-contrast-colors/
    var sum = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return (sum > 128) ? dark : light;
}