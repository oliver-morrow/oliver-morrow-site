import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          border: "2px solid #06b6d4",
          borderRadius: 4,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 18,
          color: "#06b6d4",
        }}
      >
        O
      </div>
    ),
    { ...size }
  );
}
