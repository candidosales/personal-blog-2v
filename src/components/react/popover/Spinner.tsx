import "./spinner.css";

const bars = Array(12).fill(0);

export function Spinner({
  color,
  size = 20,
}) {
  return (
    <div
      className="wrapper"
      style={{
        ["--spinner-size"]: `${size}px`,
        ["--spinner-color"]: color,
      }}
    >
      <div className="spinner">
        {bars.map((_, i) => (
          <div className="bar" key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  );
}