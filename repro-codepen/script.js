import "https://esm.sh/cally";

const calendar = document.getElementById("calendar");
const log = document.getElementById("log");
const tick = () => new Promise((resolve) => setTimeout(resolve, 50));
const clickNext = () =>
  calendar.shadowRoot.querySelector('[part~="next"]').click();

let focusDays = 0;
calendar.addEventListener("focusday", () => {
  focusDays += 1;
});

const report = async (label) => {
  const before = focusDays;
  await tick();
  log.textContent = `${label}: ${focusDays - before} focusday event(s), focusedDate=${calendar.focusedDate}`;
};

// 1. A page change and a focusedDate change land in the same render.
document.getElementById("next-and-focus").onclick = () => {
  clickNext();
  calendar.focusedDate = "2027-03-10";
};

// 2. Moving the element (disconnect + reconnect) re-runs the effects,
// so setting focusedDate in the same task also loops. This is what a
// modal library that re-parents its content on open does.
document.getElementById("move-and-focus").onclick = async () => {
  clickNext();
  await tick();
  document.getElementById("elsewhere").append(calendar);
  // await tick(); <= this would prevent the loop since mount effects
  // and focusedDate effect happen separately
  calendar.focusedDate = "2026-10-15";
};

document.getElementById("next-only").onclick = () => {
  clickNext();
  report('"next" only');
};

document.getElementById("focus-only").onclick = () => {
  calendar.focusedDate = "2027-03-10";
  report("focusedDate only");
};
