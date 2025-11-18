document.addEventListener("DOMContentLoaded", function () {
  var about = document.getElementsByClassName("navbarCls"); // Fixed class name reference
  for (var i = 0; i < about.length; i++) {
    about[i].style.cursor = "pointer"; // Corrected property access and added functionality
  }
});
