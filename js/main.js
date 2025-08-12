// Original colors
const originalColors = {
    bgColor: '#1A171C',
    g1Stroke: '#64BC46', g1Fill: '#4D9133',
    g2Stroke: '#EDE829', g2Fill: '#ADA61E',
    g3Stroke: '#8A8C87', g3Fill: '#18268C',
    g4Stroke: '#DE4A4A', g4Fill: '#B53737',
    g5Stroke: '#E54B9B', g5Fill: '#A52B71',
    g6Stroke: '#414FA2', g6Fill: '#2A3C84',
    g7Stroke: '#9F792C', g7Fill: '#725117',
    g8Stroke: '#76B6E3', g8Fill: '#3D7191'
};

// Current colors
let currentColors = {...originalColors};

// Function to generate random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to create group controls HTML
function createGroupControls() {
    const container = document.getElementById('groupControls');
    let html = '';
    
    for (let i = 1; i <= 8; i++) {
        html += `
            <div class="color-group">
                <h3>G${i}</h3>
                <div class="color-controls-row">
                    <div class="color-control">
                        <label>Fill</label>
                        <input type="color" id="g${i}-fill" value="${currentColors[`g${i}Fill`]}">
                    </div>
                    <div class="color-control">
                        <label>Stroke</label>
                        <input type="color" id="g${i}-stroke" value="${currentColors[`g${i}Stroke`]}">
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Function to render all clouds
function renderClouds() {
    const svg = document.getElementById('svg-preview');
    
    // Clear existing clouds (keep the background)
    const existingClouds = svg.querySelectorAll('.cloud-group');
    existingClouds.forEach(cloud => cloud.remove());
    
    // Create clouds for each group
    for (let group = 0; group < 8; group++) {
        const groupPositions = cloudPositions[group];
        const strokeColor = currentColors[`g${group+1}Stroke`];
        const fillColor = currentColors[`g${group+1}Fill`];
        
        for (const pos of groupPositions) {
            // Create a new cloud element
            const cloudElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
            cloudElement.innerHTML = cloudSVG;
            cloudElement.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
            
            // Set colors
            const strokePath = cloudElement.querySelector('.cloud-stroke');
            const fillPath = cloudElement.querySelector('.cloud-fill');
            strokePath.setAttribute('fill', strokeColor);
            fillPath.setAttribute('fill', fillColor);
            
            // Add to SVG
            svg.appendChild(cloudElement);
        }
    }
    
    // Update background color
    document.getElementById('bg').setAttribute('fill', currentColors.bgColor);
    
    // Update color pickers to match current colors
    document.getElementById('bg-fill').value = currentColors.bgColor;
}

// Function to randomize all colors
function randomizeAllColors() {
    currentColors.bgColor = getRandomColor();
    
    for (let i = 1; i <= 8; i++) {
        currentColors[`g${i}Fill`] = getRandomColor();
        currentColors[`g${i}Stroke`] = getRandomColor();
    }
    
    renderClouds();
    createGroupControls();
    setupEventListeners();
}

// Function to reset to original colors
function resetColors() {
    currentColors = {...originalColors};
    renderClouds();
    createGroupControls();
    setupEventListeners();
}

// Function to download SVG
function downloadSVG() {
    const svgElement = document.getElementById('svg-preview');
    
    // Create a clone of the SVG element to avoid modifying the original
    const clone = svgElement.cloneNode(true);
    
    // Add XML declaration and proper SVG namespace
    const serializer = new XMLSerializer();
    let svgContent = serializer.serializeToString(clone);
    
    // Fix the SVG content to ensure proper XML structure
    svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + 
                 '<!-- Created with Cloud Pattern Customizer -->\n' +
                 svgContent;
    
    // Ensure the SVG has proper namespace
    if(!svgContent.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgContent = svgContent.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    // Ensure the SVG has proper viewBox if missing
    if(!svgContent.match(/^<svg[^>]+viewBox=/)) {
        svgContent = svgContent.replace(/^<svg/, '<svg viewBox="0 0 1399.8 1400"');
    }
    
    // Create download link
    const blob = new Blob([svgContent], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloud-pattern.svg';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

// Set up event listeners
function setupEventListeners() {
    // Global controls
    document.getElementById('randomizeAll').addEventListener('click', randomizeAllColors);
    document.getElementById('resetColors').addEventListener('click', resetColors);
    document.getElementById('downloadSVG').addEventListener('click', downloadSVG);
    
    // Background color control
    document.getElementById('bg-fill').addEventListener('input', (e) => {
        currentColors.bgColor = e.target.value;
        document.getElementById('bg').setAttribute('fill', currentColors.bgColor);
    });
    
    // Group color controls
    for (let i = 1; i <= 8; i++) {
        document.getElementById(`g${i}-fill`).addEventListener('input', (e) => {
            currentColors[`g${i}Fill`] = e.target.value;
            renderClouds();
        });
        
        document.getElementById(`g${i}-stroke`).addEventListener('input', (e) => {
            currentColors[`g${i}Stroke`] = e.target.value;
            renderClouds();
        });
    }
}

// Initialize the app
function init() {
    createGroupControls();
    renderClouds();
    setupEventListeners();
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', init);