import React, { useEffect, useRef } from 'react';
//import './ProteinViewer.css';

const ProteinViewer = ({ pdbData }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!pdbData || !window.$3Dmol) return;

    // Create a new div element for the viewer
    const viewerElement = document.createElement('div');
    viewerElement.style.width = '100%';
    viewerElement.style.height = '500px';
    viewerRef.current.innerHTML = '';
    viewerRef.current.appendChild(viewerElement);

    // Initialize viewer with dark background
    const viewer = window.$3Dmol.createViewer(viewerElement, {
      backgroundColor: '#1e1e1e'  // dark mode
    });

    try {
      viewer.addModel(pdbData, 'pdb');
      viewer.setStyle({ cartoon: { color: 'spectrum' } });
      viewer.zoomTo();
      viewer.zoom(2, 800);
      viewer.spin(true);
      viewer.render();
    } catch (error) {
      console.error('Error rendering protein:', error);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
      }
    };
  }, [pdbData]);

  return (
    <div className="viewer-wrapper">
      <div ref={viewerRef} className="viewer-box" />
    </div>
  );
};

export default ProteinViewer;
