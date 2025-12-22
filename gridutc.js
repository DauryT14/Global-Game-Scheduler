// Days → columns
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Canvas
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

// Grid size
const rows = 24;  // hours (UTC)
const cols = 7;   // days (UTC week)
const cellWidth = canvas.width / (cols + 1);
const cellHeight = canvas.height / (rows + 1);

// Toggle state
let showBestTimes = false;
let savedUTCGrid = null;

document.getElementById("toggle2").addEventListener("click", () => {
    showBestTimes = !showBestTimes;
    redraw();
    const button = document.getElementById("toggle2");

    if (showBestTimes){
        button.innerText = "Show Normal View";
        button.classList.add('active');
    }
    else{
        button.innerText = "Show Best Times";
        button.classList.remove('active');
    }
    //document.getElementById("toggle2").innerText =
    //    showBestTimes ? "Show Normal View" : "Show Best Times";
});

// Load data.json
fetch("./data.json")
    .then(res => res.json())
    .then(data => {
        const people = data.people.slice(0,193);

        // Create empty UTC grid[hour][day]
        const grid = Array.from({ length: 24 }, () =>
            Array.from({ length: 7 }, () => [])
        );

        // Process each person's availability in UTC
        people.forEach(person => {
            person.availability.forEach(slot => {
                const localDay = slot.day;
                const tz = person.timezone;

                slot.time.forEach(localHour => {
                    const { utcDay, utcHour } = convertToUTC(localDay, localHour, tz);
                    grid[utcHour][utcDay].push(person.name);
                });
            });
        });

        savedUTCGrid = grid;
        redraw();
    })
    .catch(err => console.error("Error loading data.json:", err));


// Local to UTC
function convertToUTC(localDayName, localHour, timezone) {
    if (!timezone || timezone === ".....") {
        return { utcDay: 0, utcHour: 0 };
    }

    const dayIndex = days.indexOf(localDayName.slice(0, 3));

    const localDate = new Date(`2025-01-05T${String(localHour).padStart(2, "0")}:00:00`);
    const utcString = localDate.toLocaleString("en-US", { timeZone: timezone });
    const trueDate = new Date(utcString);

    let utcHour = trueDate.getUTCHours();
    let utcDay = (dayIndex + (trueDate.getUTCDate() - localDate.getUTCDate())) % 7;
    if (utcDay < 0) utcDay += 7;

    return { utcDay, utcHour };
}


// Draw grid using all data points
function drawGrid(grid) {

    // Find max people in any cell
    let maxPeople = 0;
    for (let h = 0; h < rows; h++) {
        for (let d = 0; d < cols; d++) {
            maxPeople = Math.max(maxPeople, grid[h][d].length);
        }
    }

    drawLabels();

    // Draw heatmap cells
    for (let hour = 0; hour < rows; hour++) {
        for (let day = 0; day < cols; day++) {

            const count = grid[hour][day].length;
            const x = (day + 1) * cellWidth;
            const y = (hour + 1) * cellHeight;

            if (count > 0) {
                const fraction = count / maxPeople;
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

// Labels
function drawLabels() {
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Day labels
    for (let d = 0; d < cols; d++) {
        ctx.fillStyle = "black";
        ctx.fillText(days[d], (d + 1) * cellWidth + cellWidth / 2, cellHeight / 2);
    }

    // Hour labels (UTC)
    for (let h = 0; h < rows; h++) {
        ctx.fillText(h.toString() + ":00", cellWidth / 2, (h + 1) * cellHeight + cellHeight / 2);
    }
}

// Make best times grid
function makeBestTimeGrid(grid) {
    const slots = [];

    // Collect all slots with counts
    for (let h = 0; h < rows; h++) {
        for (let d = 0; d < cols; d++) {
            slots.push({
                hour: h,
                day: d,
                count: grid[h][d].length
            });
        }
    }

    // Sort descending
    slots.sort((a, b) => b.count - a.count);

    // Pick top 5
    const topFive = slots.slice(0, 5);

    const bestGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
    );

    topFive.forEach(slot => {
        bestGrid[slot.hour][slot.day] = true;
    });

    return {
        bestGrid,
        topFive
    };
}


// Draw best times grid
function drawBestTimesGrid(bestGrid) {
    drawLabels();

    // Draw cells
    for (let hour = 0; hour < rows; hour++) {
        for (let day = 0; day < cols; day++) {

            const x = (day + 1) * cellWidth;
            const y = (hour + 1) * cellHeight;

            if (bestGrid[hour][day]) {
                ctx.fillStyle = "rgb(0, 128, 255)"; // highlight top 5
            } else {
                ctx.fillStyle = "#e6e6e6";         // gray out the rest
            }

            ctx.fillRect(x, y, cellWidth, cellHeight);
            ctx.strokeStyle = "#333";
            ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
    }
}


function redraw() {
    if (!savedUTCGrid) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showBestTimes) {
        const { bestGrid } = makeBestTimeGrid(savedUTCGrid);
        drawBestTimesGrid(bestGrid);
    } else {
        drawGrid(savedUTCGrid);
    }
}

canvas.addEventListener('click', function(event) {
    if (!savedUTCGrid) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    
    const day = Math.floor((x - cellWidth) / cellWidth);
    const hour = Math.floor((y - cellHeight) / cellHeight);
    
    if (day >= 0 && day < cols && hour >= 0 && hour < rows) {
        const count = savedUTCGrid[hour][day].length;
        const people = savedUTCGrid[hour][day];
        
        if (count > 1 || count == 0) {
            
            alert(
                `${days[day]} at ${hour}:00\n` +
                `${count} people available:\n` +
                people.join('\n')
            );
            
            
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.fillRect(
                (day + 1) * cellWidth,
                (hour + 1) * cellHeight,
                cellWidth,
                cellHeight
            );
        }
        else if (count == 1){
            alert(
                `${days[day]} at ${hour}:00\n` +
                `${count} person available:\n` +
                people.join('\n')
            );
            
            
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.fillRect(
                (day + 1) * cellWidth,
                (hour + 1) * cellHeight,
                cellWidth,
                cellHeight
            );
        }
    }
});
