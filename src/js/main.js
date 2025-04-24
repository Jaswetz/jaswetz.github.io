$(document).ready(function () {
  $(window).scroll(function () {
    if ($(document).scrollTop() > 100) {
      $(".header").addClass("scrolled");
    } else {
      $(".header").removeClass("scrolled");
    }
  });

  // Lightbox functionality
  setupLightbox();

  // Accordion close link functionality
  // Find all close links within accordion summaries
  const closeLinks = document.querySelectorAll(
    ".accordion-summary .accordion-close a"
  );

  closeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      // Find the parent <details> element
      const detailsElement = link.closest("details");
      if (detailsElement) {
        // Remove the 'open' attribute to close it
        detailsElement.removeAttribute("open");
      }
    });
  });
});

window.sr = ScrollReveal();
sr.reveal(".project", { duration: 500, delay: 500 }, 50);
sr.reveal(".about", { duration: 500, delay: 500 }, 50);
sr.reveal(".blurb", { duration: 500, delay: 500 }, 50);

/**
 * Sets up the lightbox functionality for images with class .proj__img
 */
function setupLightbox() {
  // Create lightbox container if it doesn't exist
  if ($("#lightbox").length === 0) {
    const lightboxHTML = `
      <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image lightbox">
        <div class="lightbox__content">
          <img class="lightbox__img" src="" alt="" />
          <div class="lightbox__caption"></div>
        </div>
        <button class="lightbox__close" aria-label="Close lightbox"></button>
        <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image"></button>
        <button class="lightbox__nav lightbox__nav--next" aria-label="Next image"></button>
      </div>
    `;
    $("body").append(lightboxHTML);
  }

  // Cache DOM elements
  const $lightbox = $("#lightbox");
  const $lightboxImg = $(".lightbox__img");
  const $lightboxCaption = $(".lightbox__caption");
  const $lightboxClose = $(".lightbox__close");
  const $lightboxPrev = $(".lightbox__nav--prev");
  const $lightboxNext = $(".lightbox__nav--next");

  // Collection of all lightbox images
  const $images = $(".proj__img");
  let currentIndex = 0;

  // Open lightbox when clicking on an image
  $images.on("click", function () {
    const $img = $(this);
    const src = $img.attr("src");
    const alt = $img.attr("alt");
    const caption = $img.closest("figure").find("figcaption").text() || alt;

    // Set image source and caption
    $lightboxImg.attr("src", src);
    $lightboxImg.attr("alt", alt);
    $lightboxCaption.text(caption);

    // Store current index for navigation
    currentIndex = $images.index(this);

    // Show/hide navigation based on number of images
    if ($images.length <= 1) {
      $lightboxPrev.hide();
      $lightboxNext.hide();
    } else {
      $lightboxPrev.show();
      $lightboxNext.show();
    }

    // Show lightbox
    $lightbox.addClass("active");

    // Prevent scrolling on body
    $("body").css("overflow", "hidden");

    // Set focus to lightbox for accessibility
    $lightbox.focus();
  });

  // Make images keyboard accessible
  $images.attr("tabindex", "0").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $(this).click();
    }
  });

  // Close lightbox when clicking close button or overlay
  $lightboxClose.on("click", closeLightbox);
  $lightbox.on("click", function (e) {
    if (e.target === this) {
      closeLightbox();
    }
  });

  // Navigate to previous image
  $lightboxPrev.on("click", function () {
    navigate(-1);
  });

  // Navigate to next image
  $lightboxNext.on("click", function () {
    navigate(1);
  });

  // Keyboard navigation
  $(document).on("keydown", function (e) {
    if (!$lightbox.hasClass("active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        navigate(-1);
        break;
      case "ArrowRight":
        navigate(1);
        break;
    }
  });

  // Touch swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  $lightbox.on("touchstart", function (e) {
    touchStartX = e.originalEvent.touches[0].clientX;
  });

  $lightbox.on("touchend", function (e) {
    touchEndX = e.originalEvent.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left, go to next
      navigate(1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right, go to previous
      navigate(-1);
    }
  }

  // Navigate to previous/next image
  function navigate(direction) {
    currentIndex += direction;

    // Loop around if at the end
    if (currentIndex < 0) {
      currentIndex = $images.length - 1;
    } else if (currentIndex >= $images.length) {
      currentIndex = 0;
    }

    const $newImg = $images.eq(currentIndex);
    const newSrc = $newImg.attr("src");
    const newAlt = $newImg.attr("alt");
    const newCaption =
      $newImg.closest("figure").find("figcaption").text() || newAlt;

    // Update image and caption
    $lightboxImg.attr("src", newSrc);
    $lightboxImg.attr("alt", newAlt);
    $lightboxCaption.text(newCaption);
  }

  // Close the lightbox
  function closeLightbox() {
    $lightbox.removeClass("active");

    // Re-enable scrolling
    $("body").css("overflow", "");

    // Return focus to the image that was clicked
    $images.eq(currentIndex).focus();
  }
}
