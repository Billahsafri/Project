document.addEventListener('DOMContentLoaded', function() {
    var titleLink = document.getElementById("title-link");
    if (titleLink) {
      titleLink.addEventListener("click", function() {
        window.location.href = "other1.html";
      });
    }
  });
  