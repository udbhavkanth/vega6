import React from 'react';
import './ImageCard.css';

function ImageCard({ imageUrl, onAddCaption }) {
  return (
    <div className="image-card">
      {/* Container that centers the image */}
      <div className="image-wrapper">
        <img src={imageUrl} alt="Searched result" />
      </div>

      {/* Button pinned at bottom of card */}
      <button className="add-caption-btn" onClick={onAddCaption}>
        Add Caption
      </button>
    </div>
  );
}

export default ImageCard;
