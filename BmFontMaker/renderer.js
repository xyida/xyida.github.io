
let imageList = []
let canvasWidth = 256
let canvasHeight = 256
let fontSize = 32
let fontName = 'test'
let previewStr = ''

const input_fontName = document.getElementById('input_fontName');
input_fontName.value = fontName
input_fontName.addEventListener('input', () => {
    fontName = input_fontName.value
});

const input_CanvasWidth = document.getElementById('input_CanvasWidth');
input_CanvasWidth.value = canvasWidth
input_CanvasWidth.addEventListener('input', () => {
    canvasWidth = input_CanvasWidth.value
    updateCanvas()
});

const input_CanvasHeight = document.getElementById('input_CanvasHeight');
input_CanvasHeight.value = canvasHeight
input_CanvasHeight.addEventListener('input', () => {
    canvasHeight = input_CanvasHeight.value
    updateCanvas()
});

const input_preview = document.getElementById('input_preview');
input_preview.addEventListener('input', () => {
    previewStr = input_preview.value
    updateCanvasPreview()
});

const div_font_setting = document.getElementById('div_font_setting');

const drop_zone = document.getElementById('drop_zone')
drop_zone.ondragover = (e) => {
    e.preventDefault()
    e.stopPropagation()
}
drop_zone.ondrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let dt = e.dataTransfer;
    let files = dt.files;

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let imageType = /^image\//;

        if (!imageType.test(file.type)) {
            continue;
        }

        let img = document.createElement("img");
        let reader = new FileReader();
        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
                aImg.onload = () => {
                    let fileName = file.name.split('.')[0];
                    let data = {
                        img: aImg,
                        char: fileName.substr(fileName.length - 1, 1),
                        width: aImg.width,
                        height: aImg.height,
                        x: 0,
                        y: 0,
                        xoffset: 0,
                        yoffset: 0,
                        xadvance: aImg.width,
                    }

                    div_font_setting.appendChild(aImg);
                    let input_char = document.createElement('input')
                    input_char.size = 1
                    input_char.value = data.char
                    input_char.addEventListener('input', () => {
                        data.char = input_char.value
                        updateCanvasPreview()
                    });
                    div_font_setting.appendChild(input_char)

                    let info = document.createElement("span");
                    info.innerHTML = "xadvance:";
                    div_font_setting.appendChild(info)
                    let input_xadvance = document.createElement('input')
                    input_xadvance.size = 1
                    input_xadvance.value = data.xadvance
                    input_xadvance.type = 'number'
                    input_xadvance.addEventListener('input', () => {
                        data.xadvance = Number(input_xadvance.value)
                        updateCanvasPreview()
                    });
                    div_font_setting.appendChild(input_xadvance)

                    info = document.createElement("span");
                    info.innerHTML = "xoffset:";
                    div_font_setting.appendChild(info)
                    let input_xoffset = document.createElement('input')
                    input_xoffset.size = 1
                    input_xoffset.value = data.xoffset
                    input_xoffset.type = 'number'
                    input_xoffset.addEventListener('input', () => {
                        data.xoffset = Number(input_xoffset.value)
                        updateCanvasPreview()
                    });
                    div_font_setting.appendChild(input_xoffset)

                    info = document.createElement("span");
                    info.innerHTML = "yoffset:";
                    div_font_setting.appendChild(info)
                    let input_yoffset = document.createElement('input')
                    input_yoffset.size = 1
                    input_yoffset.value = data.yoffset
                    input_yoffset.type = 'number'
                    input_yoffset.addEventListener('input', () => {
                        data.yoffset = Number(input_yoffset.value)
                        updateCanvasPreview()
                    });
                    div_font_setting.appendChild(input_yoffset)

                    let br = document.createElement('br')
                    div_font_setting.appendChild(br)

                    imageList.push(data);
                    updateCanvas();
                };
            };
        })(img);
        reader.readAsDataURL(file);
    }
}

const canvas_font = document.getElementById('canvas_font')
const canvas_font_ctx = canvas_font.getContext('2d')
function updateCanvas() {
    canvas_font.width = canvasWidth
    canvas_font.height = canvasHeight
    canvas_font_ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    let height = 0;
    let space = 2;
    let x = space;
    let y = space;
    imageList.forEach(img => {
        if (img.height > height) height = img.height;
    });
    height = Math.ceil(height);
    fontSize = height;
    imageList.forEach(img2 => {
        let img = img2.img
        if (x + img2.width + space > canvasWidth) {
            x = space;
            y += height + space;
        }
        canvas_font_ctx.drawImage(img, x, y);
        img2.x = x;
        img2.y = y;
        x += img2.width + space;
    });
}


const button_save = document.getElementById('button_save')
button_save.addEventListener('click', event => {
    canvas_font.toBlob(function (blob) {
        saveAs(blob, fontName + ".png");
    });
    // let str = `info size=${fontSize} unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1 outline=0 common lineHeight=${fontSize} base=23 scaleW=${canvasWidth} scaleH=${canvasHeight} pages=1 packed=0 page id=0 file="${fontName}.png" chars count=${imageList.length}\n`;
    let str = `info face="${fontName}" size=${fontSize} bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1
common lineHeight=${fontSize} base=26 scaleW=${canvasWidth} scaleH=${canvasHeight} pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
page id=0 file="${fontName}.png"
chars count=${imageList.length}\n`
    let total_width = 0;
    imageList.forEach(img => {
        str += `char id=${img.char.charCodeAt(0)} x=${img.x} y=${img.y} width=${img.width} height=${img.height} xoffset=${img.xoffset} yoffset=${img.yoffset} xadvance=${img.xadvance} \n`;
        total_width += img.width;
    })
    let space_width = Math.ceil(total_width / imageList.length)
    str += `char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=${space_width} page=0 chnl=0 letter=" "\n`
    str += `char id=9 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=${space_width * 8} page=0 chnl=0 letter="  "\n`
    // console.log(str)
    let blob = new Blob([str], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fontName + ".fnt");
});


function clear(){
    div_font_setting.innerHTML = ''
    imageList = []
    updateCanvas()
    previewStr = ''
    updateCanvasPreview()
}

const button_clear = document.getElementById('button_clear')
button_clear.addEventListener('click', event => {
    clear()
});


const canvas_preview = document.getElementById('canvas_preview')
const canvas_preview_ctx = canvas_preview.getContext('2d')
function updateCanvasPreview() {
    let _string = previewStr
    let textLen = _string.length;
    let map = {}
    let xadvance = 0
    let height = 0
    imageList.forEach(img => {
        map[img.char.charCodeAt(0)] = img
        if (img.height > height) height = img.height;
        if (img.xadvance > xadvance) xadvance = img.xadvance;
    });
    let width = xadvance * textLen
    canvas_preview.width = width
    canvas_preview.height = height
    canvas_preview_ctx.clearRect(0, 0, width, height)
    let startX = 0
    let y = 0
    // console.log('updateCanvasPreview', _string)
    for (let index = 0; index < textLen; index++) {
        let character = _string.charCodeAt(index);
        let img = map[character]
        if (img) {
            // console.log('drawImage', index, character, img, startX)
            canvas_preview_ctx.drawImage(img.img, startX + img.xoffset, y + img.yoffset);
            startX += img.xadvance
        }
    }
}

clear()

console.warn(
    `
/*
https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ

*/

// 欢迎关注微信公众号[白玉无冰]

/**
█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄██▀▄ ▄▄██ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄▀▀▀█▄▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀▀ ▀▄▄ ▄ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄ █ █ ▀ ▀▄█▄▀████
████▀ ▄  █▄█▀█▄█▀█  ▀▄ █ ▀ ▄▄██▀█████
████ ▄▀▄▄▀▄ █▄▄█▄ ▀▄▀ ▀ ▀ ▀▀▀▄ █▀████
████▀ ██ ▀▄ ▄██ ▄█▀▄ ██▀ ▀ █▄█▄▀█████
████   ▄██▄▀ █▀▄▀▄▀▄▄▄▄ ▀█▀ ▀▀ █▀████
████ █▄ █ ▄ █▀ █▀▄█▄▄▄▄▀▄▄█▄▄▄▄▀█████
████▄█▄█▄█▄█▀ ▄█▄   ▀▄██ ▄▄▄ ▀   ████
████ ▄▄▄▄▄ █▄██ ▄█▀  ▄   █▄█  ▄▀█████
████ █   █ █ ▄█▄ ▀  ▀▀██ ▄▄▄▄ ▄▀ ████
████ █▄▄▄█ █ ▄▄▀ ▄█▄█▄█▄ ▀▄   ▄ █████
████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄▄█▄██████
█████████████████████████████████████
█████████████████████████████████████
*/
    `
)