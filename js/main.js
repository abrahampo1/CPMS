let combo = 0




const notes = [
    "D", "F", "J", "K"
]

var playing = false
selectedsong = JSON.parse(localStorage.getItem('song'))

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
  var i = 0
  selectedsong.notes.forEach((note) => {
    if (
      note.tick + 1000 >
      Math.round(document.getElementById('music').currentTime * 1000)
    ) {
      if (note.key != 'full') {
        $('.line').append(`
                        <div class="prop " id="note${
                          note.tick
                        }" style="width: ${$('#key' + (note.key + 1)).css(
          'width',
        )};left:${
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

      let d = {
        0: '',
        1: '',
        2: '',
        3: '',
      }

      d[note.key] = 'selected'

      $('.log').append(`<div class="note">
              ${i} /  <select onchange="change_note_key(${i}, this.value)" value="${note.key}">
              
              <option value="0" ${d[0]}>D</option>
              <option value="1" ${d[1]}>F</option>
              <option value="2" ${d[2]}>J</option>
              <option value="3" ${d[3]}>K</option>
              
              </select> / <input type="text" value="${note.letter}" onchange="change_note_letter(${i}, this.value)"> / <input type="number" value="${note.tick}" onchange="change_note_tick(${i}, this.value)"> / <strong onclick="delete_note(${i})" class="error">ELIMINAR</strong>
          </div>`)
      i++
    }
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

function change_note_tick(note, value) {
  selectedsong.notes[note].tick = value
  render_notes()
}

function change_note_letter(note, value) {
  selectedsong.notes[note].letter = value
  render_notes()
}

function change_note_key(note, value) {
  selectedsong.notes[note].key = value
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
        if (e.key.toUpperCase() == notes[$(element).attr('data-key')]) {
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
        $('#combo h1').text(combo)
        if(combo > 100){
            $('#combo h1').addClass('vibrate-1')
        }else{
            $('#combo h1').removeClass('vibrate-1')

        }
        $(element).css('opacity', '0')
        $(element).stop()
        if (position > -10 && position < 10) {
          points = points + (10 * (1+ (combo / 100)))
        } else if (position > -30 && position < 30) {
          points = points + (5 * (1+ (combo / 100)))
        } else if (position > -150 && position < 20) {
          points = points + (1 * (1+ (combo / 100)))
        }
        points = Math.round(points)
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
    $('#combo h1').text(combo)
  }
})
