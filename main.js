"use strict";

// Set some constants:

const weekHolder = document.getElementById("weekHolder");
console.log(weekHolder.clientHeight);
const textMeasureCanvas = document.createElement("canvas");
const ctx = textMeasureCanvas.getContext("2d");
const dayTemplate = document.getElementById("dayTemplate");
ctx.font = "6px Segoe UI";

// Convert HH/MM times to HH only
// IN: [(int) h, (int) min]   OUT: (float) h
function timeToHour(arr) {
  return arr[0] + arr[1] / 60;
}

function loadSchedule(schedule, colors) {
  console.log("Loading schedule");
  // Clear the old schedule + timelines
  document.getElementById("weekHolder").innerHTML = "";
  for (const el of document.getElementsByClassName("timeline")) {
    el.innerHTML = "";
  }

  // Add new days
  for (const [day] of Object.entries(schedule)) {
    // (https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode)
    const dayEl = dayTemplate.cloneNode(true);
    dayEl.removeAttribute("id");
    dayEl.style.display = "block";
    dayEl.getElementsByClassName("dayName")[0].innerText = day;
    dayEl.getElementsByClassName("day")[0].id = day;
    weekHolder.appendChild(dayEl);
  }

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
  dayEnd = Math.ceil(dayEnd + 1.5 / 6);

  // Height of an hour in pixels
  const hourHeight = (weekHolder.clientHeight - 30) / (dayEnd - dayStart);

  // Width of lesson elements in px
  const lessonWidth = weekHolder.offsetWidth;

  // Add time indicators to the side timelines:
  // For all days...
  for (const el of document.getElementsByClassName("timeline")) {
    // Add markers every 30 minutes
    const incr = hourHeight < 50 ? 1 : 0.5,
      fontSize = (5 * el.clientWidth - 5) / ctx.measureText("00:00").width;
    for (let h = dayStart; h < dayEnd; h += incr) {
      const div = document.createElement("div");
      div.classList = "timelineEntry";
      div.style = `
    top: ${hourHeight * (h - dayStart)}px;
    font-size: ${fontSize}px;
    `;
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
        (lessonWidth / (lesson.channel ?? [1])[0] - 7) /
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
        window.innerWidth < 800 ? 12 : 18
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
}

// Check for URL parameter deciding what schedule to open
// (https://www.sitepoint.com/get-url-parameters-with-javascript/)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// Defaulting to my own schedule if the schedule name is invalid
const scheduleName = urlParams.get("show") ?? "karl";
console.log("Opening schedule for " + scheduleName);
initiateSchedule(scheduleName);

// Open the schedule
async function initiateSchedule() {
  const response = await fetch("Schedules/" + scheduleName + ".json");

  // Check for loading errors
  if (!response.ok) {
    switch (response.status) {
      case 404:
        console.error(`Couldn't find schedule "${scheduleName}".`);
        confirm(
          'The schedule "' +
            scheduleName +
            "\" couldn't be found. Make sure you have written the URL correctly.\n\nCheck the console for more information."
        );
        return;
      default:
        console.log(
          `Unhandled error "${response.status}/${response.statusText}".`
        );
        confirm(
          "An unhandled HTTPS error occured. Please check the console for more information."
        );
    }
  }

  // If all is well, JSON:ify the file
  let json;
  try {
    json = await response.json();
  } catch (error) {
    console.error("Error while parsing schedule: \n" + error);
    confirm(
      "An error occured while parsing the requested schedule.\n\nCheck the console for more information."
    );
    return;
  }

  loadSchedule(json.schedule, json.colors);
}
