module.exports = jesh

var syntax = [{
  find: /\b(function|return|var|if|else|for|do|while|break|continue|switch|case|default|let|const|await)\b/g,
  replace: '<span class="keyword">$1</span>'
},{
  find: /\b([^(\W]+)(\s*)\(/g,
  replace: '<span class="function">$1</span>$2('
}]

var comments = {
  find: [
    /([^:'"])(\/\/.*)/,
    /(.*)(\/\*[^\*]*\*\/)/
  ],
  replace: function (c) {
    return c[1] + '<span class="comment">' + c[2] + '</span>'
  }
}

function jesh (source) {
  var placeholder = Date.now()
  var placeheld = []

  // Replace each comment with a placeholder
  comments.find.forEach(function (type) {
    var a, b, c
    while (c = type.exec(source)) {
      b = source.substring(0, c.index)
      a = source.substring(c.index + c[0].length)
      source = b + placeholder + a
      type = RegExp(type)
      placeheld.push(c)
    }
  })

  // Ensure placeheld comments are
  // re-inserted in the correct order
  placeheld.sort(function (a, b) {
    return a.index - b.index
  })

  var c, s, i = 0

  // Highlight syntax
  while (s = syntax[i++]) source = source
    .replace(s.find, s.replace)

  // Re-insert comments
  while (c = placeheld.shift()) source = source
    .replace(placeholder, comments.replace(c))

  return source
}
