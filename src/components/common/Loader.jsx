export default function Loader({ text = 'Loading data...', fullScreen = false }) {
  const content = (
    <div className="loader-container">
      <div className="loader-spinner">
        <svg viewBox="0 0 50 50" className="spinner-svg">
          <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
        </svg>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loader-overlay">{content}</div>;
  }

  return content;
}
