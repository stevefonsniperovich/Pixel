// Флаги и значения
var CURRENT_COLOR = "rgb(255, 0, 0)"; // Начальный цвет (красный)
var DEFAULT_COLOR = "rgb(255, 255, 255)";   // Цвет по умолчанию (темно-серый)
var IS_CLICKED = false; // Флаг для отслеживания состояния кнопки мыши
var FILL_MODE = false; // Флаг для режима заливки




// Массив соответствия классов и цветов
var COLOR_MAP = {
    "red1": "rgb(255, 0, 0)",
    "orange1": "rgb(255, 140, 0)",
    "yellow1": "rgb(251, 255, 0)",
    "green1": "rgb(0, 153, 10)",
    "l-blue1": "rgb(0, 199, 234)",
    "blue1": "rgb(4, 0, 234)",
    "purple1": "rgb(144, 0, 234)",
    "white1": "rgb(255, 255, 255)",
    "black1": "rgb(0, 0, 0)",
};

function get_result_from_cookie(){
    let cookies = document.cookie.split('; ')
    for (let i = 0; i < cookies; i+=1){
        let cookie = cookies[i].split('=')
        console.log(cookie)
        if (cookie[0] == 'pixel-result'){
            return cookie[1]
        }
    }
    return '0' * 450
}

let grid = document.querySelector('.grid')
let temp_result = get_result_from_cookie()
if (temp_result != '0') {
    for (let i = 0; i < 450; i+=1) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}`)
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
        grid.appendChild(cell)
    }
} else {
	for (let i = 0; i < 450; i += 1) {
		let cell = document.createElement('div')
		cell.classList.add('cell')
		cell.setAttribute('id', `${i}`) // Добавляем ID для анимации
		grid.appendChild(cell)
	}
}

// Отслеживаем состояние кнопки мыши
document.addEventListener('mousedown', function() {
    IS_CLICKED = true;
});


document.addEventListener('mouseup', function() {
    IS_CLICKED = false;
});

// Каждой ячейке добавляем обработчики событий
let cells = document.querySelectorAll('.cell')
for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
   
    // Обработчик клика (для одиночного закрашивания)
    cell.addEventListener('click', function() {
        cell.classList.add('anime')
        anime({
            targets: '.anime',
            backgroundColor: CURRENT_COLOR,
            duration: 300,
            easing: 'linear',
        })
        cell.classList.remove('anime')
    })
   
    // Обработчик наведения мыши (для рисования с зажатой кнопкой)
    cell.addEventListener('mouseover', function() {
        if (IS_CLICKED) {
            cell.classList.add('anime')
            anime({
                targets: '.anime',
                backgroundColor: CURRENT_COLOR,
                duration: 300,
                easing: 'linear',
            })
            cell.classList.remove('anime')
        }
    })
   
    // Обработчик нажатия мыши на ячейке
    cell.addEventListener('mousedown', function() {
         if (FILL_MODE) {
            // Если включен режим заливки, анимируем заливку всех ячеек
            let cell_id = parseInt(cell.getAttribute('id'));
           
            anime({
                targets: '.cell',
                backgroundColor: CURRENT_COLOR,
                easing: 'easeInOutQuad',
                duration: 500,
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
            });
           
            // После анимации устанавливаем цвет для всех ячеек
            setTimeout(() => {
                for (let j = 0; j < cells.length; j++) {
                    cells[j].style.backgroundColor = CURRENT_COLOR;
                }
            }, 1000); // Задержка чуть больше максимальной длительности анимации
        } else {
            cell.classList.add('anime')
            anime({
                targets: '.anime',
                backgroundColor: CURRENT_COLOR,
                duration: 300,
                easing: 'linear',
            })
            cell.classList.remove('anime')
        }
    })
   
   
}


// Выбор цвета из палитры
let color_cells = document.querySelectorAll('.color')
for (let i = 0; i < color_cells.length; i++) {
    let color_cell = color_cells[i];
    color_cell.addEventListener('click', function() {
        // Определяем цвет по классу элемента
        let colorClass = "";
        if (color_cell.classList.contains("red")) colorClass = "red1";
        else if (color_cell.classList.contains("orange")) colorClass = "orange1";
        else if (color_cell.classList.contains("yellow")) colorClass = "yellow1";
        else if (color_cell.classList.contains("green")) colorClass = "green1";
        else if (color_cell.classList.contains("l-blue")) colorClass = "l-blue1";
        else if (color_cell.classList.contains("blue")) colorClass = "blue1";
        else if (color_cell.classList.contains("purple")) colorClass = "purple1";
        else if (color_cell.classList.contains("white")) colorClass = "white1";
        else if (color_cell.classList.contains("black")) colorClass = "black1";
       
        // Устанавливаем текущий цвет
        CURRENT_COLOR = COLOR_MAP[colorClass];
       
        // Выключаем режим заливки при выборе цвета
        FILL_MODE = false;
       
        // Обновляем выделение в палитре
        document.querySelector('.selected').classList.remove('selected')
        color_cell.classList.add('selected')
    })
}


// Обработчик для ластика
document.querySelector('.eraser').addEventListener('click', function() {
    CURRENT_COLOR = DEFAULT_COLOR;
    FILL_MODE = false; // Выключаем режим заливки при выборе ластика
   
    // Убираем выделение с предыдущего выбранного элемента
    document.querySelector('.selected').classList.remove('selected')
   
    // Добавляем выделение на ластик
    this.classList.add('selected')
})


// Обработчик инструмента заливки
document.querySelector('.fill-tool').addEventListener('click', function() {
    FILL_MODE = true;
   
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})

setInterval(function(){
    let result = '';
    let temp_cells = document.querySelectorAll('.cell');
    for (let i = 0; i < temp_cells.length; i += 1){
        let cell = temp_cells[i];
        let color = cell.style.backgroundColor;
        let colorIndex = "7"
        for (let j = 0; j < COLOR_MAP.length; j+=1){
            if (color === COLOR_MAP[j]){
                colorIndex = j.toString();
            }
        }
        result += colorIndex;
    }
    document.cookie = `pixel-result=${result}; max-age=10000000000000`;
}, 60000)

let save = document.querySelector('.save_btn')
save.addEventListener('click', function(){
    anime({
        targets: '.save_btn',
        rotate: 1080,
        scale: [
            {value: 0.5, duration: 500},
            {value: 2, duration: 500},
            {value: 1, duration: 500},
        ],
        duration: 1500,
        easing: 'linear',
    })
    domtoimage.toJpeg(document.getElementById('grid_id'), { quality: 2 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image.jpeg';
        link.href = dataUrl;
        link.click();
    });
})

let mbt = document.querySelector('.mbt')
mbt.addEventListener('click', function(){
    anime({
        targets: 'header',
        opacity: 0,
        duration: 1000,
        easing: 'linear',
    })
    anime({
        targets: 'main',
        opacity: 0,
        duration: 1000,
        easing: 'linear',
    })
    anime({
        targets: '.programm',
        opacity: 1,
        duration: 1000,
        easing: 'linear',
    })
})

let back_btn = document.querySelector('.back_btn')
back_btn.addEventListener('click', function(){
    anime({
        targets: 'header',
        opacity: 1,
        duration: 1000,
        easing: 'linear',
    })
    anime({
        targets: 'main',
        opacity: 1,
        duration: 1000,
        easing: 'linear',
    })
    anime({
        targets: '.programm',
        opacity: 0,
        duration: 1000,
        easing: 'linear',
    })
})
