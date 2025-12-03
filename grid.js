// Days → columns
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Canvas
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

// Grid size
const rows = 24;  // hours
const cols = 7;   // Days
const cellWidth = canvas.width / (cols + 1);
const cellHeight = canvas.height / (rows + 1);

// Toggle state
let showBestTimes = false;
let savedLocalGrid = null;

// Toggle button
document.getElementById("toggle1").addEventListener("click", () => {
    showBestTimes = !showBestTimes;
    redraw();

    const button = document.getElementById("toggle1");

    if (showBestTimes){
        button.innerText = "Show Normal View";
        button.classList.add('active');
    }
    else{
        button.innerText = "Show Best Times";
        button.classList.remove('active');
    }
    //document.getElementById("toggle1").innerText =
    //    showBestTimes ? "Show Normal View" : "Show Best Times";
});

// Browser Local Time Offset (in hours)
const localOffset = -(new Date().getTimezoneOffset() / 60);


// Load data.json
fetch("./data.json")
    .then(res => res.json())
    .then(data => {
        const people = data.people;

        // Grid stored in UTC first
        const utcGrid = Array.from({ length: 24 }, () =>
            Array.from({ length: 7 }, () => [])
        );

        // Convert all users' availability to UTC grid
        people.forEach(person => {
            person.availability.forEach(slot => {
                const localDay = slot.day;
                const tz = person.timezone;

                slot.time.forEach(localHour => {
                    const { utcDay, utcHour } = convertToUTC(localDay, localHour, tz);
                    utcGrid[utcHour][utcDay].push(person.name);
                });
            });
        });

        // Convert UTC grid → LOCAL grid for display
        const localGrid = convertUTCGridToLocal(utcGrid);

        savedLocalGrid = localGrid;
        redraw();
    })
    .catch(err => console.error("Error loading data.json:", err));


// UTC to Local
function convertUTCGridToLocal(utcGrid) {
    const grid = Array.from({ length: 24 }, () =>
        Array.from({ length: 7 }, () => [])
    );

    for (let utcHour = 0; utcHour < 24; utcHour++) {
        for (let day = 0; day < 7; day++) {

            let localHour = utcHour + localOffset;
            let localDay = day;

            if (localHour < 0) {
                localHour += 24;
                localDay = (day - 1 + 7) % 7;
            }
            if (localHour >= 24) {
                localHour -= 24;
                localDay = (day + 1) % 7;
            }

            grid[localHour][localDay] =
                grid[localHour][localDay].concat(utcGrid[utcHour][day]);
        }
    }

    return grid;
}


// Local to UTC
function convertToUTC(localDayName, localHour, timezone) {
    if (!timezone || timezone === ".....") {
        return { utcDay: 0, utcHour: 0 };
    }

    const dayIndex = days.indexOf(localDayName.slice(0, 3));

    const localDate = new Date(`2025-01-05T${String(localHour).padStart(2, "0")}:00:00`);
    const localString = localDate.toLocaleString("en-US", { timeZone: timezone });
    const trueDate = new Date(localString);

    let utcHour = trueDate.getUTCHours();

    let utcDay = (dayIndex + (trueDate.getUTCDate() - localDate.getUTCDate())) % 7;
    if (utcDay < 0) utcDay += 7;

    return { utcDay, utcHour };
}


// Draw full grid with all data points
function drawGrid(grid) {

    let maxPeople = 0;
    for (let h = 0; h < rows; h++) {
        for (let d = 0; d < cols; d++) {
            maxPeople = Math.max(maxPeople, grid[h][d].length);
        }
    }

    drawLabels(); // draw day/hour labels

    // Draw heatmap cells
    for (let hour = 0; hour < rows; hour++) {
        for (let day = 0; day < cols; day++) {

            const count = grid[hour][day].length;
            const x = (day + 1) * cellWidth;
            const y = (hour + 1) * cellHeight;

            if (count > 0) {
                const fraction = count / maxPeople;

                // White → Blue gradient
                const blue = Math.floor(255 * fraction);
                const r = 255 - blue;
                const g = 255 - blue;

                ctx.fillStyle = `rgb(${r}, ${g}, 255)`;
            } else {
                ctx.fillStyle = "white";
            }

            ctx.fillRect(x, y, cellWidth, cellHeight);
            ctx.strokeStyle = "#333";
            ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
    }
}


// Make best time grid
function makeBestTimeGrid(grid) {
    const slots = [];

    // Collect all time slots
    for (let h = 0; h < rows; h++) {
        for (let d = 0; d < cols; d++) {
            slots.push({
                hour: h,
                day: d,
                count: grid[h][d].length
            });
        }
    }

    // Sort by availability (highest → lowest)
    slots.sort((a, b) => b.count - a.count);

    // Top 5 time slots
    const topFive = slots.slice(0, 5);

    // Mark top 5 in boolean grid
    const bestGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
    );

    topFive.forEach(slot => {
        bestGrid[slot.hour][slot.day] = true;
    });

    return {
        bestGrid,
        topFive,
        maxCount: topFive[0].count  // highest availability
    };
}

// Draw best times grid
function drawBestTimesGrid(bestGrid, maxCount) {
    drawLabels();

    // Draw cells
    for (let hour = 0; hour < rows; hour++) {
        for (let day = 0; day < cols; day++) {

            const x = (day + 1) * cellWidth;
            const y = (hour + 1) * cellHeight;

            if (bestGrid[hour][day]) {
                ctx.fillStyle = "rgb(0, 128, 255)"; // highlight top 5
            } else {
                ctx.fillStyle = "#e6e6e6";         // dimmed background
            }

            ctx.fillRect(x, y, cellWidth, cellHeight);
            ctx.strokeStyle = "#333";
            ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
    }
}

// Draw labels
function drawLabels() {
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Day labels
    for (let d = 0; d < cols; d++) {
        ctx.fillStyle = "black";
        ctx.fillText(days[d], (d + 1) * cellWidth + cellWidth / 2, cellHeight / 2);
    }

    // Hour labels
    for (let h = 0; h < rows; h++) {
        ctx.fillText(h.toString() + ":00", cellWidth / 2, (h + 1) * cellHeight + cellHeight / 2);
    }
}


// Redraw whichever graph is active
function redraw() {
    if (!savedLocalGrid) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showBestTimes) {
        const { bestGrid, maxCount } = makeBestTimeGrid(savedLocalGrid);
        drawBestTimesGrid(bestGrid, maxCount);
    } else {
        drawGrid(savedLocalGrid);
    }
}
