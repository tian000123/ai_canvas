'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  // State for canvas and drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Colors for selection
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
  ];
  
  // Brush sizes
  const brushSizes = [2, 5, 10, 15, 20];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        // Clear canvas with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    updateCanvasSize();
    
    // Add resize listener
    const handleResize = () => {
      updateCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    
    if (tool === 'pen') {
      ctx.strokeStyle = color;
    } else { // eraser
      ctx.strokeStyle = '#FFFFFF';
    }

    ctx.lineTo(clientX, clientY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Export functions
  const exportCanvas = (format: 'png' | 'jpeg' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `canvas.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
    link.click();
  };

  return (
    <div className="canvas-container">
      {/* Mobile sidebar overlay */}
      <div className={`mobile-sidebar ${showMobileMenu ? 'active' : ''}`} 
           onClick={() => setShowMobileMenu(false)}>
        <div className="mobile-sidebar-content open">
          <h2>Canvas Options</h2>
          
          <div className="tool-section">
            <div className="tool-title">Color</div>
            <div>
              {colors.map((c) => (
                <div
                  key={c}
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          <div className="tool-section">
            <div className="tool-title">Brush Size</div>
            <div>
              {brushSizes.map((size) => (
                <div
                  key={size}
                  className={`brush-size-option ${brushSize === size ? 'selected' : ''}`}
                  style={{ width: `${size + 10}px`, height: `${size + 10}px` }}
                  onClick={() => setBrushSize(size)}
                />
              ))}
            </div>
          </div>
          
          <div className="tool-section">
            <div className="tool-title">Tools</div>
            <div>
              <button
                className={`btn ${tool === 'pen' ? 'btn-primary' : ''}`}
                onClick={() => setTool('pen')}
              >
                Pen
              </button>
              <button
                className={`btn ${tool === 'eraser' ? 'btn-primary' : ''}`}
                onClick={() => setTool('eraser')}
              >
                Eraser
              </button>
            </div>
          </div>
          
          <div className="export-section">
            <div className="tool-title">Export</div>
            <button className="btn btn-success" onClick={() => exportCanvas('png')}>
              Export PNG
            </button>
            <button className="btn btn-success" onClick={() => exportCanvas('jpeg')}>
              Export JPEG
            </button>
            <button className="btn btn-success" onClick={() => exportCanvas('webp')}>
              Export WEBP
            </button>
          </div>
          
          <button className="btn btn-danger" onClick={clearCanvas}>
            Clear Canvas
          </button>
        </div>
      </div>
      
      {/* Top menu for mobile */}
      <div className="top-menu">
        <button className="menu-btn" onClick={() => setShowMobileMenu(true)}>
          Menu
        </button>
      </div>
      
      {/* Sidebar for PC */}
      <div className="sidebar">
        <h2>Canvas Options</h2>
        
        <div className="tool-section">
          <div className="tool-title">Color</div>
          <div>
            {colors.map((c) => (
              <div
                key={c}
                className={`color-option ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        
        <div className="tool-section">
          <div className="tool-title">Brush Size</div>
          <div>
            {brushSizes.map((size) => (
              <div
                key={size}
                className={`brush-size-option ${brushSize === size ? 'selected' : ''}`}
                style={{ width: `${size + 10}px`, height: `${size + 10}px` }}
                onClick={() => setBrushSize(size)}
              />
            ))}
          </div>
        </div>
        
        <div className="tool-section">
          <div className="tool-title">Tools</div>
          <div>
            <button
              className={`btn ${tool === 'pen' ? 'btn-primary' : ''}`}
              onClick={() => setTool('pen')}
            >
              Pen
            </button>
            <button
              className={`btn ${tool === 'eraser' ? 'btn-primary' : ''}`}
              onClick={() => setTool('eraser')}
            >
              Eraser
            </button>
          </div>
        </div>
        
        <div className="tool-section">
          <div className="tool-title">Export</div>
          <button className="btn btn-success" onClick={() => exportCanvas('png')}>
            Export PNG
          </button>
          <button className="btn btn-success" onClick={() => exportCanvas('jpeg')}>
            Export JPEG
          </button>
          <button className="btn btn-success" onClick={() => exportCanvas('webp')}>
            Export WEBP
          </button>
        </div>
        
        <button className="btn btn-danger" onClick={clearCanvas}>
          Clear Canvas
        </button>
      </div>
      
      {/* Canvas area */}
      <div className="canvas-area">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="canvas-element"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
