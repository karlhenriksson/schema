// Config values
const schedule = {
  mon: [
    {
      name: "Svenska 2",
      teacher: "LE",
      room: "32",
      start: [8, 30],
      end: [9, 45],
    },
    {
      name: "Fysik 1a",
      teacher: "MSG",
      room: "1306",
      start: [9, 55],
      end: [10, 55],
    },
    {
      name: "Kemi 2",
      teacher: "TFD",
      room: "1502",
      start: [11, 5],
      end: [11, 55],
    },
    { name: "Lunch", room: "Vasaköket", start: [12, 0], end: [12, 40] },
    {
      name: "Matematik 5",
      teacher: "NZG",
      room: "403",
      start: [12, 45],
      end: [13, 55],
    },
    {
      name: "Engelska 6",
      teacher: "MEN",
      room: "403",
      start: [14, 5],
      end: [15, 5],
    },
    {
      name: "Tyska 4",
      teacher: "LLT",
      room: "34",
      start: [15, 15],
      end: [16, 30],
    },
  ],
  tue: [
    {
      name: "Programmering 1",
      teacher: "PLN",
      room: "1302",
      start: [8, 30],
      end: [9, 50],
    },
    {
      name: "Matematik 5",
      teacher: "NZG",
      room: "403",
      start: [10, 0],
      end: [11, 0],
    },
    {
      name: "Idrott och hälsa 1",
      teacher: "AAN",
      room: "Idh",
      start: [11, 30],
      end: [12, 50],
    },
    { name: "Lunch", room: "Vasaköket", start: [12, 50], end: [13, 30] },
    {
      name: "Mentorstid",
      teacher: "LE,TFD",
      room: "37",
      start: [14, 0],
      end: [14, 20],
    },
  ],
  wed: [
    {
      name: "Matematik 5",
      teacher: "NZG",
      room: "102",
      start: [8, 30],
      end: [9, 30],
    },
    {
      name: "Matematik 5",
      teacher: "NZG",
      room: "102",
      start: [9, 40],
      end: [10, 40],
    },
    {
      name: "Fysik 1a",
      teacher: "MSG",
      room: "1306",
      start: [10, 50],
      end: [12, 0],
    },
    { name: "Lunch", room: "Vasaköket", start: [12, 10], end: [12, 50] },
    {
      name: "Kemi 2",
      room: "1502",
      teacher: "TFD",
      start: [13, 0],
      end: [13, 55],
    },
    { name: "Resurstid med stöd", start: [14, 10], end: [14, 50] },
  ],
  thu: [
    {
      name: "Matematik 5",
      room: "403",
      teacher: "NZG",
      start: [10, 10],
      end: [11, 10],
    },
    { name: "Lunch", room: "Vasaköket", start: [11, 35], end: [12, 15] },
    {
      name: "Idrott och hälsa 1",
      teacher: "AAN",
      room: "Idh",
      start: [13, 20],
      end: [14, 30],
    },
    {
      name: "Svenska 2",
      teacher: "LE",
      room: "35",
      start: [14, 55],
      end: [16, 25],
    },
  ],
  fri: [
    { name: "Tyska 4", teacher: "LLT", room: 34, start: [8, 30], end: [10, 0] },
    {
      name: "Svenska 2",
      teacher: "LE",
      room: "36",
      start: [10, 10],
      end: [11, 0],
    },
    {
      name: "Matematik 5",
      teacher: "NZG",
      room: "403",
      start: [11, 10],
      end: [12, 10],
    },
    { name: "Lunch", room: "Vasaköket", start: [12, 15], end: [12, 55] },
    {
      name: "Engelska 6",
      teacher: "MEN",
      room: "39",
      start: [13, 0],
      end: [14, 50],
    },
    {
      name: "Programmering 1",
      teacher: "PLN",
      room: "1307",
      start: [15, 0],
      end: [16, 30],
    },
  ],
};
const colors = {
  "Svenska 2": { bg: "#FFFFAA" },
  "Svenska 2": { bg: "#FFFFCD" },
  "Fysik 1a": { bg: "#016531", text: "#E6F9F3" },
  "Kemi 2": { bg: "#CF3501", text: "#FFE537" },
  Lunch: { bg: "#BEBEBE" },
  "Matematik 5": { bg: "#7331DE" },
  "Engelska 6": { bg: "red" },
  "Idrott och hälsa 1": { bg: "#EEFF43" },
  "Matematik 5": { bg: "#8381FF" },
  "Engelska 6": { bg: "#FF0000" },
  "Idrott och hälsa 1": { bg: "#FFFF83" },
};

function timeToHour(arr) {
  return arr[0] + arr[1] / 60;
}

// Set sonme constants:

const weekHolder = document.getElementById("weekHolder");
const textMeasureCanvas = document.createElement("canvas");
const ctx = textMeasureCanvas.getContext("2d");
ctx.font = "6px Segoe UI";

// What time is the earliest/latest time to show?
let dayStart = Infinity,
  dayEnd = -Infinity;
for (const [, lessons] of Object.entries(schedule)) {
  for (const lesson of lessons) {
    dayStart = Math.min(dayStart, timeToHour(lesson.start));
    dayEnd = Math.max(dayEnd, timeToHour(lesson.end));
  }
}
dayStart = Math.floor(dayStart - 1 / 6);
dayEnd = Math.ceil(dayEnd + 7 / 6);

// Height of an hour in pixels
const hourHeight = weekHolder.clientHeight / (dayEnd - dayStart);

// Width of lesson elements in px
const lessonWidth = weekHolder.offsetWidth;
console.log(lessonWidth);

// Add time indicators to the side timelines:
// For all days...
for (const el of document.getElementsByClassName("timeline")) {
  // Add markers every 30 minutes
  for (let h = dayStart; h < dayEnd - 1; h += 0.5) {
    const div = document.createElement("div");
    div.classList = "timelineEntry";
    div.innerText = Math.floor(h) + ":" + (h % 1 ? "30" : "00");
    el.appendChild(div);
  }
}

for (const [day, lessons] of Object.entries(schedule)) {
  const dayDiv = document.getElementById(day);
  console.log(`Found ${lessons.length} lessons for day ${day}`);

  // For each lesson:
  for (const lesson of lessons) {
    // Calculate stuff for the element:

    // Start time (in h)
    const startTime = timeToHour(lesson.start),
      endTime = timeToHour(lesson.end),
      duration = endTime - startTime;
    // End time (in h)
    const leftOffset = lesson.channel
      ? ((lesson.channel[1] - 1) * 100) / lesson.channel[0]
      : 0;
    // Height of lesson element
    const lessonHeight = duration * hourHeight;

    // Should the program add a line break?
    const addLineBreak = lessonHeight > 30;

    console.log();
    // Dynamic font size
    const fontSize = Math.min(
      // Width-based
      (lessonWidth - 7) /
        (addLineBreak
          ? Math.max(
              ctx.measureText(lesson.name).width,
              ctx.measureText(
                (lesson.teacher ?? "") + " " + (lesson.room ?? "")
              ).width
            )
          : ctx.measureText(
              `${lesson.name} ${lesson.teacher ?? ""} ${lesson.room ?? ""}`
            ).width),
      // Height-based
      (lessonHeight - 6) / (addLineBreak ? 3 : 2),
      // Maximum size
      window.innerWidth < 800 ? 12 : 20
    );

    // Create an element for the lesson:

    const div = document.createElement("div");
    // Add the style elements
    div.classList = "lesson";
    div.style = `
      top: ${(startTime - dayStart) * hourHeight}px;
      ${
        // If there's a channel specified, move and scale the lesson. Otherwise, go full width
        lesson.channel
          ? `width: ${100 / lesson.channel[0]}%; left: ${leftOffset}%;`
          : "width: 100%;"
      }
      height: ${duration * hourHeight}px;
      background-color: ${
        (colors[lesson.name] && colors[lesson.name].bg) ?? "white"
      };
      font-size: ${fontSize}px;
      color: ${(colors[lesson.name] && colors[lesson.name].text) ?? "black"};
      ${
        // Is the lesson in a channel, and if so, what borders should be drawn?
        lesson.channel
          ? lesson.channel[1] !== 1
            ? "border-left: 1px black solid;"
            : "" + lesson.channel[1] !== lesson.channel[0]
            ? "border-right: 1px black solid;"
            : ""
          : ""
      }
    `;
    div.innerHTML = `
    ${lesson.name}
    ${addLineBreak ? "<br />" : " "}
    ${lesson.teacher ?? lesson.room ?? ""}`;

    // Add room number
    const room = document.createElement("div");
    room.classList = "roomIndicator";
    room.innerHTML =
      lesson.room && lesson.teacher
        ? (addLineBreak && lesson.teacher ? "<br />" : "") + lesson.room
        : "";

    // Add time indicators:
    // Start time
    const start = document.createElement("div");
    start.classList = "timeIndicator";
    start.style = "top: 0px; left: 2%";
    start.innerText = `${lesson.start[0]}:${
      (lesson.start[1] < 10 ? "0" : "") + lesson.start[1]
    }`;
    // End time
    const end = document.createElement("div");
    end.classList = "timeIndicator";
    end.style = "bottom: 0px; right: 2%; transform: translate(0px, +50%)";
    end.innerText = `${lesson.end[0]}:${
      (lesson.end[1] < 10 ? "0" : "") + lesson.end[1]
    }`;

    div.appendChild(start);
    div.appendChild(end);
    div.appendChild(room);
    dayDiv.appendChild(div);
  }
}
