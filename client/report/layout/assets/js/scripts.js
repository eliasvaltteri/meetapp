var x = 0;
var i = 0;
var txt = document.getElementById("tw").innerHTML;
var speed = 50;

function typeWriter() {
  if (x == 0) {
	document.getElementById('tw').innerHTML = '';
    x = 1;
  }
  if (i < txt.length) {
    document.getElementById("tw").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
typeWriter();