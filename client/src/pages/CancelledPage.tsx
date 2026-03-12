import { useSearchParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function CancelledPage() {
  const [params] = useSearchParams();
  const name = params.get('name');
  const error = params.get('error');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-12 px-4">
      <div className="w-full max-w-md">
        <Logo />
        <div className="bg-white rounded-2xl shadow-md p-8 text-center animate-scaleIn">
          {error ? (
            <>
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Invalid or expired link</h2>
              <p className="text-sm text-gray-500 mb-6">
                This cancellation link is invalid or has already been used.
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Meeting cancelled</h2>
              <p className="text-sm text-gray-500 mb-6">
                {name ? `Hi ${name}, your` : 'Your'} meeting has been successfully cancelled.
              </p>
            </>
          )}
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Book a new meeting
          </Link>
        </div>
      </div>
    </div>
  );
}
