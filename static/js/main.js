let numofimg = 0;
let imgSrcArr = [];
let imageSelectIcons;
let isImgSelected = [];
let ImagesUploadedToBackend =[]
let imageFormData = new FormData()
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
        imgSrcArr.push(image.src);
        image.id = `imageNum-` + i;
        document.querySelector("#imageCont-" + i).appendChild(image);
        imageFormData.append('files', event.target.files[i - numofimg])
        imageFormData.append('name', event.target.files[i - numofimg].name)        
    }

    fetch(`${ window.location.href}/ImageUploaded`, {
        method: 'POST',
        body: imageFormData,
    }).then(function (response) {
        console.log(response)
        imageFormData =new FormData();
    })
    let upload = document.getElementById("upload").classList.add("disableUpload")
    let moreUpload = document.getElementById("moreUpload").classList.remove("disableUpload")
    numofimg += event.target.files.length;
    imageSelectIcons = document.querySelectorAll(".selectIcon");
    imageSelectIcons.forEach(getImgSelected);
};

//upload image by drag and drop
const dragging = (e) => {
    e.preventDefault();
};

const onDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    console.log(files)
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
        document.querySelector("#imageCont-" + i).appendChild(image);
        imageFormData.append('files', files[i - numofimg])
        imageFormData.append('name', files[i - numofimg].name)   
        //get a natural size for image and creat a span for each image to show the size of image
        image.onload = function () {
            getSize(image, i);
        }

    }
    fetch(`${ window.location.href}/ImageUploaded`, {
        method: 'POST',
        body: imageFormData,
    }).then(function (response) {
        console.log(response)
        imageFormData =new FormData();
    })
    let upload = document.getElementById("upload").classList.add("disableUpload")
    let moreUpload = document.getElementById("moreUpload").classList.remove("disableUpload")
    numofimg += files.length;
    imageSelectIcons = document.querySelectorAll(".selectIcon");
};



// get image size (width*height) and add span element under the image in the page
function getSize(image, i) {
    let imgWidth = image.naturalWidth;
    let imgHight = image.naturalHeight;
    let size = document.createElement('span');
    let txt = document.createTextNode(imgWidth + "x" + imgHight + " px");
    size.id = "sizeOfImgNum-" + i;
    size.appendChild(txt)
    document.querySelector("#imageCont-" + i).appendChild(size);
}


function addSelectImg(i) {
    let selectIcon = document.createElement('span');
    selectIcon.classList.add("selectIcon")
    selectIcon.id = "selectIcon" + i;
    document.querySelector("#imageCont-" + i).appendChild(selectIcon);
}


function getImgSelected(item) {
    item.addEventListener('click', function () {
        if (!(item.classList.contains("bgFill"))) {
            item.classList.add("bgFill")
            isImgSelected.push(document.getElementById("imageNum-" + item.id.slice(10, item.id.length)).src)
            console.log(isImgSelected)

        }
        else {
            item.classList.remove("bgFill")
            isImgSelected = isImgSelected.filter(e => e !== (document.getElementById("imageNum-" + item.id.slice(10, item.id.length)).src))
            // console.log(isImgSelected)
        }

    })

}

let ResizeHeader = document.querySelector('.ResizeHeader')
ResizeHeader.addEventListener("click", function () {
    let resizeCont = document.querySelector('.resizeCont')
    resizeCont.classList.remove("dsiable")
})

let ResizeCancle = document.querySelector('.ResizeCancle')
ResizeCancle.addEventListener('click', function () {
    let resizeCont = document.querySelector('.resizeCont')
    resizeCont.classList.add("dsiable")
})



