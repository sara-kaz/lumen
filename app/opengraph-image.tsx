import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lumen — medicine, made legible";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0f14",
          padding: "0 96px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "12px solid #4db6ac",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #eafffb 0%, #7fe3d8 55%, #4db6ac 100%)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: 12,
              color: "#4db6ac",
              textTransform: "uppercase",
            }}
          >
            Lumen
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 88,
            color: "#e6edf3",
            letterSpacing: -2,
          }}
        >
          Medicine, made legible.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 32,
            color: "#8b9bb0",
            lineHeight: 1.45,
            maxWidth: 860,
          }}
        >
          Understand your own lab results — or practise clinical reasoning against
          simulated patients.
        </div>
      </div>
    ),
    size,
  );
}
