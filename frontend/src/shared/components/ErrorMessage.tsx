export default function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="text-red-600 text-sm mt-1" data-testid="error-message" role="alert">
      {message}
    </p>
  );
}
