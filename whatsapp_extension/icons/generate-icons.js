// Simple icon generator using canvas
// To use: Open generate-icons.html in a browser and click "Download All Icons"
// Or use this Node.js script if you have canvas installed

const fs = require('fs');
const { createCanvas } = require('canvas');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const scale = size / 128;
    
    ctx.scale(scale, scale);
    
    // Background
    ctx.fillStyle = '#1a73e8';
    ctx.fillRect(0, 0, 128, 128);
    
    ctx.translate(24, 24);
    
    // Signal waves
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.quadraticCurveTo(30, 20, 40, 30);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.quadraticCurveTo(50, 20, 40, 30);
    ctx.stroke();
    
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(40, 5);
    ctx.quadraticCurveTo(25, 20, 40, 35);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(40, 5);
    ctx.quadraticCurveTo(55, 20, 40, 35);
    ctx.stroke();
    
    ctx.globalAlpha = 1.0;
    
    // Center dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(40, 20, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Connector line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 24);
    ctx.lineTo(40, 45);
    ctx.stroke();
    
    // Network nodes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(20, 55, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(40, 50, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(60, 55, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Connection lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, 55);
    ctx.lineTo(35, 50);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(45, 50);
    ctx.lineTo(55, 55);
    ctx.stroke();
    
    // Data packets
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(36, 60, 8, 8);
    
    ctx.globalAlpha = 0.8;
    ctx.fillRect(16, 65, 6, 6);
    ctx.fillRect(58, 65, 6, 6);
    
    return canvas;
}

// Generate icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icon${size}.png`, buffer);
    console.log(`Generated icon${size}.png`);
});

console.log('All icons generated successfully!');
