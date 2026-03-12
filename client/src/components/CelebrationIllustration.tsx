export default function CelebrationIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Teal checkmark character body */}
      <ellipse cx="60" cy="80" rx="22" ry="26" fill="#5eead4" />
      {/* Head */}
      <circle cx="60" cy="54" r="14" fill="#5eead4" />
      {/* Checkmark on body */}
      <path d="M52 80 L58 87 L70 73" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Left arm holding balloon string */}
      <path d="M40 70 Q30 60 28 50" stroke="#5eead4" strokeWidth="5" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M80 70 Q88 62 85 52" stroke="#5eead4" strokeWidth="5" strokeLinecap="round" />
      
      {/* Balloon 1 - purple */}
      <ellipse cx="28" cy="38" rx="10" ry="13" fill="#a78bfa" />
      <path d="M28 51 Q26 56 28 60" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Balloon 2 - red/coral */}
      <ellipse cx="50" cy="28" rx="10" ry="13" fill="#f87171" />
      <path d="M50 41 Q48 47 50 52" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Balloon 3 - yellow */}
      <ellipse cx="74" cy="32" rx="10" ry="13" fill="#fbbf24" />
      <path d="M74 45 Q72 51 74 56" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />

      {/* Sparkles */}
      <path d="M95 25 L96.5 20 L98 25 L103 26.5 L98 28 L96.5 33 L95 28 L90 26.5 Z" fill="#fbbf24" />
      <path d="M15 30 L16 27 L17 30 L20 31 L17 32 L16 35 L15 32 L12 31 Z" fill="#a78bfa" />
      <path d="M100 55 L101 52.5 L102 55 L104.5 56 L102 57 L101 59.5 L100 57 L97.5 56 Z" fill="#f87171" />
      <path d="M10 60 L11 58 L12 60 L14 61 L12 62 L11 64 L10 62 L8 61 Z" fill="#5eead4" />
    </svg>
  );
}
