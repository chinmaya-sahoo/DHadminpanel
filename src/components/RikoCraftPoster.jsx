import React, { useEffect, useState } from "react";

const RikoCraftPoster = ({ qrSrc = "/qr.jpg", bgSrc = "/qr.jpg" }) => {
  const [imgSize, setImgSize] = useState({ width: 1080, height: 1920 });

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = bgSrc;
  }, [bgSrc]);

  return (
    <div
      style={{
        background: `url('${bgSrc}') center center / contain no-repeat`,
        width: imgSize.width + "px",
        height: imgSize.height + "px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* QR code overlay - adjust top/left/width/height as needed for perfect placement */}
      <div
        style={{
          position: "absolute",
          top: imgSize.height * 0.3200 + "px", // 600/1920 for default
          left: `calc(50% - ${imgSize.width * 0.2000}px)`, // 240/1080 for default, width 480/1080
          width: imgSize.width * 0.4000 + "px", // 480/1080
          height: imgSize.width * 0.3900 + "px", // 480/1080
          background: "#fff",
          
          border: "8px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          
          overflow: "hidden"
        }}
      >
        <img
          src={qrSrc}
          alt="Shop QR"
          style={{
            width: "110%",
            height: "110%",
            objectFit: "cover",
         
            background: "#fff"
          }}
        />
      </div>
    </div>
  );
};

export default RikoCraftPoster; 