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


// Load data.json
fetch("./data.json")
    .then(res => res.json())
    .then(data => {
        const people = data.people;

        // Create grid[hour][day]
        const grid = Array.from({ length: 24 }, () =>
            Array.from({ length: 7 }, () => [])
        );

        // Process each person's availability in UTC
        people.forEach(person => {
            person.availability.forEach(slot => {
                const localDay = slot.day;
                const tz = person.timezone;

                slot.time.forEach(localHour => {

                    // Convert (localDay + localHour + timezone) → UTC hour + UTC day
                    const { utcDay, utcHour } = convertToUTC(localDay, localHour, tz);

                    // Insert into the grid
                    grid[utcHour][utcDay].push(person.name);
                });
            });
        });

        drawGrid(grid);
    })
    .catch(err => console.error("Error loading data.json:", err));



/**********************************************************
 * Convert local time from ANY timezone → UTC day + hour
 **********************************************************/
function convertToUTC(localDayName, localHour, timezone) {
    // Skip invalid timezones (empty or placeholder)
    if (!timezone || timezone === ".....") {
        return { utcDay: 0, utcHour: 0 };  // default fallback
    }

    // Get numeric day index (0=Sun)
    const dayIndex = days.indexOf(localDayName.slice(0, 3));

    // Build a full local datetime string
    const localDate = new Date(`2025-01-05T${String(localHour).padStart(2, "0")}:00:00`);

    // Force the Date to interpret this as the person's timezone
    const utcString = localDate.toLocaleString("en-US", { timeZone: timezone });

    // Reconstruct the Date into actual UTC
    const trueDate = new Date(utcString);

    // Now extract the real UTC components
    let utcHour = trueDate.getUTCHours();
    let utcDay = (dayIndex + (trueDate.getUTCDate() - localDate.getUTCDate())) % 7;

    if (utcDay < 0) utcDay += 7;

    return { utcDay, utcHour };
}



/**********************************************************
 * Draw grid with white→blue shading and labels
 **********************************************************/
function drawGrid(grid) {

    // Get max people in any cell
    let maxPeople = 0;
    for (let h = 0; h < rows; h++) {
        for (let d = 0; d < cols; d++) {
            maxPeople = Math.max(maxPeople, grid[h][d].length);
        }
    }

    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ---- Day labels ----
    for (let d = 0; d < cols; d++) {
        ctx.fillStyle = "black";
        ctx.fillText(days[d], (d + 1) * cellWidth + cellWidth / 2, cellHeight / 2);
    }

    // ---- Hour labels ----
    for (let h = 0; h < rows; h++) {
        ctx.fillStyle = "black";
        ctx.fillText(h.toString(), cellWidth / 2, (h + 1) * cellHeight + cellHeight / 2);
    }

    // ---- Draw cells with blue fading ----
    for (let hour = 0; hour < rows; hour++) {
        for (let day = 0; day < cols; day++) {

            const count = grid[hour][day].length;

            let x = (day + 1) * cellWidth;
            let y = (hour + 1) * cellHeight;

            if (count > 0) {
                let fraction = count / maxPeople;

                // White → Blue gradient
                let blue = Math.floor(255 * fraction);
                let r = 255 - blue;
                let g = 255 - blue;
                let b = 255;

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
                ctx.fillStyle = "white";
            }

            ctx.fillRect(x, y, cellWidth, cellHeight);

            ctx.strokeStyle = "#333";
            ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
    }
}
