export default function Header() {
  return (
    <header className="header-container">
      <div className="header-glow"></div>
      <div className="header-content">
        <div className="header-wrapper">
          <div className="header-logo-container">
            <svg className="header-logo" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="1" />
                </linearGradient>
                <filter id="logoShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25"/>
                </filter>
              </defs>
              <circle cx="28" cy="28" r="24" fill="url(#logoGradient)" filter="url(#logoShadow)" opacity="0.95"/>
              <circle cx="28" cy="28" r="22" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
              <path d="M18 28C18 22.48 22.48 18 28 18C33.52 18 38 22.48 38 28C38 33.52 33.52 38 28 38C22.48 38 18 33.52 18 28Z" fill="white" opacity="0.1"/>
              <g opacity="0.9">
                <path d="M24 26L26.5 28.5L32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <circle cx="22" cy="20" r="2" fill="white" opacity="0.4"/>
              <circle cx="34" cy="36" r="1.5" fill="white" opacity="0.3"/>
              <path d="M18 28C18 22.48 22.48 18 28 18C33.52 18 38 22.48 38 28" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="2,2"/>
            </svg>
            <div className="logo-pulse"></div>
          </div>
          <div className="header-text-group">
            <div className="header-title-wrapper">
              <h1 className="header-title">Zello</h1>
            </div>
            <p className="header-tagline">Connect. Chat. Share.</p>
          </div>
          <div className="header-accent"></div>
        </div>
      </div>
      <div className="header-floating-element header-float-1"></div>
      <div className="header-floating-element header-float-2"></div>
      <div className="header-floating-element header-float-3"></div>
    </header>
  )
}

