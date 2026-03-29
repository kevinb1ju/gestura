export default function ObjectGrid({ count = 0, object = "🍎" }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginTop: "24px",
        fontSize: "64px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <span key={index}>{object}</span>
      ))}
    </div>
  );
}
