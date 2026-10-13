import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fade-in" style={{ textAlign: "center", padding: "96px 20px" }}>
      <div className="pixel neon-magenta" style={{ fontSize: 56 }}>
        404
      </div>
      <div className="pixel" style={{ fontSize: 14, color: "var(--yellow)", marginTop: 24, letterSpacing: "0.2em" }}>
        GAME OVER
      </div>
      <div className="mono" style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 12, letterSpacing: "0.16em" }}>
        ESTA PANTALLA NO EXISTE EN EL VAULT
      </div>
      <div style={{ marginTop: 36 }}>
        <Link href="/" className="btn lg">
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
