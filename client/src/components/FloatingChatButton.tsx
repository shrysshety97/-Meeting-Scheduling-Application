export default function FloatingChatButton() {
  return (
    <button
      onClick={() => alert('Chat feature coming soon!')}
      className="fixed bottom-5 right-5 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2.5 text-sm text-gray-600 hover:shadow-xl transition-shadow border border-gray-100 z-50"
      aria-label="Ask me anything"
    >
      <span className="text-indigo-600 font-semibold text-base leading-none">+</span>
      <span className="text-gray-500 text-xs">Ask me anything...</span>
      <span className="text-gray-400">🎤</span>
    </button>
  );
}
