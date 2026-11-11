import "../src/index.ts";

const calendar = document.getElementById("calendar");
const log = document.getElementById("log");
const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

// Toggle between containers so each move is a real disconnect + reconnect.
const move = () => {
  const home = document.getElementById("home");
  const elsewhere = document.getElementById("elsewhere");
  (calendar.parentElement === home ? elsewhere : home).append(calendar);
};

let focusDays = 0;
calendar.addEventListener("focusday", () => {
  focusDays += 1;
});

const report = async (label) => {
  const before = focusDays;
  await tick();
  log.textContent = `${label}: ${focusDays - before} focusday event(s), focusedDate=${calendar.focusedDate}`;
};

// Moving the element (disconnect + reconnect) re-runs the effects, so
// setting focusedDate to another month in the same task loops. This is
// what a modal library that re-parents its content on open does.
document.getElementById("move-and-focus").onclick = () => {
  move();
  // await tick(); <= this would prevent the loop since mount effects
  // and focusedDate effect happen separately
  calendar.focusedDate = "2027-03-10";
};

document.getElementById("move-only").onclick = () => {
  move();
  report("move only");
};

// Uses a different month than the freezing button so it still loops after this.
document.getElementById("focus-only").onclick = () => {
  calendar.focusedDate = "2026-12-10";
  report("focusedDate only");
};
