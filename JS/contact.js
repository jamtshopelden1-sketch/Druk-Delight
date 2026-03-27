// Detect cat hover
function detect_cat(cat_id, x) {
  var catplace = $(cat_id).offset().left + $(cat_id).width() / 2;

  if (Math.abs(x - catplace) < 80) {
    $(cat_id).css("bottom", "0px");
  } else {
    $(cat_id).css("bottom", "-50px");
  }
}

// Mouse movement
$(window).mousemove(function (evt) {
  var pagex = evt.pageX;

  // Cat animation
  detect_cat("#cat_yellow", pagex);
  detect_cat("#cat_blue", pagex);
  detect_cat("#cat_grey", pagex);

  // 🔥 Mountain parallax
  $(".mountain").css(
    "transform",
    "translateX(" + (pagex / -20 + 50) + "px)"
  );
});

function submit() {
    alert("Information Submitted");
}