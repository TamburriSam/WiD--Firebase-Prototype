export const startCountdown = (seconds) => {
  let counter = seconds;

  const interval = setInterval(() => {
    counter--;

    document.querySelector(
      "#waiting"
    ).innerHTML = `Game Starting in ${counter} seconds`;

    if (counter < 1) {
      clearInterval(interval);
      console.log("Ding!");
      window.location = "game1.html";
    }
  }, 1000);
};
