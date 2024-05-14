let split = function(title) {
    return title.split(":")
}

module.exports = {
    shortTitle: (title) => split(title)[0],
    subtitle: (title) => split(title)[1]
}