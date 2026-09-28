import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Button to="/dashboard">Back home</Button>
        </div>
      </Card>
    </div>
  );
}
