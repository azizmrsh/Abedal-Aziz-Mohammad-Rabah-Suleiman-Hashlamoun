'use strict';

// Dynamically load PDF libraries when needed
function loadPDFLibraries() {
  return new Promise((resolve, reject) => {
    let scriptsLoaded = 0;
    const totalScripts = 3;

    function onScriptLoad() {
      scriptsLoaded++;
      if (scriptsLoaded === totalScripts) {
        resolve();
      }
    }

    // Load html2pdf
    if (!window.html2pdf) {
      const html2pdfScript = document.createElement('script');
      html2pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      html2pdfScript.onload = onScriptLoad;
      html2pdfScript.onerror = reject;
      document.head.appendChild(html2pdfScript);
    } else {
      onScriptLoad();
    }

    // Load jsPDF
    if (!window.jsPDF) {
      const jsPDFScript = document.createElement('script');
      jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      jsPDFScript.onload = onScriptLoad;
      jsPDFScript.onerror = reject;
      document.head.appendChild(jsPDFScript);
    } else {
      onScriptLoad();
    }

    // Load html2canvas
    if (!window.html2canvas) {
      const html2canvasScript = document.createElement('script');
      html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      html2canvasScript.onload = onScriptLoad;
      html2canvasScript.onerror = reject;
      document.head.appendChild(html2canvasScript);
    } else {
      onScriptLoad();
    }
  });
}



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// CV Download Functions
async function downloadCV() {
  // Show loading indicator
  const btn = event.target.closest('.download-cv-btn');
  const originalText = btn.querySelector('span').textContent;
  const originalIcon = btn.querySelector('ion-icon').name;

  btn.querySelector('span').textContent = 'جاري التحميل...';
  btn.querySelector('ion-icon').name = 'hourglass-outline';
  btn.disabled = true;

  try {
    // Load PDF libraries dynamically
    await loadPDFLibraries();

    // Try alternative method first (more reliable)
    downloadCVAlternative(btn, originalText, originalIcon);
  } catch (error) {
    console.error('Error loading PDF libraries:', error);
    // Reset button state
    btn.querySelector('span').textContent = originalText;
    btn.querySelector('ion-icon').name = originalIcon;
    btn.disabled = false;

    // Fallback to opening CV in new window
    window.open('./AzizCV.html', '_blank');
  }
}

function downloadCVAlternative(btn, originalText, originalIcon) {
  // Open CV in hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.width = '800px';
  iframe.style.height = '1200px';
  iframe.style.border = 'none';
  iframe.src = './AzizCV.html';
  document.body.appendChild(iframe);

  iframe.onload = function () {
    setTimeout(() => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const cvContent = iframeDoc.querySelector('.container');

        if (!cvContent) {
          throw new Error('CV content not found');
        }

        // Remove print instructions
        const printInstructions = cvContent.querySelector('.print-instructions');
        if (printInstructions) {
          printInstructions.remove();
        }

        // Use html2canvas directly
        html2canvas(cvContent, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 800,
          height: cvContent.scrollHeight,
          logging: false,
          removeContainer: false
        }).then(canvas => {

          // Create PDF using jsPDF
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'mm', 'a4');

          // Calculate dimensions
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          // Add first page
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // Add additional pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          // Save the PDF
          pdf.save('Abedal_Aziz_Hashlamoun_CV.pdf');

          // Clean up
          document.body.removeChild(iframe);

          // Reset button
          btn.querySelector('span').textContent = originalText;
          btn.querySelector('ion-icon').name = originalIcon;
          btn.disabled = false;

        }).catch(error => {
          console.error('Canvas generation failed:', error);

          // Fallback to html2pdf
          downloadCVFallback(cvContent, btn, originalText, originalIcon, iframe);
        });

      } catch (error) {
        console.error('Error accessing iframe content:', error);

        // Clean up and fallback
        document.body.removeChild(iframe);
        fallbackToWindow(btn, originalText, originalIcon);
      }
    }, 1500); // Wait longer for content to render
  };

  iframe.onerror = function () {
    document.body.removeChild(iframe);
    fallbackToWindow(btn, originalText, originalIcon);
  };
}

function downloadCVFallback(cvContent, btn, originalText, originalIcon, iframe) {
  // Try html2pdf as fallback
  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'Abedal_Aziz_Hashlamoun_CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  html2pdf().set(opt).from(cvContent).save().then(() => {
    document.body.removeChild(iframe);
    btn.querySelector('span').textContent = originalText;
    btn.querySelector('ion-icon').name = originalIcon;
    btn.disabled = false;
  }).catch(() => {
    document.body.removeChild(iframe);
    fallbackToWindow(btn, originalText, originalIcon);
  });
}

function fallbackToWindow(btn, originalText, originalIcon) {
  // Final fallback - open CV page
  window.open('./AzizCV.html', '_blank');
  btn.querySelector('span').textContent = originalText;
  btn.querySelector('ion-icon').name = originalIcon;
  btn.disabled = false;
}