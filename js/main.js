// ====== VERSION CONFIGURATION ======
const versions = {
    "2": {
        name: "2-Color (Chess)",
        bgColor: '#1A171C', // Dark background matching your SVG
        groups: [
            { stroke: '#FFFFFF', fill: '#FFFFFF' }, // White
            { stroke: '#020401', fill: '#020401' }  // Near black
        ]
    },
    "4": {
        name: "4-Color (Primary)",
        bgColor: '#1A171C',
        groups: [
            { stroke: '#64BC46', fill: '#4D9133' }, // Green
            { stroke: '#414FA2', fill: '#2A3C84' }, // Blue
            { stroke: '#DE4A4A', fill: '#B53737' }, // Red
            { stroke: '#EDE829', fill: '#FFA500' }  // Yellow/Orange
        ]
    },
    "8": {
        name: "8-Color (Full)",
        bgColor: '#1A171C',
        groups: [
            { stroke: '#64BC46', fill: '#4D9133' },
            { stroke: '#EDE829', fill: '#ADA61E' },
            { stroke: '#8A8C87', fill: '#18268C' },
            { stroke: '#DE4A4A', fill: '#B53737' },
            { stroke: '#E54B9B', fill: '#A52B71' },
            { stroke: '#414FA2', fill: '#2A3C84' },
            { stroke: '#9F792C', fill: '#725117' },
            { stroke: '#76B6E3', fill: '#3D7191' }
        ]
    }
};

// Original 8-group positions (used for ALL versions)
const cloudPositions = [
    // Group 1 (White in 2-color version)
    [{x: 1121.5, y: 983.9}, {x: 424.7, y: 633.9}, {x: 1121.5, y: 283.9}, 
     {x: 76.4, y: 1333.9}, {x: 76.4, y: -66.1}],
    // Group 2 (Black in 2-color version)
    [{x: 773.1, y: 983.9}, {x: 76.4, y: 633.9}, {x: 773.1, y: 283.9}, 
     {x: 424.7, y: 1333.9}, {x: 424.7, y: -66.1}],
    // Group 3 (White in 2-color version)
    [{x: 424.7, y: 983.9}, {x: 1121.5, y: 633.9}, {x: 424.7, y: 283.9}, 
     {x: 773.1, y: 1333.9}, {x: 773.1, y: -66.1}],
    // Group 4 (Black in 2-color version)
    [{x: 76.4, y: 983.9}, {x: 773.1, y: 633.9}, {x: 76.4, y: 283.9}, 
     {x: 1121.5, y: 1333.9}, {x: 1121.5, y: -66.1}],
    // Group 5 (White in 2-color version)
    [{x: 598.8, y: 1158.9}, {x: 948.7, y: 808.9}, {x: 598.8, y: 458.9},, 
     {x: -101.1, y: 108.9}, {x: 1298.7, y: 108.9}],
    // Group 6 (Black in 2-color version)
    [{x: 1298.7, y: 1158.9}, {x: -101.1, y: 1158.9}, {x: 248.9, y: 808.9}, 
     {x: 948.7, y: 458.9}, {x: 248.9, y: 108.9}],
    // Group 7 (White in 2-color version)
    [{x: 948.7, y: 1158.9}, {x: -101.1, y: 808.9}, {x: 1298.7, y: 808.9}, 
     {x: 598.8, y: 108.9},  {x: 248.9, y: 458.9}],
    // Group 8 (Black in 2-color version)
    [{x: 248.9, y: 1158.9}, {x: 598.8, y: 808.9}, {x: 1298.7, y: 458.9}, 
     {x: -101.1, y: 458.9}, {x: 948.7, y: 108.9}]
];

// Specific color order for 2-color version (matches your SVG pattern)
const twoColorOrder = [0, 1, 0, 1, 0, 1, 0, 1]; // 0 = white, 1 = black

let currentVersion = "4"; // Default to 4-color version
let currentColors = { 
    bgColor: versions[currentVersion].bgColor,
    groups: JSON.parse(JSON.stringify(versions[currentVersion].groups))
};

// Function to generate random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// ====== CORE FUNCTIONS ======
function createGroupControls() {
    const container = document.getElementById('groupControls');
    container.innerHTML = '';
    
    currentColors.groups.forEach((group, i) => {
        const groupElement = document.createElement('div');
        groupElement.className = 'color-group';
        groupElement.innerHTML = `
            <h3>Group ${i+1}</h3>
            <div class="color-controls-row">
                <div class="color-control">
                    <label>Fill</label>
                    <input type="color" id="g${i+1}-fill" value="${group.fill}">
                </div>
                <div class="color-control">
                    <label>Stroke</label>
                    <input type="color" id="g${i+1}-stroke" value="${group.stroke}">
                </div>
            </div>
        `;
        container.appendChild(groupElement);
    });
}

function renderClouds() {
    const svg = document.getElementById('svg-preview');
    if (!svg) return;
    
    // Clear existing clouds
    svg.innerHTML = '';
    
    // Add background
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute('width', '1399.8');
    bg.setAttribute('height', '1400');
    bg.setAttribute('fill', currentColors.bgColor);
    bg.id = 'bg';
    svg.appendChild(bg);
    
    // Update color picker
    document.getElementById('bg-fill').value = currentColors.bgColor;
    
    // Create clouds with proper color distribution
    const colorGroups = currentColors.groups;
    const colorCount = colorGroups.length;
    
    // For 2-color version: specific pattern matching your SVG
    if (colorCount === 2) {
        cloudPositions.forEach((groupPositions, index) => {
            // Use the predefined order for 2-color version
            const colorIndex = twoColorOrder[index];
            const { stroke, fill } = colorGroups[colorIndex];
            
            groupPositions.forEach(pos => {
                const cloudElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                cloudElement.innerHTML = cloudSVG;
                cloudElement.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
                
                const paths = cloudElement.querySelectorAll('path');
                paths[0].setAttribute('fill', stroke);
                paths[1].setAttribute('fill', fill);
                
                svg.appendChild(cloudElement);
            });
        });
    }
    // For 4-color version: distributed pattern
    else if (colorCount === 4) {
        // Create a pattern where no two adjacent groups share colors
        const colorOrder = [0, 1, 2, 3, 0, 2, 1, 3]; // Custom distribution
        
        cloudPositions.forEach((groupPositions, index) => {
            const colorIndex = colorOrder[index % colorOrder.length];
            const { stroke, fill } = colorGroups[colorIndex];
            
            groupPositions.forEach(pos => {
                const cloudElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                cloudElement.innerHTML = cloudSVG;
                cloudElement.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
                
                const paths = cloudElement.querySelectorAll('path');
                paths[0].setAttribute('fill', stroke);
                paths[1].setAttribute('fill', fill);
                
                svg.appendChild(cloudElement);
            });
        });
    }
    // For 8-color version: original pattern
    else {
        cloudPositions.forEach((groupPositions, index) => {
            const { stroke, fill } = colorGroups[index];
            
            groupPositions.forEach(pos => {
                const cloudElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                cloudElement.innerHTML = cloudSVG;
                cloudElement.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
                
                const paths = cloudElement.querySelectorAll('path');
                paths[0].setAttribute('fill', stroke);
                paths[1].setAttribute('fill', fill);
                
                svg.appendChild(cloudElement);
            });
        });
    }
}

function randomizeAllColors() {
    currentColors.bgColor = getRandomColor();
    currentColors.groups = currentColors.groups.map(() => ({
        stroke: getRandomColor(),
        fill: getRandomColor()
    }));
    
    renderClouds();
    createGroupControls();
    setupEventListeners();
}

function resetColors() {
    currentColors = {
        bgColor: versions[currentVersion].bgColor,
        groups: JSON.parse(JSON.stringify(versions[currentVersion].groups))
    };
    renderClouds();
    createGroupControls();
    setupEventListeners();
}

function changeVersion(version) {
    currentVersion = version;
    currentColors = {
        bgColor: versions[version].bgColor,
        groups: JSON.parse(JSON.stringify(versions[version].groups))
    };
    renderClouds();
    createGroupControls();
    setupEventListeners();
}

function downloadSVG() {
    const svgElement = document.getElementById('svg-preview');
    const serializer = new XMLSerializer();
    let svgContent = serializer.serializeToString(svgElement);
    
    svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + 
                 '<!-- Created with Cloud Pattern Customizer -->\n' +
                 svgContent;
    
    if(!svgContent.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgContent = svgContent.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    const blob = new Blob([svgContent], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloud-pattern.svg';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

// ====== INITIALIZATION ======
function setupEventListeners() {
    // Global controls
    document.getElementById('randomizeAll')?.addEventListener('click', randomizeAllColors);
    document.getElementById('resetColors')?.addEventListener('click', resetColors);
    document.getElementById('downloadSVG')?.addEventListener('click', downloadSVG);
    
    // Version selector
    document.getElementById('version-select')?.addEventListener('change', (e) => {
        changeVersion(e.target.value);
    });
    
    // Background color
    document.getElementById('bg-fill')?.addEventListener('input', (e) => {
        currentColors.bgColor = e.target.value;
        document.getElementById('bg').setAttribute('fill', currentColors.bgColor);
    });
    
    // Group colors
    currentColors.groups.forEach((_, i) => {
        document.getElementById(`g${i+1}-fill`)?.addEventListener('input', (e) => {
            currentColors.groups[i].fill = e.target.value;
            renderClouds();
        });
        
        document.getElementById(`g${i+1}-stroke`)?.addEventListener('input', (e) => {
            currentColors.groups[i].stroke = e.target.value;
            renderClouds();
        });
    });
}

function init() {
    createGroupControls();
    renderClouds();
    setupEventListeners();
}

window.addEventListener('DOMContentLoaded', init);