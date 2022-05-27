let combo = 0

const test = {
  name: 'SEXO',
  length: 100,
  musicurl:
    'https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3',
  notes: [
    {
      tick: 1000,
      key: 'full',
      letter: ' ',
    },
    {
      tick: 19500,
      key: 0,
      letter: 'w',
    },
    {
      tick: 20000,
      key: 1,
      letter: 'e',
    },

    {
      tick: 20200,
      key: 2,
      letter: 'r',
    },
    {
      tick: 20300,
      key: 'full',
      letter: ' ',
    },
    {
      tick: 20400,
      key: 2,
      letter: 'n',
    },
    {
      tick: 20500,
      key: 3,
      letter: 'o',
    },
  ],
}
const vtinto = {
  name: 'VINO TINTO',
  length: 100,
  musicurl:
    'https://dl1.iyoutubetomp4.com/file/youtubeNOjgze5Nmzc134.mp4?fn=Estopa%20-%20Vino%20Tinto.mp4',
  notes: [
    {
      tick: 1100,
      key: 0,
      letter: 'H',
    },
    {
      tick: 1200,
      key: 1,
      letter: 'A',
    },

    {
      tick: 1300,
      key: 2,
      letter: 'Y',
    },
    {
      tick: 2000,
      key: 0,
      letter: '',
    },
    {
      tick: 2100,
      key: 1,
      letter: '',
    },
    {
      tick: 2200,
      key: 2,
      letter: '',
    },
    {
      tick: 2300,
      key: 2,
      letter: '',
    },
  ],
}

var selectedsong = vtinto

const notes = {
  '0': {
    note: 'D',
  },
  '1': {
    note: 'F',
  },
  '2': {
    note: 'J',
  },
  '3': {
    note: 'K',
  },
}

var playing = false

function startup() {
  if (!playing) {
    document.getElementById('music').src = selectedsong.musicurl
    document.getElementById('music').play()
    document.getElementById('music').onplay = function () {
      start()
    }
    playing = true
  }
}

function set_song(song) {
    selectedsong.musicurl = song
    startup()
}

function render_notes(params) {
  $('.line').html('')
  $('.log').html('')
  var i = 0;
  selectedsong.notes.forEach((note) => {
    if (note.key != 'full') {
      $('.line').append(`
                  <div class="prop " id="note${note.tick}" style="width: ${$(
        '#key' + (note.key + 1),
      ).css('width')};left:${
        parseInt($('#key' + (note.key + 1)).css('width')) * note.key +
        2 * note.key
      }px; animation-delay: ${note.tick - 1000}ms;  bottom:${
        note.tick
      };" data-key="${note.key}" data-time="${note.tick}">${note.letter}</div>
                  `)
    } else {
      $('.line').append(`
                  <div class="prop " id="note${
                    note.tick
                  }" style="width: calc(100% - 2px);left:1px; bottom:${
        note.tick
      }; animation-delay: ${note.tick - 1000}ms;" data-key="${
        note.key
      }" data-time="${note.tick}">${note.letter}</div>
                  `)
    }

    $('.log').append(`<div class="note">
        ${i} / ${note.key} / ${note.letter} / <input type="number" value="${note.tick}" onchange="change_note(${i}, this.value)"> / <strong onclick="delete_note(${i})" class="error">ELIMINAR</strong>
    </div>`)
    i++
  })
  $('.prop').on('animationend', (e) => {
    $(e).remove()
  })
}
function save() {
  localStorage.setItem('saved_song', JSON.stringify(selectedsong))
  alert('guardado')
}

function get_saved() {
  selectedsong = JSON.parse(localStorage.getItem('saved_song'))
  render_notes()
}

function delete_note(note) {
    delete selectedsong.notes[note]
    selectedsong.notes.sort()
    render_notes()
}

function change_note(note, value) {
    selectedsong.notes[note].tick = value
    render_notes()
}

function add_note(key, letter = '') {
  selectedsong.notes.push({
    tick: Math.round(document.getElementById('music').currentTime * 1000),
    key: key,
    letter: letter,
  })
  render_notes()
}

function start() {}
var points = 0
render_notes()
setInterval(() => {
  $('#tick').text(
    Math.round(document.getElementById('music').currentTime * 1000),
  )
  $('.progre').css(
    'width',
    (document.getElementById('music').currentTime /
      document.getElementById('music').duration) *
      100 +
      '%',
  )
  $('.prop').each(function (index, element) {
    $(element).css(
      'bottom',

      $(element).attr('data-time') -
        document.getElementById('music').currentTime * 1000,
    )
  })
}, 1)

selectedsong.notes.forEach((note) => {
  setTimeout(() => {
    $('#note' + note.tick).css('bottom', '-150px')
  }, note.tick * 100)
})

$('html').keydown(function (e) {
  let found = false
  $('.prop').each(function (index, element) {
    if (!found) {
      var position = $(element).position()
      if (
        position.top < 20 &&
        position.top > -150 &&
        $(element).text().toUpperCase() == ''
      ) {
        if (e.key.toUpperCase() == notes[$(element).attr('data-key')].note) {
          click_note(position.top)
        }
      }

      if (
        position.top > -100 &&
        position.top < 20 &&
        e.key.toUpperCase() == $(element).text().toUpperCase()
      ) {
        click_note(position.top)
      }
      function click_note(position) {
        combo = combo + 1
        $('#combo').text(combo)
        $(element).css('opacity', '0')
        $(element).stop()
        if (position > -10 && position < 10) {
          points = points + 10
        } else if (position > -30 && position < 30) {
          points = points + 5
        } else if (position > -150 && position < 20) {
          points = points + 1
        }
        $('#points').text(points)

        setTimeout(() => {
          $(element).remove()
        }, 100)
        found = true
      }
    }
  })
  if (!found) {
    combo = 0
    $('#combo').text(combo)
  }
})
