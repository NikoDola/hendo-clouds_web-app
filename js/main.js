// ====== VERSION CONFIGURATION ======
const versions = {
    "0": {
        name: "Single Cloud",
        bgColor: 'transparent', // Transparent background for single cloud
        groups: [
            { stroke: '#64BC46', fill: '#4D9133' } // Single cloud
        ]
    },
    "1": {
        name: "1-Color (Unified)",
        bgColor: '#1A171C',
        groups: [
            { stroke: '#64BC46', fill: '#4D9133' } // Single color group for all clouds
        ]
    },
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

// Cloud positions for different versions
const cloudPositions = {
    "0": [
        // Single cloud in center - positioned at exact center of 1399.8 x 1400 canvas
        [{ x: 699.9, y: 700 }]
    ],
    "1": [
        // All 8 groups merged into one - using the same positions as version 8
        [{ x: 1121.5, y: 983.9 }, { x: 424.7, y: 633.9 }, { x: 1121.5, y: 283.9 },
        { x: 76.4, y: 1333.9 }, { x: 76.4, y: -66.1 }],
        [{ x: 773.1, y: 983.9 }, { x: 76.4, y: 633.9 }, { x: 773.1, y: 283.9 },
        { x: 424.7, y: 1333.9 }, { x: 424.7, y: -66.1 }],
        [{ x: 424.7, y: 983.9 }, { x: 1121.5, y: 633.9 }, { x: 424.7, y: 283.9 },
        { x: 773.1, y: 1333.9 }, { x: 773.1, y: -66.1 }],
        [{ x: 76.4, y: 983.9 }, { x: 773.1, y: 633.9 }, { x: 76.4, y: 283.9 },
        { x: 1121.5, y: 1333.9 }, { x: 1121.5, y: -66.1 }],
        [{ x: 598.8, y: 1158.9 }, { x: 948.7, y: 808.9 }, { x: 598.8, y: 458.9 }, ,
        { x: -101.1, y: 108.9 }, { x: 1298.7, y: 108.9 }],
        [{ x: 1298.7, y: 1158.9 }, { x: -101.1, y: 1158.9 }, { x: 248.9, y: 808.9 },
        { x: 948.7, y: 458.9 }, { x: 248.9, y: 108.9 }],
        [{ x: 948.7, y: 1158.9 }, { x: -101.1, y: 808.9 }, { x: 1298.7, y: 808.9 },
        { x: 598.8, y: 108.9 }, { x: 248.9, y: 458.9 }],
        [{ x: 248.9, y: 1158.9 }, { x: 598.8, y: 808.9 }, { x: 1298.7, y: 458.9 },
        { x: -101.1, y: 458.9 }, { x: 948.7, y: 108.9 }]
    ],
    "2": [
        // Group 1 (White in 2-color version)
        [{ x: 1121.5, y: 983.9 }, { x: 424.7, y: 633.9 }, { x: 1121.5, y: 283.9 },
        { x: 76.4, y: 1333.9 }, { x: 76.4, y: -66.1 }],
        // Group 2 (Black in 2-color version)
        [{ x: 773.1, y: 983.9 }, { x: 76.4, y: 633.9 }, { x: 773.1, y: 283.9 },
        { x: 424.7, y: 1333.9 }, { x: 424.7, y: -66.1 }],
        // Group 3 (White in 2-color version)
        [{ x: 424.7, y: 983.9 }, { x: 1121.5, y: 633.9 }, { x: 424.7, y: 283.9 },
        { x: 773.1, y: 1333.9 }, { x: 773.1, y: -66.1 }],
        // Group 4 (Black in 2-color version)
        [{ x: 76.4, y: 983.9 }, { x: 773.1, y: 633.9 }, { x: 76.4, y: 283.9 },
        { x: 1121.5, y: 1333.9 }, { x: 1121.5, y: -66.1 }],
        // Group 5 (White in 2-color version)
        [{ x: 598.8, y: 1158.9 }, { x: 948.7, y: 808.9 }, { x: 598.8, y: 458.9 }, ,
        { x: -101.1, y: 108.9 }, { x: 1298.7, y: 108.9 }],
        // Group 6 (Black in 2-color version)
        [{ x: 1298.7, y: 1158.9 }, { x: -101.1, y: 1158.9 }, { x: 248.9, y: 808.9 },
        { x: 948.7, y: 458.9 }, { x: 248.9, y: 108.9 }],
        // Group 7 (White in 2-color version)
        [{ x: 948.7, y: 1158.9 }, { x: -101.1, y: 808.9 }, { x: 1298.7, y: 808.9 },
        { x: 598.8, y: 108.9 }, { x: 248.9, y: 458.9 }],
        // Group 8 (Black in 2-color version)
        [{ x: 248.9, y: 1158.9 }, { x: 598.8, y: 808.9 }, { x: 1298.7, y: 458.9 },
        { x: -101.1, y: 458.9 }, { x: 948.7, y: 108.9 }]
    ],
    "4": [
        // Group 1
        [{ x: 1121.5, y: 983.9 }, { x: 424.7, y: 633.9 }, { x: 1121.5, y: 283.9 },
        { x: 76.4, y: 1333.9 }, { x: 76.4, y: -66.1 }],
        // Group 2
        [{ x: 773.1, y: 983.9 }, { x: 76.4, y: 633.9 }, { x: 773.1, y: 283.9 },
        { x: 424.7, y: 1333.9 }, { x: 424.7, y: -66.1 }],
        // Group 3
        [{ x: 424.7, y: 983.9 }, { x: 1121.5, y: 633.9 }, { x: 424.7, y: 283.9 },
        { x: 773.1, y: 1333.9 }, { x: 773.1, y: -66.1 }],
        // Group 4
        [{ x: 76.4, y: 983.9 }, { x: 773.1, y: 633.9 }, { x: 76.4, y: 283.9 },
        { x: 1121.5, y: 1333.9 }, { x: 1121.5, y: -66.1 }]
    ],
    "8": [
        // Group 1
        [{ x: 1121.5, y: 983.9 }, { x: 424.7, y: 633.9 }, { x: 1121.5, y: 283.9 },
        { x: 76.4, y: 1333.9 }, { x: 76.4, y: -66.1 }],
        // Group 2
        [{ x: 773.1, y: 983.9 }, { x: 76.4, y: 633.9 }, { x: 773.1, y: 283.9 },
        { x: 424.7, y: 1333.9 }, { x: 424.7, y: -66.1 }],
        // Group 3
        [{ x: 424.7, y: 983.9 }, { x: 1121.5, y: 633.9 }, { x: 424.7, y: 283.9 },
        { x: 773.1, y: 1333.9 }, { x: 773.1, y: -66.1 }],
        // Group 4
        [{ x: 76.4, y: 983.9 }, { x: 773.1, y: 633.9 }, { x: 76.4, y: 283.9 },
        { x: 1121.5, y: 1333.9 }, { x: 1121.5, y: -66.1 }],
        // Group 5
        [{ x: 598.8, y: 1158.9 }, { x: 948.7, y: 808.9 }, { x: 598.8, y: 458.9 }, ,
        { x: -101.1, y: 108.9 }, { x: 1298.7, y: 108.9 }],
        // Group 6
        [{ x: 1298.7, y: 1158.9 }, { x: -101.1, y: 1158.9 }, { x: 248.9, y: 808.9 },
        { x: 948.7, y: 458.9 }, { x: 248.9, y: 108.9 }],
        // Group 7
        [{ x: 948.7, y: 1158.9 }, { x: -101.1, y: 808.9 }, { x: 1298.7, y: 808.9 },
        { x: 598.8, y: 108.9 }, { x: 248.9, y: 458.9 }],
        // Group 8
        [{ x: 248.9, y: 1158.9 }, { x: 598.8, y: 808.9 }, { x: 1298.7, y: 458.9 },
        { x: -101.1, y: 458.9 }, { x: 948.7, y: 108.9 }]
    ]
};

// Specific color order for 2-color version (matches your SVG pattern)
const twoColorOrder = [0, 1, 0, 1, 0, 1, 0, 1]; // 0 = white, 1 = black

let currentVersion = "8"; // Default to 8-color version
let currentColors = {
    bgColor: versions[currentVersion].bgColor,
    groups: JSON.parse(JSON.stringify(versions[currentVersion].groups))
};

let backgroundVisible = true; // Track background visibility

// Function to generate random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to display color codes
function displayColorCodes() {
    const container = document.getElementById('colorCodes');
    if (!container) return;

    container.innerHTML = '';

    // Add background color code
    if (backgroundVisible) {
        const bgItem = document.createElement('div');
        bgItem.className = 'color-code-item';
        bgItem.innerHTML = `
            <div class="color-preview" style="background-color: ${currentColors.bgColor}"></div>
            <span class="color-label">Background:</span>
            <span class="color-code-text">${currentColors.bgColor}</span>
        `;
        bgItem.addEventListener('click', () => copyToClipboard(currentColors.bgColor));
        container.appendChild(bgItem);
    }

    // Add group color codes
    currentColors.groups.forEach((group, i) => {
        // Fill color
        const fillItem = document.createElement('div');
        fillItem.className = 'color-code-item';
        fillItem.innerHTML = `
            <div class="color-preview" style="background-color: ${group.fill}"></div>
            <span class="color-label">Group ${i + 1} Fill:</span>
            <span class="color-code-text">${group.fill}</span>
        `;
        fillItem.addEventListener('click', () => copyToClipboard(group.fill));
        container.appendChild(fillItem);

        // Stroke color
        const strokeItem = document.createElement('div');
        strokeItem.className = 'color-code-item';
        strokeItem.innerHTML = `
            <div class="color-preview" style="background-color: ${group.stroke}"></div>
            <span class="color-label">Group ${i + 1} Stroke:</span>
            <span class="color-code-text">${group.stroke}</span>
        `;
        strokeItem.addEventListener('click', () => copyToClipboard(group.stroke));
        container.appendChild(strokeItem);
    });
}

// Function to copy color code to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalText = text;
        const element = event.target.closest('.color-code-item').querySelector('.color-code-text');
        element.textContent = 'Copied!';
        element.style.color = '#28a745';

        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '#495057';
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Function to toggle background visibility
function toggleBackground() {
    backgroundVisible = !backgroundVisible;
    const bgElement = document.getElementById('bg');
    const button = document.getElementById('toggleBackground');

    if (backgroundVisible) {
        bgElement.style.display = 'block';
        button.textContent = 'Remove Background';
        button.style.backgroundColor = '#4CAF50';
    } else {
        bgElement.style.display = 'none';
        button.textContent = 'Show Background';
        button.style.backgroundColor = '#dc3545';
    }

    displayColorCodes();
}

// ====== CORE FUNCTIONS ======
function createGroupControls() {
    const container = document.getElementById('groupControls');
    container.innerHTML = '';

    currentColors.groups.forEach((group, i) => {
        const groupElement = document.createElement('div');
        groupElement.className = 'color-group';

        // For version 0, show "Single Cloud" instead of "Group 1"
        // For version 1, show "All Clouds" instead of "Group 1"
        let groupTitle;
        if (currentVersion === "0") {
            groupTitle = "Single Cloud";
        } else if (currentVersion === "1") {
            groupTitle = "All Clouds";
        } else {
            groupTitle = `Group ${i + 1}`;
        }

        groupElement.innerHTML = `
            <h3>${groupTitle}</h3>
            <div class="color-controls-row">
                <div class="color-control">
                    <label>Fill</label>
                    <input type="color" id="g${i + 1}-fill" value="${group.fill}">
                    <div class="color-code-display" id="g${i + 1}-fill-code">${group.fill}</div>
                </div>
                <div class="color-control">
                    <label>Stroke</label>
                    <input type="color" id="g${i + 1}-stroke" value="${group.stroke}">
                    <div class="color-code-display" id="g${i + 1}-stroke-code">${group.stroke}</div>
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

    // Hide background if it's transparent or if background is toggled off
    if (currentColors.bgColor === 'transparent' || !backgroundVisible) {
        bg.style.display = 'none';
    } else {
        bg.style.display = 'block';
    }

    svg.appendChild(bg);

    // Update color picker
    document.getElementById('bg-fill').value = currentColors.bgColor === 'transparent' ? '#1A171C' : currentColors.bgColor;
    document.getElementById('bg-color-code').textContent = currentColors.bgColor === 'transparent' ? 'transparent' : currentColors.bgColor;

    // Get positions for current version
    const positions = cloudPositions[currentVersion];
    if (!positions) return;

    // Create clouds with proper color distribution
    const colorGroups = currentColors.groups;
    const colorCount = colorGroups.length;

    // For 0-cloud version: single cloud only
    if (currentVersion === "0") {
        positions[0].forEach(pos => {
            const cloudElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
            cloudElement.innerHTML = cloudSVG;
            // Center the cloud perfectly and scale it up by 100% (2x)
            // The cloud SVG has its own center point, so we position it at canvas center
            cloudElement.setAttribute('transform', `translate(${pos.x}, ${pos.y}) scale(2)`);

            const paths = cloudElement.querySelectorAll('path');
            paths[0].setAttribute('fill', colorGroups[0].stroke);
            paths[1].setAttribute('fill', colorGroups[0].fill);

            svg.appendChild(cloudElement);
        });
    }
    // For 1-color version: all clouds use the same colors
    else if (colorCount === 1) {
        positions.forEach((groupPositions, groupIndex) => {
            groupPositions.forEach(pos => {
                const cloudElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                cloudElement.innerHTML = cloudSVG;
                cloudElement.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

                const paths = cloudElement.querySelectorAll('path');
                paths[0].setAttribute('fill', colorGroups[0].stroke);
                paths[1].setAttribute('fill', colorGroups[0].fill);

                svg.appendChild(cloudElement);
            });
        });
    }
    // For 2-color version: specific pattern matching your SVG
    else if (colorCount === 2) {
        positions.forEach((groupPositions, index) => {
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

        positions.forEach((groupPositions, index) => {
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
        positions.forEach((groupPositions, index) => {
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

    // Update color codes display
    displayColorCodes();
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

    // Remove background if it's hidden
    if (!backgroundVisible) {
        svgContent = svgContent.replace(/<rect[^>]*id="bg"[^>]*\/?>/, '');
    }

    svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<!-- Created with Cloud Pattern Customizer -->\n' +
        svgContent;

    if (!svgContent.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgContent = svgContent.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Set filename based on background visibility
    const filename = backgroundVisible ? 'cloud-pattern.svg' : 'cloud-pattern-transparent.svg';
    link.download = filename;

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
    document.getElementById('toggleBackground')?.addEventListener('click', toggleBackground);

    // Version selector
    document.getElementById('version-select')?.addEventListener('change', (e) => {
        changeVersion(e.target.value);
    });

    // Background color
    document.getElementById('bg-fill')?.addEventListener('input', (e) => {
        currentColors.bgColor = e.target.value;
        const bgElement = document.getElementById('bg');
        bgElement.setAttribute('fill', currentColors.bgColor);

        // Update background visibility based on new color
        if (currentColors.bgColor === 'transparent' || !backgroundVisible) {
            bgElement.style.display = 'none';
        } else {
            bgElement.style.display = 'block';
        }

        document.getElementById('bg-color-code').textContent = currentColors.bgColor === 'transparent' ? 'transparent' : currentColors.bgColor;
        displayColorCodes();
    });

    // Group colors
    currentColors.groups.forEach((_, i) => {
        document.getElementById(`g${i + 1}-fill`)?.addEventListener('input', (e) => {
            currentColors.groups[i].fill = e.target.value;
            document.getElementById(`g${i + 1}-fill-code`).textContent = e.target.value;
            renderClouds();
        });

        document.getElementById(`g${i + 1}-stroke`)?.addEventListener('input', (e) => {
            currentColors.groups[i].stroke = e.target.value;
            document.getElementById(`g${i + 1}-stroke-code`).textContent = e.target.value;
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