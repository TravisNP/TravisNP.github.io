var app = document.getElementById('app');

var typewriter = new Typewriter(app, {
  loop: true,
  delay: 75,
});

typewriter
  .pauseFor(1000)
  .typeString('I am a CS PhD student at UW-Madison') //Add your own tagline
  .pauseFor(3000)
  .start()


var granimInstance = new Granim({
    element: '#canvas-image-blending',
    direction: 'top-bottom',
    isPausedWhenNotInView: true,
    image : {
        source: 'assets/arch2000.jpg', //change image for intro section if desired
        blendingMode: 'multiply',
    },
    states : {
        "default-state": {
            gradients: [
                ['#29323c', '#485563'],
                ['#FF6B6B', '#556270'],
                ['#80d3fe', '#7ea0c4'],
                ['#f0ab51', '#eceba3']
            ],
            transitionSpeed: 8000
        }
    }
});

// --- Modal Logic ---
// A reusable function to handle modal functionality
function setupModal(buttonId, modalId, closeClass) {
  var modal = document.getElementById(modalId);
  var btn = document.getElementById(buttonId);
  var span = document.getElementsByClassName(closeClass)[0];

  if (btn && modal && span) {
    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
  }
}

// Setup modals for each button
setupModal("btn1", "modal1", "closeModal1");
setupModal("btn2", "modal2", "closeModal2");
setupModal("btn4", "modal4", "closeModal4");
setupModal("btn5", "modal5", "closeModal5");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = "none";
  }
}

// --- Tab Logic for Contact Image ---
const contactImage = document.getElementById('contact-image');
const aboutTab = document.getElementById('about-tab');

function toggleContactImage() {
  if (aboutTab.classList.contains('active')) {
    contactImage.style.display = 'none';
  } else {
    contactImage.style.display = 'block';
  }
}

// Add event listeners to all tabs to check which one is active
document.querySelectorAll('#myTab .nav-link').forEach(function(tab) {
  tab.addEventListener('shown.bs.tab', toggleContactImage);
});

// Initial check in case the 'About Me' tab is active on page load
toggleContactImage();

//BUTTON 6 -- links to outside website
var btn6 = document.getElementById("btn6");
btn6.onclick = function() {
  window.open("http://reu.dimacs.rutgers.edu/~tp638/index.html", "_blank") //TODO add your link
}