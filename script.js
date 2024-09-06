var Is_Clicked = false
var Current_Color = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
var Default_Color = getComputedStyle(document.documentElement).getPropertyValue('--default-color');
var Fill_Mode = false
var COLORS = [
  'rgb(62, 62, 62)',
  'rgb(255, 102, 46)',
  'rgb(26, 218, 84)',
  'rgb(83, 15, 255)', 
  'rgb(255, 236, 26)', 
  'rgb(142, 229, 255)']
var Current_ColorCode = '1'

function get_result_from_cookie(){
  let cookies = document.cookie.split('; ')
  console.log(cookies)
  for(let i=0; i<cookies.length; i++){
    let  cookie = cookies[i].split('=')
    console.log(cookie)
    if (cookie[0] == 'pixel-result'){
      return  cookie[1]
    }
  }
  return '0'*450
}

document.addEventListener('mousedown', function(){
  Is_Clicked = true;
})
document.addEventListener('mouseup', function(){
  Is_Clicked = false;
})

let field = document.querySelector('.field')
let temp_result = get_result_from_cookie()
console.log('temp-result', temp_result)
if (temp_result!='0'){
  for (let i = 0; i<450; i++){
    let cell = document.createElement('div')
    cell.classList.add('cell')
    cell.setAttribute('id', `${i}`)
    cell.dataset.color = temp_result[i]
    cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
    field.appendChild(cell)
  }
}
else{
  for (let i = 0; i<450; i++){
    let cell = document.createElement('div')
    cell.classList.add('cell')
    cell.setAttribute('id', `${i}`)
    cell.dataset.color = '0'
    cell.style.backgroundColor = COLORS[0]
    field.appendChild(cell)
}}


let cells = document.querySelectorAll('.cell')
cells.forEach(cell =>{
  cell.addEventListener('mouseover', function(){
    if (Is_Clicked){
      anime({
        targets: cell,
        background: Current_Color,
        duration: 200,
        easing: 'linear'
      })
      cell.dataset.color = Current_ColorCode
    }
  })
  cell.addEventListener('mousedown', function(){
  if (Fill_Mode){
      let cell_id = parseInt(cell.getAttribute('id'))
      Fill_Mode = !Fill_Mode
    anime({
      targets: '.cell',
      background: Current_Color,
      easing: 'easeInOutQuad',
      duration: 500,
      delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
    })
    for (let i = 0; i<cells.length; i++){
      cells[i].dataset.color = Current_ColorCode
    }
}
    else{
      anime({
        targets: cell,
        background: Current_Color,
        duration: 500,
        easing: 'easeInOutQuad'
      })
      cell.dataset.color = Current_ColorCode
    }
})
})

let color_cells = document.querySelectorAll('.color-cell')
color_cells.forEach(color_cell => {
  color_cell.addEventListener('click', function(){
    Fill_Mode = false
    Current_Color = getComputedStyle(color_cell).backgroundColor;
    Current_ColorCode = color_cell.dataset.colorcode
    
    document.documentElement.style.cssText = `--current_color: ${Current_Color}`
    document.querySelector('.selected').classList.remove('selected')
    color_cell.classList.add('selected')
  })
})

document.querySelector('.eraser').addEventListener('click', function(){
  Current_Color = Default_Color
  Current_ColorCode = '0'
  document.documentElement.style.cssText = `--current-color: ${Current_Color}`
  document.querySelector('.selected').classList.remove('selected')
  this.classList.add('selected')
})

document.querySelector('.fill-tool').addEventListener('click', function(){
  Fill_Mode = !Fill_Mode
  document.querySelector('.selected').classList.remove('selected')
  this.classList.add('selected')
})

setInterval(function(){
  let result = ''
  let temp_cells = document.querySelectorAll('.cell')
  for (let i =0; i<temp_cells.length; i++){
    result +=`${temp_cells[i].dataset.color}`
  }
  
  document.cookie = `pixel-result=${result};max-age=100000`
  console.log(document.cookie)
}, 60000)

document.querySelector('.save-tool').addEventListener('click', function(){
  domtoimage.toJpeg(field, {quality:2})
  .then(function(dataUrl){
    var img = new Image();
    img.src = dataUrl;
    let link = document.createElement('a');
    link.dowload = 'pixel.jpg'
    link.href = dataUrl;
    link.click();
  })
  .catch(function(error){
    console.error('oops, something went wrong!', error);
  });
})
