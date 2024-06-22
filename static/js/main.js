let numofimg = 0;
let imgSrcArr = [];
let imageSelectIcons;
let isImgSelected = [];
let ImagesUploadedToBackend = []
let imageFormData = new FormData();
let isEditing = false;

window.isImgSelected = isImgSelected // globale letiable for another files 
let popUpWindow = document.querySelector(".popUp")
//upload image by selceting 
const loadFile = (event) => {
    for (let i = numofimg; i < ((event.target.files.length) + numofimg); i++) {
        //creat a container for each image
        let imageCont = document.createElement('div');
        imageCont.className = "imageCont";
        imageCont.id = "imageCont-" + i;
        document.querySelector(".cont").appendChild(imageCont);
        addSelectImg(i);

        // get images link and creat images
        let image = document.createElement('img');
        image.src = URL.createObjectURL(event.target.files[i - numofimg]);
        image.setAttribute('name', event.target.files[i - numofimg].name) // insert attribute name to refer to the name file of image
        imgSrcArr.push(image.src);
        image.id = `imageNum-` + i;
        image.className = "myImg"
        document.querySelector("#imageCont-" + i).appendChild(image);
        /*
        collect the image uploaded to send to back-end
        */
        imageFormData.append('files', event.target.files[i - numofimg])
        imageFormData.append('name', event.target.files[i - numofimg].name)
        //get a natural size for image and creat a span for each image to show the size of image
        image.onload = () => {
            getSize(image, i);
        }
    }
    fetch(`${window.location.href}/ImageUploaded`, {
        method: 'POST',
        body: imageFormData,
    }).then(function (response) {
        imageFormData = new FormData();
    })
    document.getElementById("upload").classList.add("disableUpload")
    document.getElementById("moreUpload").classList.remove("disableUpload")
    document.querySelector(".sidebar").classList.remove("hiddenSidebar")
    document.querySelector(".primContineer").style = "width: calc(100vw - 300px); margin-left: 300px;"
    numofimg += event.target.files.length;
    imageSelectIcons = document.querySelectorAll(".selectIcon");
    imageSelectIcons.forEach(getImgSelected);
    imagePopUp();

};

//upload image by drag and drop
const dragging = (e) => {
    e.preventDefault();
};

const onDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    for (let i = numofimg; i < (files.length) + numofimg; i++) {
        let imageCont = document.createElement('div');
        imageCont.className = "imageCont";
        imageCont.id = "imageCont-" + i;
        document.querySelector(".cont").appendChild(imageCont);

        addSelectImg(i);

        // get images link and creat images
        let image = document.createElement('img');
        image.src = URL.createObjectURL(files[i - numofimg]);
        imgSrcArr.push(image.src);
        image.id = `imageNum-` + i;
        image.className = "myImg"
        image.setAttribute('name', files[i - numofimg].name) // insert attribute name to refer to the name file of image
        document.querySelector("#imageCont-" + i).appendChild(image);

        imageFormData.append('files', files[i - numofimg])
        imageFormData.append('name', files[i - numofimg].name)
        //get a natural size for image and creat a span for each image to show the size of image
        image.onload = function () {
            getSize(image, i);
        }

    }
    fetch(`${window.location.href}/ImageUploaded`, {
        method: 'POST',
        body: imageFormData,
    }).then(function (response) {
        imageFormData = new FormData();
    })
    document.getElementById("upload").classList.add("disableUpload")
    document.getElementById("moreUpload").classList.remove("disableUpload")
    numofimg += files.length;
    imageSelectIcons = document.querySelectorAll(".selectIcon");
    imageSelectIcons.forEach(getImgSelected);
    let allImg = document.querySelectorAll(".myImg")
    allImg.forEach(imagePopUp);
};



// get the size of the images (width*height) and add span element under the image in the page
function getSize(image, i) {
    let imgWidth = image.naturalWidth;
    let imgHight = image.naturalHeight;
    let txt = document.createTextNode(imgWidth + "x" + imgHight + " px");
    if (((image.parentNode.children).length) <= 2) {
        let size = document.createElement('span');
        size.id = "sizeOfImgNum-" + i;
        size.appendChild(txt)
        document.querySelector("#imageCont-" + i).appendChild(size);
    }
    else {
        document.getElementById("sizeOfImgNum-" + i).innerText = ""
        document.getElementById("sizeOfImgNum-" + i).appendChild(txt)
    }
}

// add selecting element for everry image after upload it
function addSelectImg(i) {
    let selectIcon = document.createElement('span');
    selectIcon.classList.add("selectIcon")
    selectIcon.id = "selectIcon" + i;
    document.querySelector("#imageCont-" + i).appendChild(selectIcon);
}

// get the selected images and push it to <isImgSelected> Array
function getImgSelected(item) {
    item.addEventListener('click', function () {
        if (!(item.classList.contains("bgFill"))) {
            item.classList.add("bgFill")
            isImgSelected.push(document.getElementById("imageNum-" + item.id.slice(10, item.id.length)).name)//change to name
            window.isImgSelected = isImgSelected
        }
        else {
            item.classList.remove("bgFill")
            isImgSelected = isImgSelected.filter(e => e !== (document.getElementById("imageNum-" + item.id.slice(10, item.id.length)).name))
            window.isImgSelected = isImgSelected
        }
    })
}

//  select custom size of image problem
let ResizeImgSelect = document.getElementById("ResizeImg")
let inputInResizeInput = document.querySelectorAll(".resizeInput input")
if (!(ResizeImgSelect.value === "custom")) {
    inputInResizeInput.forEach((e) => {
        e.value = null
        e.setAttribute("readonly", "readonly")
    })
}
else {
    inputInResizeInput.forEach((e) => {
        e.removeAttribute("readonly", "readonly")
    })
}

ResizeImgSelect.addEventListener("change", () => {
    if (!(ResizeImgSelect.value === "custom")) {
        inputInResizeInput.forEach((e) => {
            e.value = null
            e.setAttribute("readonly", "readonly")
        })
    }
    else {
        inputInResizeInput.forEach((e) => {
            e.removeAttribute("readonly", "readonly")
        })
    }
})

let ResizeHeader = document.querySelector('.ResizeHeader')
ResizeHeader.addEventListener("click", function () {
    let resizeCont = document.querySelector('.resizeCont')
    resizeCont.classList.remove("disable")
})

let ResizeCancle = document.querySelector('.ResizeCancle')
ResizeCancle.addEventListener('click', function () {
    let resizeCont = document.querySelector('.resizeCont')
    resizeCont.classList.add("disable")
})



let ulOfCol2 = document.querySelectorAll(".sidebar .row .col2 ul")
ulOfCol2.forEach((e, i) => {
    if (!(ulOfCol2[0] === e)) {
        e.classList.add("noneDisplay")
    }
})


let colOneSidebarList = document.querySelectorAll("#colOneSidebarList li")
colOneSidebarList.forEach((el, i) => {
    el.addEventListener("click", () => {
        if (isEditing == false) {
            if (el.classList.contains("TextSec") || el.classList.contains("StickerSec") || el.classList.contains("FrameSec")) {
                if (!popUpWindow.classList.contains("disable")) {
                    colOneSidebarList.forEach((el1, i2) => {
                        if (!(el == el1)) {
                            el1.classList.remove("liActive")
                            el1.firstElementChild.firstElementChild.src = el1.firstElementChild.firstElementChild.src.slice(0, el1.firstElementChild.firstElementChild.src.indexOf("com") + 3) + ".svg"
                            document.querySelector(".ulNum-" + i2).classList.add("noneDisplay")

                        }
                        else {
                            el.classList.add("liActive")
                            el.firstElementChild.firstElementChild.src = el.firstElementChild.firstElementChild.src.slice(0, el.firstElementChild.firstElementChild.src.indexOf("com") + 3) + "-fill.svg"
                            document.querySelector(".ulNum-" + i2).classList.remove("noneDisplay")
                        }
                    })
                    if (el.classList.contains("TextSec")) {
                        Text();
                    }
                    else if (el.classList.contains("StickerSec")) {
                        Sticker();
                    }

                    else if (el.classList.contains("FrameSec")) {
                        Frames();
                    }
                }
            }
            else {
                colOneSidebarList.forEach((el1, i2) => {
                    if (!(el == el1)) {
                        el1.classList.remove("liActive")
                        el1.firstElementChild.firstElementChild.src = el1.firstElementChild.firstElementChild.src.slice(0, el1.firstElementChild.firstElementChild.src.indexOf("com") + 3) + ".svg"
                        document.querySelector(".ulNum-" + i2).classList.add("noneDisplay")

                    }
                    else {
                        el.classList.add("liActive")
                        el.firstElementChild.firstElementChild.src = el.firstElementChild.firstElementChild.src.slice(0, el.firstElementChild.firstElementChild.src.indexOf("com") + 3) + "-fill.svg"
                        document.querySelector(".ulNum-" + i2).classList.remove("noneDisplay")
                    }
                })
            }
        }


    })

})

function croPImg() {
    let cropHeader = document.querySelector('.cropHeader');

    cropHeader.addEventListener("click", function () {
        let cropCont = document.querySelector('.cropCont')
        let image = document.querySelector('.mainImg img');
        let mainImg = document.querySelector(".popUp .mainImg .img")
        let srcofimgCrop = imgSrcArr.indexOf(image.src);


        if (!popUpWindow.classList.contains("disable")) {
            cropCont.classList.remove("disable")
            const cropper = new Cropper(image, {
                aspectRatio: NaN,
            });
            document.querySelector('#btn-crop').addEventListener('click', function () {
                let croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
                document.querySelector('.elseImg img').src = croppedImage;
                let cropedImg = document.createElement('img');
                cropedImg.src = croppedImage
                cropedImg.id = image.id
                document.querySelector(".imageCont img#" + cropedImg.id).src = cropedImg
                image.src = cropedImg.src;
                mainImg.innerHTML = "";
                mainImg.appendChild(cropedImg)
                image.classList.remove("cropper-hidden");

                document.querySelector(".cont .imageCont #" + image.id).src = cropedImg.src;

                imgSrcArr[srcofimgCrop] = cropedImg.src;
                manegSatur(cropedImg);
                setTimeout(function () {
                    convertImageToBase64(document.querySelector(".imageCont img#" + cropedImg.id), document.querySelector(".imageCont img#" + cropedImg.id).name);

                }, 100)
                // console.log()
            });
            let cropCancle = document.getElementById("btn-crop-cancle")
            cropCancle.addEventListener('click', function () {
                cropper.destroy();
                let cropCont = document.querySelector('.cropCont');
                cropCont.classList.add("disable");
                mainImg.innerHTML = " ";
                mainImg.appendChild(image);
                image.classList.remove("cropper-hidden")
                elseImage();

            })
        }
    })

}


function elseImage() {
    let elseImg = document.querySelector(".popUp .elseImg")
    elseImg.innerHTML = " ";
    for (let i = 1; i <= imgSrcArr.length; i++) {
        let image = document.createElement('img');
        image.src = imgSrcArr[i - 1]
        image.className = "imgPopUp-" + i
        elseImg.appendChild(image)
    }
}

function closePopUpFun(imggg, mainImg) {
    let closePopUp = document.querySelector(".closePopUp")
    closePopUp.addEventListener('click', () => {
        let cropCont = document.querySelector(".cropCont")
        if (cropCont.classList.contains("disable")) {
            let image = document.querySelector('.mainImg img');
            image.classList.remove("cropper-hidden")
            imggg.innerHTML = ''
            popUpWindow.classList.add("disable")
            document.querySelector(".cont").classList.remove("hidden")
            document.getElementById("moreUpload").style.opacity = 1;
            mainImg.innerHTML = ""
            let cropCont = document.querySelector('.cropCont')
            cropCont.classList.add("disable")
        }
    })
}

function preImageInPopUp(imggg) {
    let pre = document.querySelector(".pre")
    pre.addEventListener('click', () => {
        if (imgSrcArr.indexOf(imggg.src) > 0) {
            imggg.src = imgSrcArr[imgSrcArr.indexOf(imggg.src) - 1]
        }
        else {
            imggg.src = imgSrcArr[imgSrcArr.length - 1]
        }
        manegSatur(imggg);
    })
}

function nxtImageInPopUp(imggg) {
    let next = document.querySelector(".nex")
    next.addEventListener('click', () => {
        if (imgSrcArr.indexOf(imggg.src) < imgSrcArr.length - 1) {
            imggg.src = imgSrcArr[imgSrcArr.indexOf(imggg.src) + 1]
        }
        else {
            imggg.src = imgSrcArr[0]
        }
        manegSatur(imggg);
    })
}

function manegSatur(imggg) {
    for (let i = 1; i <= imgSrcArr.length; i++) {
        if (imggg.src == imgSrcArr[i - 1]) {
            document.querySelector(".imgPopUp-" + i).style.opacity = 1
        }
        else {
            document.querySelector(".imgPopUp-" + i).style.opacity = 0.5
        }
    }
}

function imagePopUp() {
    let mainImg = document.querySelector(".popUp .mainImg .img")
    let allImg = document.querySelectorAll("#moreUpload .imageCont img")
    let imggg = document.createElement("img")
    allImg.forEach((item, i) => {
        item.addEventListener('click', function () {
            imggg.src = item.src
            imggg.id = item.id;
            mainImg.innerHTML = "";
            mainImg.appendChild(imggg);
            document.getElementById("moreUpload").style.opacity = 0.5;
            document.querySelector(".cont").classList.add("hidden")
            popUpWindow.classList.remove("disable");
            elseImage();
            manegSatur(imggg);
            preImageInPopUp(imggg);
            nxtImageInPopUp(imggg);
            croPImg();
            closePopUpFun(imggg, mainImg);
        })
    })
    elseImage();
    manegSatur(imggg);
    preImageInPopUp(imggg);
    nxtImageInPopUp(imggg);
    croPImg();
    closePopUpFun(imggg, mainImg);

}

let FramesSrc = document.querySelectorAll(".framesCont li img")

let isUploadframe = false;
// frames Uploader  ____
let FrameFormData = new FormData()
let frameNum = 0;


// textttttttt
function Text() {
    let mainImg = document.querySelector(".popUp .mainImg .img");
    let imgSrc = document.querySelector(".popUp .mainImg .img img");
    mainImg.innerHTML = "";
    let canvas = document.createElement("canvas");

    canvas.width = imgSrc.width;
    canvas.height = imgSrc.height;
    canvas.style.maxWidth = "75%";
    canvas.style.maxHeight = "100%";
    canvas.id = "myCanvas";
    mainImg.appendChild(canvas);

    let xAcc = canvas.width / canvas.offsetWidth;

    let yAcc = canvas.height / canvas.offsetHeight;


    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.src = imgSrc.src;



    let textInput = document.getElementById('textInput');
    let fontColorInput = document.getElementById('fontColorInput');
    let fontSizeInput = document.getElementById('fontSizeInput');
    let fontTypeInput = document.getElementById('fontTypeInput');

    let addButton = document.getElementById('addButton');
    let doneButton = document.getElementById('doneButton');
    let cancleButton = document.getElementById('cancleButton');
    let isDragging = false;

    isEditing = true;
    let texts = [];
    let currentTextIndex = -1;

    img.onload = function () {
        drawCanvas();
    };

    addButton.addEventListener('click', function () {
        let newText = {
            text: textInput.value || "New Text",
            x: canvas.width / 2,
            y: canvas.height / 2,
            color: fontColorInput.value,
            size: parseInt(fontSizeInput.value),
            font: fontTypeInput.value,
            isEditing: true
        };
        texts.push(newText);
        currentTextIndex = texts.length - 1;
        drawCanvas();
    });

    canvas.addEventListener('mousedown', function (e) {
        if (!isEditing) return;

        let mousePos = getMousePos(canvas, e);
        for (let i = 0; i < texts.length; i++) {
            if (isMouseOverText(mousePos, texts[i])) {
                currentTextIndex = i;
                isDragging = true;
                break;
            }
        }
    });

    canvas.addEventListener('mousemove', function (e) {
        if (!isEditing) return;
        if (isDragging && currentTextIndex >= 0) {
            let mousePos = getMousePos(canvas, e);
            let textWidth = ctx.measureText(texts[currentTextIndex].text).width;
            texts[currentTextIndex].x = Math.max(textWidth / 2, Math.min(canvas.width - textWidth / 2, (mousePos.x * xAcc)));
            texts[currentTextIndex].y = Math.max(texts[currentTextIndex].size, Math.min(canvas.height, (mousePos.y * yAcc)));
            drawCanvas();
        }
    });

    canvas.addEventListener('mouseup', function (e) {
        if (!isEditing) return;
        isDragging = false;
    });

    canvas.addEventListener('dblclick', function (e) {
        if (!isEditing) return;
        let mousePos = getMousePos(canvas, e);
        for (let i = 0; i < texts.length; i++) {
            if (isMouseOverText(mousePos, texts[i])) {
                currentTextIndex = i;
                textInput.value = texts[i].text;
                fontColorInput.value = texts[i].color;
                fontSizeInput.value = texts[i].size;
                fontTypeInput.value = texts[i].font;
                textInput.focus();
                drawCanvas();
                break;
            }
        }
    });

    textInput.addEventListener('input', function () {
        if (currentTextIndex >= 0) {
            texts[currentTextIndex].text = textInput.value;
            drawCanvas();
        }
    });

    fontColorInput.addEventListener('input', function () {
        if (currentTextIndex >= 0) {
            texts[currentTextIndex].color = fontColorInput.value;
            drawCanvas();
        }
    });

    fontSizeInput.addEventListener('input', function () {
        if (currentTextIndex >= 0) {
            texts[currentTextIndex].size = parseInt(fontSizeInput.value);
            drawCanvas();
        }
    });

    fontTypeInput.addEventListener('input', function () {
        if (currentTextIndex >= 0) {
            texts[currentTextIndex].font = fontTypeInput.value;
            drawCanvas();
        }
    });


    doneButton.addEventListener('click', function () {
        document.querySelector(".TextSec").classList.remove("liActive");
        document.querySelector(".TextSec .icon img").src = document.querySelector(".TextSec .icon img").src.slice(0, document.querySelector(".TextSec .icon img").src.indexOf("com") + 3) + ".svg";
        document.querySelector(".GeneralSec").classList.add("liActive");
        document.querySelector(".GeneralSec .icon img").src = document.querySelector(".GeneralSec .icon img").src.slice(0, document.querySelector(".GeneralSec .icon img").src.indexOf("com") + 3) + "-fill.svg";
        document.querySelector(".ulNum-3").classList.add("noneDisplay");
        document.querySelector(".ulNum-0").classList.remove("noneDisplay");

        indexOfimg = imgSrcArr.indexOf(imgSrc.src);
        imgSrc.src = canvas.toDataURL();
        mainImg.innerHTML = "";
        mainImg.appendChild(imgSrc);
        document.querySelector(".cont .imageCont #" + imgSrc.id).src = imgSrc.src;
        imgSrcArr[indexOfimg] = imgSrc.src;
        elseImage();
        manegSatur(imgSrc);
        isEditing = false;

        drawCanvas();
        setTimeout(function () {
            convertImageToBase64(imgSrc, document.querySelector(".imageCont img#" + imgSrc.id).name);

        }, 100)

    });


    cancleButton.addEventListener('click', function () {
        document.querySelector(".TextSec").classList.remove("liActive");
        document.querySelector(".TextSec .icon img").src = document.querySelector(".TextSec .icon img").src.slice(0, document.querySelector(".TextSec .icon img").src.indexOf("com") + 3) + ".svg";
        document.querySelector(".GeneralSec").classList.add("liActive");
        document.querySelector(".GeneralSec .icon img").src = document.querySelector(".GeneralSec .icon img").src.slice(0, document.querySelector(".GeneralSec .icon img").src.indexOf("com") + 3) + "-fill.svg";
        document.querySelector(".ulNum-3").classList.add("noneDisplay");
        document.querySelector(".ulNum-0").classList.remove("noneDisplay");

        indexOfimg = imgSrcArr.indexOf(imgSrc.src);
        imgSrcArr[indexOfimg] = imgSrc.src;
        mainImg.innerHTML = "";
        mainImg.appendChild(imgSrc);
        document.querySelector(".cont .imageCont #" + imgSrc.id).src = imgSrc.src;
        elseImage();
        isEditing = false;

        manegSatur(imgSrc);
    });


    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        texts.forEach(function (textObj, index) {
            ctx.font = `${textObj.size}px ${textObj.font}`;
            ctx.fillStyle = textObj.color;
            ctx.textAlign = 'center';
            ctx.fillText(textObj.text, textObj.x, textObj.y);
            if (isEditing && index === currentTextIndex) {
                // drawTextBorder(textObj);
            }
        });
    }

    // function drawTextBorder(textObj) {
    //     ctx.strokeStyle = '#fff';
    //     ctx.lineWidth = 4;
    //     ctx.font = `${textObj.size}px ${textObj.font}`;
    //     let textWidth = ctx.measureText(textObj.text).width;
    //     let textHeight = textObj.size; // approximate text height
    //     ctx.strokeRect(textObj.x - textWidth / 2 - 5, textObj.y - textHeight, textWidth + 10, textHeight + 10);
    // }

    function getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();

        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function isMouseOverText(mousePos, textObj) {
        ctx.font = `${textObj.size}px ${textObj.font}`;
        let textWidth = ctx.measureText(textObj.text).width;
        let textHeight = textObj.size; // approximate text height
        return ((mousePos.x * xAcc) > textObj.x - textWidth / 2) && (mousePos.x * xAcc < textObj.x + textWidth / 2) &&
            ((mousePos.y * yAcc) > textObj.y - textHeight) && (mousePos.y * yAcc < textObj.y);
    }
}



function Sticker() {

    let mainImg = document.querySelector(".popUp .mainImg .img");
    let imgSrc = document.querySelector(".popUp .mainImg .img img");
    mainImg.innerHTML = "";
    let canvas = document.createElement("canvas");

    canvas.width = imgSrc.width;
    canvas.height = imgSrc.height;
    canvas.style.maxWidth = "75%";
    canvas.style.maxHeight = "100%";
    canvas.id = "myCanvas";
    mainImg.appendChild(canvas);

    let xAcc = canvas.width / canvas.offsetWidth;

    let yAcc = canvas.height / canvas.offsetHeight;

    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.src = imgSrc.src;


    let StickersSrc = document.querySelectorAll(".stickerCont li img")
    let widthOfSticker = document.getElementById('widthOfSticker');
    let heightOfSticker = document.getElementById('heightOfSticker');
    let stickerDoneButton = document.getElementById('stickerDoneButton');
    let stickerCancleButton = document.getElementById('stickerCancleButton');
    let stickers = [];
    let currentStickerIndex = -1;
    let isDragging = false;
    isEditing = true;



    img.onload = function () {
        drawCanvas();
    };


    StickersSrc.forEach((el, ind) => {
        el.addEventListener("click", () => {
            let newSticker = {
                Sticker: el.src,
                x: canvas.width / 2,
                y: canvas.height / 2,
                width: el.width,
                height: el.height,
                isEditing: true
            }
            stickers.push(newSticker);
            currentStickerIndex = stickers.length - 1;
            drawCanvas();
        })
    })

    canvas.addEventListener('mousedown', function (e) {
        if (!isEditing) return;
        let mousePos = getMousePos(canvas, e);
        for (let i = 0; i < stickers.length; i++) {
            if (isMouseOverSticker(mousePos, stickers[i])) {
                currentStickerIndex = i;
                isDragging = true;
                break;
            }
        }
    });

    canvas.addEventListener('mousemove', function (e) {
        if (!isEditing) return;
        if (isDragging && currentStickerIndex >= 0) {
            let mousePos = getMousePos(canvas, e);
            let stickerwidth = stickers[currentStickerIndex].width;
            stickers[currentStickerIndex].x = Math.max(stickerwidth / 2, Math.min(canvas.width - stickerwidth / 2, (mousePos.x * xAcc)));
            stickers[currentStickerIndex].y = Math.max(stickers[currentStickerIndex].height / 2, Math.min(canvas.height - stickers[currentStickerIndex].height / 2, (mousePos.y * yAcc)));
            drawCanvas();
        }
    });

    canvas.addEventListener('mouseup', function (e) {
        if (!isEditing) return;
        isDragging = false;
    });

    widthOfSticker.addEventListener('input', function () {
        if (currentStickerIndex >= 0) {
            stickers[currentStickerIndex].width = parseInt(widthOfSticker.value * canvas.width / 100);
            drawCanvas();
        }
    });

    heightOfSticker.addEventListener('input', function () {
        if (currentStickerIndex >= 0) {
            stickers[currentStickerIndex].height = parseInt(heightOfSticker.value * canvas.height / 100);
            drawCanvas();
        }
    });

    stickerDoneButton.addEventListener('click', function () {
        document.querySelector(".StickerSec").classList.remove("liActive");
        document.querySelector(".StickerSec .icon img").src = document.querySelector(".StickerSec .icon img").src.slice(0, document.querySelector(".TextSec .icon img").src.indexOf("com") + 3) + ".svg";
        document.querySelector(".GeneralSec").classList.add("liActive");
        document.querySelector(".GeneralSec .icon img").src = document.querySelector(".GeneralSec .icon img").src.slice(0, document.querySelector(".GeneralSec .icon img").src.indexOf("com") + 3) + "-fill.svg";
        document.querySelector(".ulNum-4").classList.add("noneDisplay");
        document.querySelector(".ulNum-0").classList.remove("noneDisplay");

        indexOfimg = imgSrcArr.indexOf(imgSrc.src);
        imgSrc.src = canvas.toDataURL();
        mainImg.innerHTML = "";
        mainImg.appendChild(imgSrc);
        document.querySelector(".cont .imageCont #" + imgSrc.id).src = imgSrc.src;
        imgSrcArr[indexOfimg] = imgSrc.src;
        elseImage();
        manegSatur(imgSrc);
        isEditing = false;
        drawCanvas();
        setTimeout(function () {
            convertImageToBase64(imgSrc, document.querySelector(".imageCont img#" + imgSrc.id).name);

        }, 100)

    });


    stickerCancleButton.addEventListener('click', function () {
        document.querySelector(".StickerSec").classList.remove("liActive");
        document.querySelector(".StickerSec .icon img").src = document.querySelector(".StickerSec .icon img").src.slice(0, document.querySelector(".TextSec .icon img").src.indexOf("com") + 3) + ".svg";
        document.querySelector(".GeneralSec").classList.add("liActive");
        document.querySelector(".GeneralSec .icon img").src = document.querySelector(".GeneralSec .icon img").src.slice(0, document.querySelector(".GeneralSec .icon img").src.indexOf("com") + 3) + "-fill.svg";
        document.querySelector(".ulNum-4").classList.add("noneDisplay");
        document.querySelector(".ulNum-0").classList.remove("noneDisplay");

        indexOfimg = imgSrcArr.indexOf(imgSrc.src);
        imgSrcArr[indexOfimg] = imgSrc.src;
        mainImg.innerHTML = "";
        mainImg.appendChild(imgSrc);
        document.querySelector(".cont .imageCont #" + imgSrc.id).src = imgSrc.src;
        elseImage();
        isEditing = false;
        manegSatur(imgSrc);
    });

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        stickers.forEach(function (stickerObj, index) {
            let newimg = new Image();
            newimg.src = stickerObj.Sticker;
            ctx.textAlign = 'center';
            ctx.drawImage(newimg, stickerObj.x - stickerObj.width / 2, stickerObj.y - stickerObj.height / 2, stickerObj.width, stickerObj.height);
        });
    }


    function getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function isMouseOverSticker(mousePos, stickerObj) {
        return ((mousePos.x * xAcc) > stickerObj.x - stickerObj.width / 2) && (mousePos.x * xAcc < (stickerObj.x) + stickerObj.width / 2) &&
            ((mousePos.y * yAcc) > stickerObj.y - stickerObj.height / 2) && (mousePos.y * yAcc < (stickerObj.y) + stickerObj.width / 2);
    }

}


function Frames() {

    let mainImg = document.querySelector(".popUp .mainImg .img");
    let imgSrc = document.querySelector(".popUp .mainImg .img img");
    mainImg.innerHTML = "";
    let canvas = document.createElement("canvas");

    canvas.width = imgSrc.width;
    canvas.height = imgSrc.height;
    canvas.style.maxWidth = "75%";
    canvas.style.maxHeight = "100%";
    canvas.id = "myCanvas";
    mainImg.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.src = imgSrc.src;

    let FramesSrc = document.querySelectorAll(".framesCont li img")
    console.log(FramesSrc.length)
    // let sizeOfSticker = document.getElementById('sizeOfSticker');
    let frameDoneButton = document.getElementById('frameDoneButton');
    let frameCancleButton = document.getElementById('frameCancleButton');
    let Frames = [];
    let currentFramesIndex = -1;
    let isDragging = false;
    isEditing = true;



    // 

    document.querySelector(".frameUpload").addEventListener("change", (event) => {
        let count = document.querySelectorAll(".framesCont .frame").length+1

        for (let i = frameNum; i < ((event.target.files.length) + frameNum); i++) {
            let frameCont = document.createElement('li');
            frameCont.id = "frameNum-" + i;
            document.querySelector(".framesCont").appendChild(frameCont);

            let frame = document.createElement('img');
            frame.src = URL.createObjectURL(event.target.files[i - frameNum]);
            console.log(frame.src)
            document.querySelector("#frameNum-" + i).appendChild(frame);

            let txt = document.createTextNode(`frame (${count + (i-frameNum)})`);
            let frameName = document.createElement('span');
            frameName.appendChild(txt)
            document.querySelector("#frameNum-" + i).appendChild(frameName);

            imageFormData.append('files', event.target.files[i - frameNum])
            imageFormData.append('name', event.target.files[i - frameNum].name)
        }
        frameNum += event.target.files.length;
        FramesSrc = document.querySelectorAll(".framesCont li img")

        FramesSrc.forEach((el, ind) => {
            el.addEventListener("click", () => {
                console.log(el)
                let newFrame = {
                    Frame: el.src,
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    width: el.width,
                    height: el.height,
                    isEditing: true
                }
                Frames.push(newFrame);
                currentFramesIndex = Frames.length - 1;
                drawCanvas();
            })
        })
        fetch(`${window.location.href}/FrameUploaded`, {
            method: 'POST',
            body: imageFormData,
        }).then(function (response) {
            imageFormData = new FormData();
        })


    })
    // 


    img.onload = function () {
        drawCanvas();
    };

    // while(isUploadframe == true){

    FramesSrc.forEach((el, ind) => {
        el.addEventListener("click", () => {
            console.log(el)
            let newFrame = {
                Frame: el.src,
                x: canvas.width / 2,
                y: canvas.height / 2,
                width: el.width,
                height: el.height,
                isEditing: true
            }
            Frames.push(newFrame);
            currentFramesIndex = Frames.length - 1;
            drawCanvas();
        })
    })
    // isUploadframe = false;
    // }

    frameDoneButton.addEventListener('click', function () {
        document.querySelector(".FrameSec").classList.remove("liActive");
        document.querySelector(".FrameSec .icon img").src = document.querySelector(".FrameSec .icon img").src.slice(0, document.querySelector(".FrameSec .icon img").src.indexOf("com") + 3) + ".svg";
        document.querySelector(".GeneralSec").classList.add("liActive");
        document.querySelector(".GeneralSec .icon img").src = document.querySelector(".GeneralSec .icon img").src.slice(0, document.querySelector(".GeneralSec .icon img").src.indexOf("com") + 3) + "-fill.svg";
        document.querySelector(".ulNum-2").classList.add("noneDisplay");
        document.querySelector(".ulNum-0").classList.remove("noneDisplay");

        indexOfimg = imgSrcArr.indexOf(imgSrc.src);
        imgSrc.src = canvas.toDataURL();
        mainImg.innerHTML = "";
        mainImg.appendChild(imgSrc);
        document.querySelector(".cont .imageCont #" + imgSrc.id).src = imgSrc.src;
        imgSrcArr[indexOfimg] = imgSrc.src;
        elseImage();
        manegSatur(imgSrc);
        isEditing = false;
        drawCanvas();
        console.log(document.querySelector(".imageCont img#" + imgSrc.id).name)
        setTimeout(function () {
            convertImageToBase64(imgSrc, document.querySelector(".imageCont img#" + imgSrc.id).name);

        }, 100)
    });


    frameCancleButton.addEventListener('click', function () {
        document.querySelector(".FrameSec").classList.remove("liActive");
        document.querySelector(".FrameSec .icon img").src = document.querySelector(".FrameSec .icon img").src.slice(0, document.querySelector(".FrameSec .icon img").src.indexOf("com") + 3) + ".svg";
        document.querySelector(".GeneralSec").classList.add("liActive");
        document.querySelector(".GeneralSec .icon img").src = document.querySelector(".GeneralSec .icon img").src.slice(0, document.querySelector(".GeneralSec .icon img").src.indexOf("com") + 3) + "-fill.svg";
        document.querySelector(".ulNum-2").classList.add("noneDisplay");
        document.querySelector(".ulNum-0").classList.remove("noneDisplay");

        indexOfimg = imgSrcArr.indexOf(imgSrc.src);
        imgSrcArr[indexOfimg] = imgSrc.src;
        mainImg.innerHTML = "";
        mainImg.appendChild(imgSrc);
        document.querySelector(".cont .imageCont #" + imgSrc.id).src = imgSrc.src;
        elseImage();
        isEditing = false;
        manegSatur(imgSrc);
    });

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        Frames.forEach(function (Framesobj, index) {
            let newimg = new Image();
            newimg.src = Framesobj.Frame;
            // ctx.textAlign = 'center';
            ctx.drawImage(newimg, 0, 0, canvas.width, canvas.height);
        });
    }



}


function convertImageToBase64(img, name) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    const base64String = canvas.toDataURL('image/jpeg'); // You can change the format if needed
    FileName = name;

    console.log(FileName)
    // function sendToBackend(base64String,FileName) {
    fetch('http://localhost:5000/base64', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64String, Name: FileName })
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    // }

}