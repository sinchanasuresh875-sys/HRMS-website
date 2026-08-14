export default function ErrorState({ message = 'An error occurred' }) {
  return <div className="error-state">{message}</div>;
}
