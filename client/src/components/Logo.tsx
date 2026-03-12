export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {/* 3D cube SVG matching Climatiq brand */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top face */}
        <polygon points="18,4 32,11 18,18 4,11" fill="#6366f1" />
        {/* Left face */}
        <polygon points="4,11 18,18 18,32 4,25" fill="#312e81" />
        {/* Right face */}
        <polygon points="32,11 18,18 18,32 32,25" fill="#4338ca" />
      </svg>
      <span className="text-2xl font-bold text-[#312e81] tracking-tight">climatiq</span>
    </div>
  );
}
