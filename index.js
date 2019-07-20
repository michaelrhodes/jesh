module.exports = jesh

var syntax = [{
  find: /\b(return|if|for|var|else|break|while|function|continue)\b/g,
  replace: '<span class="keyword">$1</span>'
},{
  find: /\b([^(\W]+)(\s*)\(/g,
  replace: '<span class="function">$1</span>$2('
}]

var exclude = [
  { type: 'comment', find: /([^:'"])(\/\/.*)/ },
  { type: 'comment', find: /(.*)(\/\*[^\*]*\*?\/?)/ },
  { type: 'string', find: /(['"`][^'"`]*['"`]?)/ }
]

var replace = {
  comment: function (c) {
    return c[1] + '<span class="comment">' + c[2] + '</span>'
  },
  string: function (s) {
    return '<span class="string">' + s[0] + '</span>'
  }
}

function jesh (source) {
  var placeholder = Date.now()
  var excluded = []

  // Placehold excluded text
  exclude.forEach(function (e) {
    var a, b, x, find = e.find
    while (x = find.exec(source)) {
      x.type = e.type
      b = source.substring(0, x.index)
      a = source.substring(x.index + x[0].length)
      source = b + placeholder + a
      find = RegExp(e.find)
      excluded.push(x)
    }
  })

  // Ensure excluded text is re-inserted
  // in its correct position
  excluded.sort(function (a, b) {
    return a.index - b.index
  })

  var x, i = 0

  // Highlight syntax
  while (x = syntax[i++]) source = source
    .replace(x.find, x.replace)

  // Re-insert excluded text
  while (x = excluded.shift()) source = source
    .replace(placeholder, replace[x.type](x))

  return source
}
