// VIDEO BLOG PAGE
const cards = document.querySelectorAll(".videoCard");
const player = document.getElementById("videoPlayer");
const mainVideo = document.getElementById("mainVideo");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");

cards.forEach(card => {
  const video = card.querySelector("video");
  const link = card.querySelector("a");
  const playBtn = card.querySelector(".playBtn");

  video.addEventListener("click", () => playVideo(video.src));
  playBtn.addEventListener("click", () => playVideo(video.src));

  link.addEventListener("click", (e) => {
    e.preventDefault();
    playVideo(video.src);
  });
});

function playVideo(src) {
  if (!src) return;

  mainVideo.pause();
  mainVideo.currentTime = 0;

  mainVideo.src = src;
  player.classList.add("active");
  overlay.classList.add("active");

  mainVideo.play();
}

function closeVideo() {
  player.classList.remove("active");
  overlay.classList.remove("active");

  mainVideo.pause();
  mainVideo.currentTime = 0;
}

closeBtn.addEventListener("click", closeVideo);
overlay.addEventListener("click", closeVideo);

/* NEW: HOVER AUTO PLAY */
const hoverVideos = document.querySelectorAll(".videoCards video");

hoverVideos.forEach(video => {

  video.addEventListener("mouseenter", () => {
    video.muted = true;
    video.play();
  });

  video.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

});