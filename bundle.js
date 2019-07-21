(function(){
var _$jesh_2 = jesh

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

var _$editor_1 = {};
/* removed: var _$jesh_2 = require(2) */;

var editor = document.createElement('main')
var input = document.createElement('code')
var ui = document.createElement('code')

editor.className = 'editor'
ui.className = 'ui'

input.className = 'input'
input.setAttribute('contenteditable', '')
input.setAttribute('autocomplete', 'off')
input.setAttribute('autocorrect', 'off')
input.setAttribute('spellcheck', 'false')

input.onkeydown = function (e) {
  if (e.keyCode === 13 || e.keyCode === 9) {
    e.preventDefault()

    if (e.keyCode === 13) insert('\n')
    if (e.keyCode === 9 && !e.shiftKey) insert('  ')
  }
}

input.onkeyup = function () {
  ui.innerHTML = _$jesh_2(esc(input.textContent))
}

input.onpaste = function (e) {
  e.preventDefault()
  if (e.clipboardData) insert(e.clipboardData.getData('text/plain'))
  else if (clipboardData) insert(clipboardData.getData('Text'))
}

input.textContent = esc(_$jesh_2)
input.onkeyup()

editor.appendChild(ui)
editor.appendChild(input)
document.body.appendChild(editor)

function insert (text) {
  if (text && document.activeElement === input) {
    if (document.queryCommandSupported('insertHTML')) {
      document.execCommand('insertHTML', false, text)
      return input.onkeyup()
    }

    var range = document.getSelection().getRangeAt(0)
    var node = document.createTextNode(text)
    range.deleteContents()
    range.insertNode(node)
    range.selectNodeContents(node)
    range.collapse(false)

    var selection = getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    input.onkeyup()
  }
}

function esc (fn) {
  return fn.toString()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

}());
