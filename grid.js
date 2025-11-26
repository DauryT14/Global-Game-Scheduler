const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Define rows and columns
const rows = 24;
const cols = 7;

// Set rectangular cell size
const cellWidth = canvas.width / cols;      // normal width
const cellHeight = canvas.height / rows * 0.5; // vertically thinner

// Draw grid
function drawGrid() {
    ctx.strokeStyle = "#333";
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(cols * cellWidth, i * cellHeight);
        ctx.stroke();
    }
    // Vertical lines
    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * cellWidth, 0);
        ctx.lineTo(j * cellWidth, rows * cellHeight);
        ctx.stroke();
    }
}

// Populate cells with labels
function populateGrid() {
    ctx.fillStyle = "blue";
    ctx.font = `${Math.min(cellWidth, cellHeight) / 3}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.fillText(`${i},${j}`, j * cellWidth + cellWidth/2, i * cellHeight + cellHeight/2);
        }
    }
}

drawGrid();
populateGrid();
