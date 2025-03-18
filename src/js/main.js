$(document).ready(function () {
  $(window).scroll(function () {
      if ($(document).scrollTop() > 100) {
          $(".header").addClass("scrolled");
      } else {
          $(".header").removeClass("scrolled");
      }
  });
});

window.sr = ScrollReveal();
sr.reveal('.project', { duration: 500, delay: 500 }, 50);
sr.reveal('.about', { duration: 500, delay: 500 }, 50);
sr.reveal('.blurb', { duration: 500, delay: 500 }, 50);
