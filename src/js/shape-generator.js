/**
 * Shape Generator for "Complete the Drawing" mode
 * Generates random squiggles, angles, and gestures inspired by the Torrance Test of Creative Thinking
 */

class ShapeGenerator {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.shapes = [
            'm_shape',
            'v_shape', 
            'disconnected_lines',
            'touching_circles',
            'spiral',
            'diamond',
            's_curve',
            'zigzag',
            'caret'
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

    drawMShape(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.8;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // M shape with slight tilt and asymmetry
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x + width * 0.15, y);
        this.ctx.lineTo(x + width * 0.4, y + height * 0.6);
        this.ctx.lineTo(x + width * 0.65, y);
        this.ctx.lineTo(x + width, y + height);
        
        this.ctx.stroke();
    }

    drawVShape(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // V shape with slight asymmetry
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width * 0.4, y + height);
        this.ctx.moveTo(x + width * 0.4, y + height);
        this.ctx.lineTo(x + width, y);
        
        this.ctx.stroke();
    }

    drawDisconnectedLines(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.4;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // Two disconnected lines
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width * 0.3, y + height);
        
        this.ctx.moveTo(x + width * 0.7, y + height * 0.2);
        this.ctx.lineTo(x + width, y + height * 0.8);
        
        this.ctx.stroke();
    }

    drawTouchingCircles(centerX, centerY, size, visibleWidth, visibleHeight) {
        const radius = size * 0.15;
        const offset = radius * 0.8; // Slightly overlapping
        
        // First circle
        this.ctx.beginPath();
        this.ctx.arc(centerX - offset, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Second circle
        this.ctx.beginPath();
        this.ctx.arc(centerX + offset, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawSpiral(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const turns = 1.5 + Math.random() * 0.5;
        const maxRadius = size * 0.3;
        
        for (let i = 0; i < turns * Math.PI * 2; i += 0.1) {
            const radius = (i / (turns * Math.PI * 2)) * maxRadius;
            const x = centerX + Math.cos(i) * radius;
            const y = centerY + Math.sin(i) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

    drawDiamond(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.4;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // Diamond shape
        this.ctx.moveTo(centerX, y);
        this.ctx.lineTo(x + width, centerY);
        this.ctx.lineTo(centerX, y + height);
        this.ctx.lineTo(x, centerY);
        this.ctx.closePath();
        
        this.ctx.stroke();
    }

    drawSCurve(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.8;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // S-shaped curve
        this.ctx.moveTo(x, y);
        this.ctx.quadraticCurveTo(x + width * 0.3, y + height * 0.3, x + width * 0.5, y + height * 0.5);
        this.ctx.quadraticCurveTo(x + width * 0.7, y + height * 0.7, x + width, y + height);
        
        this.ctx.stroke();
    }

    drawZigzag(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.8;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // Zigzag pattern
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width * 0.2, y + height);
        this.ctx.lineTo(x + width * 0.4, y);
        this.ctx.lineTo(x + width * 0.6, y + height);
        this.ctx.lineTo(x + width * 0.8, y);
        this.ctx.lineTo(x + width, y + height);
        
        this.ctx.stroke();
    }

    drawCaret(centerX, centerY, size, visibleWidth, visibleHeight) {
        this.ctx.beginPath();
        const width = size * 0.6;
        const height = size * 0.6;
        const x = centerX - width/2;
        const y = centerY - height/2;
        
        // Caret (^) shape with asymmetry
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x + width * 0.4, y);
        this.ctx.moveTo(x + width * 0.4, y);
        this.ctx.lineTo(x + width, y + height);
        
        this.ctx.stroke();
    }

    /**
     * Draw a specific shape type
     */
    drawShape(shapeType, centerX, centerY, size, visibleWidth, visibleHeight) {
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
