// File Input Setup
const dropArea = document.getElementById("dropArea");
const selectFileText = document.getElementById("selectFileText");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.style.display = "none";
dropArea.appendChild(fileInput);

// Event Listeners
selectFileText.addEventListener("click", () => {
  fileInput.click();
});

// Copy Text Functionality
const copyText = document.querySelector(".copy-text");
const copyButton = copyText.querySelector("button");
copyButton.addEventListener("click", () => {
  const input = copyText.querySelector("input.text");
  input.select();
  document.execCommand("copy");
  copyText.classList.add("active");
  window.getSelection().removeAllRanges();
  setTimeout(() => {
    copyText.classList.remove("active");
  }, 2500);
});

// Drag and Drop Setup
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

// File Input Event Listener
fileInput.addEventListener("change", handleFileSelect, false);

function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
}

// File Handling Functions
const fileInfo = document.getElementById("fileInfo");
const fileNameSpan = document.querySelector(".file-name");
const selectFileWarning = document.getElementById("selectFileWarning");

function handleFiles(files) {
  if (files.length === 0) return;

  const file = files[0];
  fileNameSpan.textContent = file.name;
  fileInfo.style.display = "flex";
  selectFileWarning.style.display = "none";
  dropArea.style.borderColor = "initial";
}

function removeFile() {
  fileInput.value = "";
  fileInfo.style.display = "none";
}

// Sending File
function sendFile() {
  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    console.error("No file selected.");
    selectFileWarning.style.display = "block";
    dropArea.style.borderColor = "red";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.style.display = "flex";

  fetch("https://file.io/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      fileInput.value = "";
      fileInfo.style.display = "none";
      loadingIndicator.style.display = "none";
      handleSuccess(data.link);
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleSuccess(fileLink) {
  const uploadContainer = document.getElementById("wrapper");
  const successContainer = document.getElementById("successMessage");

  uploadContainer.style.display = "none";
  successContainer.style.display = "flex";

  const fileLinkInput = document.getElementById("fileLink");
  fileLinkInput.value = fileLink;

  new QRCode(document.getElementById("qrcode"), {
    text: fileLink,
    width: 180,
    height: 180,
  });
}

// Copy Link
function copyLink() {
  const fileLinkInput = document.getElementById("fileLink");
  fileLinkInput.select();
  document.execCommand("copy");
}

// Start Over
function startOver() {
  document.getElementById("wrapper").style.display = "block";
  document.getElementById("successMessage").style.display = "none";
  document.getElementById("fileLink").value = "";
  // Clear the QR code element
  document.getElementById("qrcode").innerHTML = "";
}
