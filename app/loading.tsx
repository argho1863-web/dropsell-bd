export default function Loading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid #dcfce7", borderTop: "4px solid #16a34a", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
