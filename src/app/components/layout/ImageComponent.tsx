"use client";

import { CldImage } from 'next-cloudinary';

const ImageComponent = () => {
  return (
    <div className="image-container">
      <CldImage
        src="cld-sample-5"
        width="500"
        height="500"
        crop="auto"
        alt="Image optimisée Cloudinary"
      />
    </div>
  );
};

export default ImageComponent;
