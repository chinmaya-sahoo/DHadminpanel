import React, { useEffect, useState } from "react";

const RikoCraftcert = ({ qrSrc = "/qr.jpg", bgSrc = "/poster.jpg" }) => {
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
        overflow: "hidden",
      }}
    >
      {/* ✅ QR Code perfectly aligned */}
      <div
        style={{
          position: "absolute",
          top: imgSize.height * 0.60 + "px", // ~66% from top
          left: imgSize.width * 0.65 + "px", // ~64% from left
          width: imgSize.width * 0.26 + "px", // QR box width
          height: imgSize.width * 0.26 + "px", // QR box height
          background: "#fff",
          borderRadius: "24px",
          border: "10px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <img
          src={qrSrc}
          alt="Shop QR"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />
      </div>
    </div>
  );
};

export default RikoCraftcert;
