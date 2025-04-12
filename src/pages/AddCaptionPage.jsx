import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddCaptionPage.css';

function AddCaptionPage() {
  const { fabric } = window;
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // For debugging and transparency: track each layer we add
  // This could be displayed in a debug panel or the console
  const [layers, setLayers] = useState([]);

  // Retrieve imageUrl passed from HomePage
  const imageUrl = location.state?.imageUrl;

  // If no image was passed (i.e., user navigated directly here), go back to homepage
  useEffect(() => {
    if (!imageUrl) {
      navigate('/');
    }
  }, [imageUrl, navigate]);

  useEffect(() => {
    // Basic error handling if fabric is undefined
    if (!fabric) {
      console.error('Fabric.js not found on window. Check script ordering.');
      return;
    }

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#fff',
    });
    setCanvas(initCanvas);

    // Load the image as background
    if (imageUrl) {
      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          // Scale image to fit canvas
          const scaleRatio = Math.min(
            initCanvas.width / img.width,
            initCanvas.height / img.height
          );
          img.set({
            originX: 'left',
            originY: 'top',
            selectable: false, // background not selectable
          });
          img.scale(scaleRatio);
          initCanvas.setBackgroundImage(
            img,
            initCanvas.renderAll.bind(initCanvas)
          );

          // Log background as a "layer" for debugging
          const bgLayer = {
            type: 'backgroundImage',
            src: imageUrl,
            scaledWidth: img.getScaledWidth(),
            scaledHeight: img.getScaledHeight(),
          };
          setLayers((prev) => [...prev, bgLayer]);
        },
        { crossOrigin: 'anonymous' } // Attempt to avoid cross-origin issues
      );
    }

    // Cleanup on unmount
    return () => {
      initCanvas.dispose();
    };
  }, [imageUrl]);

  // Helper to log newly added object in layers array
  const logNewLayer = (obj) => {
    // We'll store minimal attributes (type, position, color, etc.)
    // Feel free to store more if you wish.
    const layerData = {
      type: obj.type,
      left: obj.left,
      top: obj.top,
      fill: obj.fill,
      width: obj.width || undefined,
      height: obj.height || undefined,
      radius: obj.radius || undefined,
      text: obj.text || undefined,
      points: obj.points || undefined,
    };

    setLayers((prev) => [...prev, layerData]);

    // For immediate debugging:
    console.log('New layer added:', layerData);
  };

  // Add text
  const handleAddText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Your Text Here', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#000000',
      editable: true,
    });
    canvas.add(text).setActiveObject(text);
    canvas.renderAll();

    // log
    logNewLayer(text);
  };

  // Add Rectangle
  const handleAddRectangle = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      fill: 'rgba(255, 0, 0, 0.5)',
      width: 100,
      height: 100,
    });
    canvas.add(rect).setActiveObject(rect);
    canvas.renderAll();

    // log
    logNewLayer(rect);
  };

  // Add Circle
  const handleAddCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 50,
      fill: 'rgba(0, 200, 0, 0.5)',
    });
    canvas.add(circle).setActiveObject(circle);
    canvas.renderAll();

    // log
    logNewLayer(circle);
  };

  // Add Triangle
  const handleAddTriangle = () => {
    if (!canvas) return;
    const triangle = new fabric.Triangle({
      left: 250,
      top: 250,
      width: 100,
      height: 100,
      fill: 'rgba(0, 0, 255, 0.5)',
    });
    canvas.add(triangle).setActiveObject(triangle);
    canvas.renderAll();

    // log
    logNewLayer(triangle);
  };

  // Add Polygon (e.g., hexagon)
  const handleAddPolygon = () => {
    if (!canvas) return;
    const points = [
      { x: 0, y: 50 },
      { x: 43.3, y: 25 },
      { x: 43.3, y: -25 },
      { x: 0, y: -50 },
      { x: -43.3, y: -25 },
      { x: -43.3, y: 25 },
    ];
    const polygon = new fabric.Polygon(points, {
      left: 300,
      top: 300,
      fill: 'rgba(255,165,0,0.5)',
    });
    canvas.add(polygon).setActiveObject(polygon);
    canvas.renderAll();

    // log
    logNewLayer(polygon);
  };

  // Download final image
  const handleDownload = () => {
    if (!canvas) return;
    console.log('Download button clicked');

    // Attempt to export the canvas
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    // Debug check
    console.log('DataURL starts with:', dataURL.slice(0, 50));

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'modified-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="add-caption-page">
      <h2>Add Caption & Shapes</h2>

      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      <div className="controls">
        <button onClick={handleAddText}>Add Text</button>
        <button onClick={handleAddRectangle}>Add Rectangle</button>
        <button onClick={handleAddCircle}>Add Circle</button>
        <button onClick={handleAddTriangle}>Add Triangle</button>
        <button onClick={handleAddPolygon}>Add Polygon</button>
        <button onClick={handleDownload}>Download</button>
      </div>

      {/* BONUS: Display the layers array for real-time transparency */}
      <div className="layer-logs">
        <h3>Canvas Layers:</h3>
        {layers.length === 0 ? (
          <p>No layers yet. Add shapes or text!</p>
        ) : (
          <ul>
            {layers.map((layer, idx) => (
              <li key={idx}>
                <pre>{JSON.stringify(layer, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddCaptionPage;
