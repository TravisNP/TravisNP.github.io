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

//BUTTON 1
var modal1 = document.getElementById("modal1");

// Get the button that opens the modal
var btnModal1 = document.getElementById("btn1");

// Get the <span> element that closes the modal
var spanModal1 = document.getElementsByClassName("closeModal1")[0];

// When the user clicks on the button, open the modal
btnModal1.onclick = function() {
  modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanModal1.onclick = function() {
  modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}

//BUTTON 2
var modal2 = document.getElementById("modal2");

// Get the button that opens the modal
var btnModal2 = document.getElementById("btn2");

// Get the <span> element that closes the modal
var spanModal2 = document.getElementsByClassName("closeModal2")[0];

// When the user clicks on the button, open the modal
btnModal2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanModal2.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}

//BUTTON 4
var modal4 = document.getElementById("modal4");

// Get the button that opens the modal
var btnModal4 = document.getElementById("btn4");

// Get the <span> element that closes the modal
var spanModal4 = document.getElementsByClassName("closeModal4")[0];

// When the user clicks on the button, open the modal
btnModal4.onclick = function() {
  modal4.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanModal4.onclick = function() {
  modal4.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal4) {
    modal4.style.display = "none";
  }
}

//BUTTON 5
var modal5 = document.getElementById("modal5");

// Get the button that opens the modal
var btnModal5 = document.getElementById("btn5");

// Get the <span> element that closes the modal
var spanModal5 = document.getElementsByClassName("closeModal5")[0];

// When the user clicks on the button, open the modal
btnModal5.onclick = function() {
  modal5.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanModal5.onclick = function() {
  modal5.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal5) {
    modal5.style.display = "none";
  }
}

//BUTTON 6 -- links to outside website
var btn6 = document.getElementById("btn6");
btn6.onclick = function() {
  window.open("http://reu.dimacs.rutgers.edu/~tp638/index.html", "_blank") //TODO add your link
}