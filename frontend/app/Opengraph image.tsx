import { ImageResponse } from "next/og";

export const alt = "Free SEO Audit Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#040911",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800 }}>Free SEO Audit Tool</div>
        <div style={{ fontSize: 36, color: "#2dd4bf", marginTop: 20 }}>
          AI-written fixes. No signup.
        </div>
      </div>
    ),
    size
  );
}