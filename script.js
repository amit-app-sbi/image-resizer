const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const previewImg = document.getElementById("previewImg");
const controlsForm = document.getElementById("controlsForm");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const aspectRatioCheck = document.getElementById("aspectRatioCheck");
const downloadBtn = document.getElementById("downloadBtn");

let originalImageRatio;

// Open file selector when clicking upload zone
dropArea.addEventListener("click", (e) => {
    if (e.target !== previewImg) fileInput.click();
});
browseBtn.addEventListener("click", () => fileInput.click());

// File drag and drop mechanics
dropArea.addEventListener("dragover", (e) => e.preventDefault());
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    if(e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        loadImage();
    }
});

fileInput.addEventListener("change", loadImage);

function loadImage() {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.hidden = false;
        
        previewImg.onload = () => {
            // Document baseline parameters
            widthInput.value = previewImg.naturalWidth;
            heightInput.value = previewImg.naturalHeight;
            originalImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
            
            // Activate structural panel controls
            controlsForm.classList.remove("disabled");
        };
    };
    reader.readAsDataURL(file);
}

// Adjust measurements proportionally based on lock configuration
widthInput.addEventListener("input", () => {
    if (aspectRatioCheck.checked && originalImageRatio) {
        heightInput.value = Math.round(widthInput.value / originalImageRatio);
    }
});

heightInput.addEventListener("input", () => {
    if (aspectRatioCheck.checked && originalImageRatio) {
        widthInput.value = Math.round(heightInput.value * originalImageRatio);
    }
});

// Render modifications to canvas asset and download
downloadBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const targetWidth = parseInt(widthInput.value) || previewImg.naturalWidth;
    const targetHeight = parseInt(heightInput.value) || previewImg.naturalHeight;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw preview contents onto canvas elements
    ctx.drawImage(previewImg, 0, 0, targetWidth, targetHeight);

    // Form absolute target file pipeline download trigger
    const link = document.createElement("a");
    link.download = `resized-${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.9); // 90% target configuration quality
    link.click();
});
