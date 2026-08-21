import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f14",
        }}
      >
        {/* The vessel wall */}
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: "50%",
            border: "18px solid #4db6ac",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* The lumen — the open, lit channel */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #eafffb 0%, #7fe3d8 55%, #4db6ac 100%)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
