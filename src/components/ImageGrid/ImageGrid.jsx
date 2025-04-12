import React from 'react';
import ImageCard from '../ImageCard/ImageCard';
import './ImageGrid.css';

function ImageGrid({ images, onAddCaption }) {
  return (
    <div className="image-grid">
      {images.map((img, index) => (
        <ImageCard
          key={index}
          imageUrl={img}
          onAddCaption={() => onAddCaption(img)}
        />
      ))}
    </div>
  );
}

export default ImageGrid;
