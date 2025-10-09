// Fabric.js Integration for Driftpad
// Maintains Sumi ink aesthetic and existing interface

class FabricDriftpad {
  constructor(canvasElement) {
    this.canvas = new fabric.Canvas(canvasElement, {
      width: canvasElement.width,
      height: canvasElement.height,
      backgroundColor: 'white',
      selection: false,
      preserveObjectStacking: true
    });

    this.isDrawing = false;
    this.currentMode = 'prompt';
    this.strokeColor = '#000000';
    this.strokeWidth = 15;
    
    // Sumi ink brush setup
    this.setupSumiBrush();
    
    // Event handlers
    this.setupEventHandlers();
    
    // Initialize drawing mode
    this.canvas.isDrawingMode = true;
  }

  setupSumiBrush() {
    // Create custom Sumi ink brush
    const sumiBrush = new fabric.PencilBrush(this.canvas);
    
    // Sumi ink characteristics
    sumiBrush.width = this.strokeWidth;
    sumiBrush.color = this.strokeColor;
    
    // Add watercolor-like shadow for Sumi ink effect
    sumiBrush.shadow = new fabric.Shadow({
      color: this.strokeColor + '20', // 20% opacity
      blur: this.strokeWidth * 0.3,
      offsetX: 1,
      offsetY: 1
    });

    // Custom brush behavior for Sumi ink feel
    const originalOnMouseDown = sumiBrush.onMouseDown.bind(sumiBrush);
    sumiBrush.onMouseDown = (pointer, options) => {
      this.isDrawing = true;
      originalOnMouseDown(pointer, options);
    };

    const originalOnMouseMove = sumiBrush.onMouseMove.bind(sumiBrush);
    sumiBrush.onMouseMove = (pointer, options) => {
      if (this.isDrawing) {
        // Add slight randomness for organic feel
        const randomOffset = (Math.random() - 0.5) * 0.5;
        pointer.x += randomOffset;
        pointer.y += randomOffset;
        originalOnMouseMove(pointer, options);
      }
    };

    const originalOnMouseUp = sumiBrush.onMouseUp.bind(sumiBrush);
    sumiBrush.onMouseUp = (options) => {
      this.isDrawing = false;
      originalOnMouseUp(options);
      
      // Trigger drawing completion event
      this.onDrawingComplete();
    };

    this.canvas.freeDrawingBrush = sumiBrush;
  }

  setupEventHandlers() {
    // Handle drawing completion
    this.canvas.on('path:created', (e) => {
      const path = e.path;
      
      // Add Sumi ink texture
      this.addSumiTexture(path);
      
      // Trigger completion callback
      if (this.onDrawingComplete) {
        this.onDrawingComplete();
      }
    });

    // Handle touch events for mobile
    this.canvas.on('touch:gesture', (e) => {
      // Fabric.js handles touch automatically
    });
  }

  addSumiTexture(path) {
    // Add subtle texture to mimic Sumi ink
    path.set({
      shadow: new fabric.Shadow({
        color: this.strokeColor + '15',
        blur: 2,
        offsetX: 0.5,
        offsetY: 0.5
      })
    });
  }

  // Interface compatibility methods
  setColor(color) {
    this.strokeColor = color;
    this.canvas.freeDrawingBrush.color = color;
    this.canvas.freeDrawingBrush.shadow.color = color + '20';
  }

  setSize(size) {
    this.strokeWidth = size;
    this.canvas.freeDrawingBrush.width = size;
    this.canvas.freeDrawingBrush.shadow.blur = size * 0.3;
  }

  clear() {
    this.canvas.clear();
    this.canvas.backgroundColor = 'white';
    this.canvas.renderAll();
  }

  // Shape generator integration
  drawShape(shapeType, centerX, centerY, size) {
    const shapes = {
      'organic_circle': () => this.createOrganicCircle(centerX, centerY, size),
      'swirl': () => this.createSwirl(centerX, centerY, size),
      'wave_curve': () => this.createWaveCurve(centerX, centerY, size),
      'spiral': () => this.createSpiral(centerX, centerY, size),
      'leaf': () => this.createLeaf(centerX, centerY, size),
      'cloud': () => this.createCloud(centerX, centerY, size),
      'mountain': () => this.createMountain(centerX, centerY, size),
      'river': () => this.createRiver(centerX, centerY, size),
      'tree': () => this.createTree(centerX, centerY, size),
      'flower': () => this.createFlower(centerX, centerY, size),
      'stone': () => this.createStone(centerX, centerY, size),
      'bamboo': () => this.createBamboo(centerX, centerY, size)
    };

    if (shapes[shapeType]) {
      const shape = shapes[shapeType]();
      this.canvas.add(shape);
      this.canvas.renderAll();
      return shape;
    }
  }

  // Organic shape implementations
  createOrganicCircle(centerX, centerY, size) {
    const radius = size * 0.3;
    const points = 64;
    let pathData = 'M ';
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const baseRadius = radius;
      
      // Add organic perturbations
      const perturbation1 = Math.sin(angle * 3) * radius * 0.1;
      const perturbation2 = Math.sin(angle * 5 + Math.PI/4) * radius * 0.05;
      const perturbation3 = Math.sin(angle * 7 + Math.PI/2) * radius * 0.03;
      
      const organicRadius = baseRadius + perturbation1 + perturbation2 + perturbation3;
      
      const x = centerX + Math.cos(angle) * organicRadius;
      const y = centerY + Math.sin(angle) * organicRadius;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    pathData += ' Z';
    
    return new fabric.Path(pathData, {
      left: centerX - radius,
      top: centerY - radius,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createSwirl(centerX, centerY, size) {
    const radius = size * 0.4;
    const turns = 3;
    let pathData = 'M ';
    
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 2 * turns;
      const currentRadius = radius * t;
      
      const x = centerX + Math.cos(angle) * currentRadius;
      const y = centerY + Math.sin(angle) * currentRadius;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - radius,
      top: centerY - radius,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createWaveCurve(centerX, centerY, size) {
    const width = size * 0.8;
    const height = size * 0.3;
    let pathData = 'M ';
    
    for (let i = 0; i <= 50; i++) {
      const x = centerX - width/2 + (i / 50) * width;
      const wave = Math.sin((i / 50) * Math.PI * 4) * height * 0.3;
      const y = centerY + wave;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - width/2,
      top: centerY - height/2,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createSpiral(centerX, centerY, size) {
    const maxRadius = size * 0.4;
    let pathData = 'M ';
    
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 8;
      const radius = maxRadius * t;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - maxRadius,
      top: centerY - maxRadius,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createLeaf(centerX, centerY, size) {
    const width = size * 0.6;
    const height = size * 0.8;
    let pathData = 'M ';
    
    // Leaf shape with organic curves
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = centerX + (t - 0.5) * width;
      const leafCurve = Math.sin(t * Math.PI) * height * 0.4;
      const y = centerY + leafCurve;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - width/2,
      top: centerY - height/2,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createCloud(centerX, centerY, size) {
    const radius = size * 0.3;
    let pathData = 'M ';
    
    // Cloud shape with multiple curves
    for (let i = 0; i <= 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const baseRadius = radius;
      const cloudPuff = Math.sin(angle * 2) * radius * 0.2;
      const organicRadius = baseRadius + cloudPuff;
      
      const x = centerX + Math.cos(angle) * organicRadius;
      const y = centerY + Math.sin(angle) * organicRadius;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    pathData += ' Z';
    
    return new fabric.Path(pathData, {
      left: centerX - radius,
      top: centerY - radius,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createMountain(centerX, centerY, size) {
    const width = size * 0.8;
    const height = size * 0.6;
    let pathData = 'M ';
    
    // Mountain silhouette
    for (let i = 0; i <= 20; i++) {
      const x = centerX - width/2 + (i / 20) * width;
      const mountainPeak = Math.sin((i / 20) * Math.PI) * height * 0.8;
      const y = centerY + height/2 - mountainPeak;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - width/2,
      top: centerY - height/2,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createRiver(centerX, centerY, size) {
    const width = size * 0.8;
    const height = size * 0.4;
    let pathData = 'M ';
    
    // Flowing river curve
    for (let i = 0; i <= 30; i++) {
      const x = centerX - width/2 + (i / 30) * width;
      const riverCurve = Math.sin((i / 30) * Math.PI * 3) * height * 0.3;
      const y = centerY + riverCurve;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - width/2,
      top: centerY - height/2,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createTree(centerX, centerY, size) {
    const trunkHeight = size * 0.6;
    const canopySize = size * 0.5;
    
    // Trunk
    const trunk = new fabric.Line([
      centerX, centerY + canopySize/2,
      centerX, centerY + canopySize/2 + trunkHeight
    ], {
      stroke: this.strokeColor,
      strokeWidth: 4
    });
    
    // Canopy
    const canopy = new fabric.Circle({
      left: centerX - canopySize/2,
      top: centerY - canopySize/2,
      radius: canopySize/2,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
    
    const group = new fabric.Group([trunk, canopy], {
      left: centerX,
      top: centerY
    });
    
    return group;
  }

  createFlower(centerX, centerY, size) {
    const petalCount = 6;
    const petalLength = size * 0.3;
    let pathData = 'M ';
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * petalLength * 0.3;
      const y1 = centerY + Math.sin(angle) * petalLength * 0.3;
      const x2 = centerX + Math.cos(angle) * petalLength;
      const y2 = centerY + Math.sin(angle) * petalLength;
      
      if (i === 0) {
        pathData += `${x1},${y1} L ${x2},${y2}`;
      } else {
        pathData += ` M ${x1},${y1} L ${x2},${y2}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - petalLength,
      top: centerY - petalLength,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createStone(centerX, centerY, size) {
    const radius = size * 0.3;
    let pathData = 'M ';
    
    // Organic stone shape
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const baseRadius = radius;
      const stoneTexture = Math.sin(angle * 3) * radius * 0.1;
      const organicRadius = baseRadius + stoneTexture;
      
      const x = centerX + Math.cos(angle) * organicRadius;
      const y = centerY + Math.sin(angle) * organicRadius;
      
      if (i === 0) {
        pathData += `${x},${y}`;
      } else {
        pathData += ` L ${x},${y}`;
      }
    }
    
    pathData += ' Z';
    
    return new fabric.Path(pathData, {
      left: centerX - radius,
      top: centerY - radius,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  createBamboo(centerX, centerY, size) {
    const segmentHeight = size * 0.2;
    const segmentCount = 4;
    let pathData = 'M ';
    
    // Bamboo segments
    for (let i = 0; i < segmentCount; i++) {
      const y = centerY - size/2 + i * segmentHeight;
      const x1 = centerX - size * 0.1;
      const x2 = centerX + size * 0.1;
      
      if (i === 0) {
        pathData += `${x1},${y} L ${x2},${y}`;
      } else {
        pathData += ` M ${x1},${y} L ${x2},${y}`;
      }
    }
    
    return new fabric.Path(pathData, {
      left: centerX - size * 0.1,
      top: centerY - size/2,
      stroke: this.strokeColor,
      strokeWidth: 3,
      fill: 'transparent'
    });
  }

  // Export functionality
  exportImage() {
    return this.canvas.toDataURL({
      format: 'png',
      quality: 1
    });
  }

  // Resize canvas
  resize(width, height) {
    this.canvas.setDimensions({ width, height });
  }

  // Get canvas element for external access
  getCanvas() {
    return this.canvas;
  }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FabricDriftpad;
} else {
  window.FabricDriftpad = FabricDriftpad;
}
