/**
 * Shape Generator for "Complete the Drawing" mode
 * Generates random squiggles, angles, and gestures inspired by the Torrance Test of Creative Thinking
 */

class ShapeGenerator {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.shapes = [
            'organic_circle',
            'organic_rectangle',
            'swirl',
            'wave_curve',
            'branching_lines',
            'organic_spiral',
            'flowing_s',
            'natural_zigzag',
            'cloud_shape',
            'leaf_shape',
            'organic_diamond',
            'breathing_circle'
        ];
        this.generatedShapeImageData = null; // Store the generated shape
    }

    /**
     * Generate a random shape on the canvas
     */
    generateShape() {
        const shapeType = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        
        // Get the actual canvas dimensions (accounting for device pixel ratio)
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const rect = this.canvas.getBoundingClientRect();
        const visibleWidth = rect.width;
        const visibleHeight = rect.height;
        
        // Calculate center based on actual canvas dimensions (not visible)
        const centerX = this.canvas.width / 2 / dpr;
        let centerY = this.canvas.height / 2 / dpr;
        
        // Move up 100px on mobile devices only
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            centerY -= 200;
        }
        
        const size = Math.min(visibleWidth, visibleHeight) * 0.3;

        console.log('Generating shape:', {
            shapeType,
            visibleWidth,
            visibleHeight,
            centerX,
            centerY,
            size,
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            dpr: dpr
        });

        // Get current brush settings from the drawing system
        const sizeInput = document.getElementById('size');
        const colorInput = document.getElementById('color');
        const zenColors = document.querySelectorAll('.zen-color');
        
        // Get current brush size (default to 15 for better mobile finger drawing)
        let currentBrushSize = 15;
        if (sizeInput) {
            currentBrushSize = Number(sizeInput.value);
        }
        
        // Get current brush color (default to #333 if not found)
        let currentBrushColor = '#333';
        if (colorInput) {
            currentBrushColor = colorInput.value;
        } else if (zenColors.length > 0) {
            // Check for active zen color
            const activeZenColor = document.querySelector('.zen-color.active');
            if (activeZenColor) {
                currentBrushColor = activeZenColor.getAttribute('data-color');
            } else {
                // Use first zen color as fallback
                currentBrushColor = zenColors[0].getAttribute('data-color');
            }
        }

        // Set drawing style to match current brush settings
        this.ctx.strokeStyle = currentBrushColor;
        this.ctx.lineWidth = currentBrushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        console.log('Using brush settings:', {
            brushSize: currentBrushSize,
            brushColor: currentBrushColor
        });

        switch (shapeType) {
            case 'm_shape':
                this.drawMShape(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'v_shape':
                this.drawVShape(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'disconnected_lines':
                this.drawDisconnectedLines(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'touching_circles':
                this.drawTouchingCircles(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'spiral':
                this.drawSpiral(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'diamond':
                this.drawDiamond(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 's_curve':
                this.drawSCurve(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'zigzag':
                this.drawZigzag(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'caret':
                this.drawCaret(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
        }
    }

    // Organic Circle - using sine wave perturbations with transformations
    drawOrganicCircle(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.save();
        
        // Random transformations
        const scaleX = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        const scaleY = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        const rotation = Math.random() * Math.PI * 2; // 0 to 2π
        const offsetX = (Math.random() - 0.5) * size * 0.2;
        const offsetY = (Math.random() - 0.5) * size * 0.2;
        
        // Apply transformations
        this.ctx.translate(centerX + offsetX, centerY + offsetY);
        this.ctx.rotate(rotation);
        this.ctx.scale(scaleX, scaleY);
        
        this.ctx.beginPath();
        const radius = size * 0.3;
        const points = 64;
        
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const baseRadius = radius;
            
            // Add organic perturbations using multiple sine waves
            const perturbation1 = Math.sin(angle * 3) * radius * 0.1;
            const perturbation2 = Math.sin(angle * 5 + Math.PI/4) * radius * 0.05;
            const perturbation3 = Math.sin(angle * 7 + Math.PI/2) * radius * 0.03;
            
            const organicRadius = baseRadius + perturbation1 + perturbation2 + perturbation3;
            
            const x = Math.cos(angle) * organicRadius;
            const y = Math.sin(angle) * organicRadius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Organic Rectangle - curved edges with natural variation
    drawOrganicRectangle(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.4;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // Create organic rectangle with curved edges
        const points = 32;
        const segments = 4;
        
        for (let side = 0; side < segments; side++) {
            for (let i = 0; i <= points / segments; i++) {
                let px, py;
                const t = i / (points / segments);
                
                switch (side) {
                    case 0: // Top edge
                        px = x + t * width;
                        py = y + Math.sin(t * Math.PI) * height * 0.1;
                        break;
                    case 1: // Right edge
                        px = x + width + Math.sin(t * Math.PI) * width * 0.1;
                        py = y + t * height;
                        break;
                    case 2: // Bottom edge
                        px = x + (1 - t) * width;
                        py = y + height + Math.sin(t * Math.PI) * height * 0.1;
                        break;
                    case 3: // Left edge
                        px = x + Math.sin(t * Math.PI) * width * 0.1;
                        py = y + (1 - t) * height;
                        break;
                }
                
                if (side === 0 && i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
    }

    // Swirl - organic spiral with natural flow and transformations
    drawSwirl(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.save();
        
        // Random transformations
        const scaleX = 0.6 + Math.random() * 0.8; // 0.6 to 1.4
        const scaleY = 0.6 + Math.random() * 0.8; // 0.6 to 1.4
        const rotation = Math.random() * Math.PI * 2; // 0 to 2π
        const offsetX = (Math.random() - 0.5) * size * 0.3;
        const offsetY = (Math.random() - 0.5) * size * 0.3;
        
        // Apply transformations
        this.ctx.translate(centerX + offsetX, centerY + offsetY);
        this.ctx.rotate(rotation);
        this.ctx.scale(scaleX, scaleY);
        
        this.ctx.beginPath();
        const maxRadius = size * 0.4;
        const turns = 2 + Math.random() * 2;
        const points = 100;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const angle = t * turns * Math.PI * 2;
            const radius = t * maxRadius;
            
            // Add organic variation
            const variation = Math.sin(angle * 3) * radius * 0.1;
            const organicRadius = radius + variation;
            
            const x = Math.cos(angle) * organicRadius;
            const y = Math.sin(angle) * organicRadius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Wave Curve - flowing wave pattern with transformations
    drawWaveCurve(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.save();
        
        // Random transformations
        const scaleX = 0.5 + Math.random() * 1.0; // 0.5 to 1.5
        const scaleY = 0.5 + Math.random() * 1.0; // 0.5 to 1.5
        const rotation = Math.random() * Math.PI * 2; // 0 to 2π
        const offsetX = (Math.random() - 0.5) * size * 0.4;
        const offsetY = (Math.random() - 0.5) * size * 0.4;
        
        // Apply transformations
        this.ctx.translate(centerX + offsetX, centerY + offsetY);
        this.ctx.rotate(rotation);
        this.ctx.scale(scaleX, scaleY);
        
        this.ctx.beginPath();
        const width = size * 0.8;
        const height = size * 0.4;
        const x = -width/2;
        const y = 0;
        const points = 50;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const px = x + t * width;
            const py = y + Math.sin(t * Math.PI * 3) * height * 0.5 + 
                      Math.sin(t * Math.PI * 7) * height * 0.2;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Branching Lines - tree-like organic growth
    drawBranchingLines(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const trunkLength = size * 0.4;
        const branchLength = size * 0.2;
        
        // Main trunk
        this.ctx.moveTo(centerX, centerY + trunkLength);
        this.ctx.lineTo(centerX, centerY - trunkLength * 0.3);
        
        // Branches
        const branchAngle1 = -Math.PI/4 + (Math.random() - 0.5) * 0.5;
        const branchAngle2 = Math.PI/4 + (Math.random() - 0.5) * 0.5;
        
        const branchStartX = centerX;
        const branchStartY = centerY - trunkLength * 0.3;
        
        // Left branch
        this.ctx.moveTo(branchStartX, branchStartY);
        this.ctx.lineTo(
            branchStartX + Math.cos(branchAngle1) * branchLength,
            branchStartY + Math.sin(branchAngle1) * branchLength
        );
        
        // Right branch
        this.ctx.moveTo(branchStartX, branchStartY);
        this.ctx.lineTo(
            branchStartX + Math.cos(branchAngle2) * branchLength,
            branchStartY + Math.sin(branchAngle2) * branchLength
        );
        
        this.ctx.stroke();
    }

    // Organic Spiral - natural spiral with variation
    drawOrganicSpiral(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const turns = 2 + Math.random() * 1;
        const maxRadius = size * 0.4;
        const points = 80;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const angle = t * turns * Math.PI * 2;
            const radius = t * maxRadius;
            
            // Add organic variation
            const variation = Math.sin(angle * 2) * radius * 0.15;
            const organicRadius = radius + variation;
            
            const x = centerX + Math.cos(angle) * organicRadius;
            const y = centerY + Math.sin(angle) * organicRadius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }

    // Flowing S - organic S curve with natural flow
    drawFlowingS(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.8;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        const points = 50;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const px = x + t * width;
            
            // Create flowing S curve with organic variation
            const sCurve = Math.sin(t * Math.PI) * height * 0.5;
            const variation = Math.sin(t * Math.PI * 3) * height * 0.1;
            const py = y + height/2 + sCurve + variation;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.stroke();
    }

    // Natural Zigzag - organic zigzag with flowing transitions
    drawNaturalZigzag(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.8;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        const points = 40;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const px = x + t * width;
            
            // Create organic zigzag with smooth transitions
            const zigzag = Math.sin(t * Math.PI * 4) * height * 0.4;
            const variation = Math.sin(t * Math.PI * 8) * height * 0.1;
            const py = y + height/2 + zigzag + variation;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.stroke();
    }

    // Cloud Shape - organic cloud-like formation
    drawCloudShape(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const radius = size * 0.3;
        const points = 32;
        
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const baseRadius = radius;
            
            // Create cloud-like organic variation
            const variation1 = Math.sin(angle * 2) * radius * 0.2;
            const variation2 = Math.sin(angle * 3 + Math.PI/3) * radius * 0.1;
            const variation3 = Math.sin(angle * 5 + Math.PI/6) * radius * 0.05;
            
            const organicRadius = baseRadius + variation1 + variation2 + variation3;
            
            const x = centerX + Math.cos(angle) * organicRadius;
            const y = centerY + Math.sin(angle) * organicRadius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
    }

    // Leaf Shape - organic leaf-like form
    drawLeafShape(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.8;
        const x = centerX - width/2;
        const y = centerY - height/2;
        const points = 40;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const px = x + t * width;
            
            // Create leaf shape with organic variation
            const leafCurve = Math.sin(t * Math.PI) * height * 0.5;
            const variation = Math.sin(t * Math.PI * 2) * height * 0.1;
            const py = y + height/2 + leafCurve + variation;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.stroke();
    }

    // Organic Diamond - natural diamond with curved edges
    drawOrganicDiamond(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.4;
        const x = centerX - width/2;
        const y = centerY - height/2;
        const points = 32;
        
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            let px, py;
            
            if (t < 0.25) { // Top edge
                px = x + t * 4 * width;
                py = y + Math.sin(t * Math.PI * 4) * height * 0.1;
            } else if (t < 0.5) { // Right edge
                px = x + width + Math.sin((t - 0.25) * Math.PI * 4) * width * 0.1;
                py = y + (t - 0.25) * 4 * height;
            } else if (t < 0.75) { // Bottom edge
                px = x + (1 - (t - 0.5) * 4) * width;
                py = y + height + Math.sin((t - 0.5) * Math.PI * 4) * height * 0.1;
            } else { // Left edge
                px = x + Math.sin((t - 0.75) * Math.PI * 4) * width * 0.1;
                py = y + (1 - (t - 0.75) * 4) * height;
            }
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
    }

    // Breathing Circle - circle with gentle breathing variation
    drawBreathingCircle(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const radius = size * 0.3;
        const points = 64;
        
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const baseRadius = radius;
            
            // Add gentle breathing variation
            const breathing = Math.sin(angle * 2) * radius * 0.05;
            const organicRadius = baseRadius + breathing;
            
            const x = centerX + Math.cos(angle) * organicRadius;
            const y = centerY + Math.sin(angle) * organicRadius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
    }

    /**
     * Draw a specific shape type
     */
    drawShape(shapeType, centerX, centerY, size, visibleWidth, visibleHeight) {
        switch (shapeType) {
            case 'organic_circle':
                this.drawOrganicCircle(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'organic_rectangle':
                this.drawOrganicRectangle(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'swirl':
                this.drawSwirl(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'wave_curve':
                this.drawWaveCurve(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'branching_lines':
                this.drawBranchingLines(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'organic_spiral':
                this.drawOrganicSpiral(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'flowing_s':
                this.drawFlowingS(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'natural_zigzag':
                this.drawNaturalZigzag(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'cloud_shape':
                this.drawCloudShape(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'leaf_shape':
                this.drawLeafShape(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'organic_diamond':
                this.drawOrganicDiamond(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
            case 'breathing_circle':
                this.drawBreathingCircle(centerX, centerY, size, visibleWidth, visibleHeight);
                break;
        }
    }

    /**
     * Clear the canvas and generate a new shape
     */
    generateNewShape() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.generateShape();
    }

    /**
     * Generate a shape with fade-in animation
     */
    generateShapeWithFade() {
        console.log('ShapeGenerator.generateShapeWithFade called');
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        console.log('Canvas element:', this.canvas);
        
        // Clear canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Generate the shape with fade-in effect
        this.generateShapeFadeIn();
    }

    /**
     * Redraw the generated shape (for eraser functionality)
     */
    redrawGeneratedShape() {
        if (this.generatedShapeImageData) {
            this.ctx.putImageData(this.generatedShapeImageData, 0, 0);
        }
    }

    /**
     * Generate shape with smooth fade-in animation
     */
    generateShapeFadeIn() {
        const shapeType = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        
        // Get the actual canvas dimensions (accounting for device pixel ratio)
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const rect = this.canvas.getBoundingClientRect();
        const visibleWidth = rect.width;
        const visibleHeight = rect.height;
        
        // Calculate center based on actual canvas dimensions (not visible)
        const centerX = this.canvas.width / 2 / dpr;
        let centerY = this.canvas.height / 2 / dpr;
        
        // Move up 100px on mobile devices only
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            centerY -= 100;
        }
        
        const size = Math.min(visibleWidth, visibleHeight) * 0.3;

        console.log('Generating shape with fade-in:', shapeType);

        // Get current brush settings
        const sizeInput = document.getElementById('size');
        const colorInput = document.getElementById('color');
        const zenColors = document.querySelectorAll('.zen-color');
        
        let currentBrushSize = 15;
        if (sizeInput) {
            currentBrushSize = Number(sizeInput.value);
        }
        
        let currentBrushColor = '#333';
        if (colorInput) {
            currentBrushColor = colorInput.value;
        } else if (zenColors.length > 0) {
            const activeColor = document.querySelector('.zen-color.active');
            if (activeColor) {
                currentBrushColor = activeColor.dataset.color || '#333';
            }
        }

        // Set up drawing context for fade-in
        this.ctx.save();
        this.ctx.globalAlpha = 0; // Start invisible
        this.ctx.lineWidth = currentBrushSize;
        this.ctx.strokeStyle = currentBrushColor;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Draw the shape
        this.drawShape(shapeType, centerX, centerY, size, visibleWidth, visibleHeight);

        // Animate fade-in
        let opacity = 0;
        const fadeInInterval = setInterval(() => {
            opacity += 0.02; // Fade in over ~2.5 seconds (50 steps * 50ms)
            
            // Clear and redraw with new opacity
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = opacity;
            this.drawShape(shapeType, centerX, centerY, size, visibleWidth, visibleHeight);
            
            if (opacity >= 1) {
                clearInterval(fadeInInterval);
                this.ctx.globalAlpha = 1;
                this.ctx.restore();
                
                // Store the generated shape data for redrawing
                this.generatedShapeImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            }
        }, 50); // ~20fps for smooth animation
    }
}
