import { useRef } from "react";

function Student({ skin, hair, shirt, girl, delay }) {
  return (
    <svg viewBox="0 0 160 220" className="stu" style={{ animationDelay: delay }}>
      {/* body */}
      <path d="M25 220 Q25 140 80 140 Q135 140 135 220 Z" fill={shirt} />
      <rect x="68" y="122" width="24" height="26" rx="8" fill={skin} />
      {/* hair back */}
      {girl && <path d="M28 70 Q25 135 45 140 L115 140 Q135 135 132 70 Z" fill={hair} />}
      {/* head */}
      <circle cx="80" cy="76" r="48" fill={skin} />
      {/* hair top */}
      <path d={girl ? "M32 76 Q30 22 80 24 Q130 22 128 76 Q110 50 80 50 Q50 50 32 76Z"
                    : "M32 72 Q30 20 80 22 Q130 20 128 72 Q112 44 80 46 Q48 44 32 72Z"} fill={hair} />
      {/* cheeks */}
      <circle cx="50" cy="92" r="7" fill="#ff8a8a" opacity=".35" />
      <circle cx="110" cy="92" r="7" fill="#ff8a8a" opacity=".35" />
      {/* eyes (blink) */}
      <g className="eyes" style={{ animationDelay: delay }}>
        <ellipse cx="62" cy="78" rx="9" ry="11" fill="#fff" />
        <ellipse cx="98" cy="78" rx="9" ry="11" fill="#fff" />
        <circle cx="63" cy="80" r="5" fill="#1b1b2f" />
        <circle cx="99" cy="80" r="5" fill="#1b1b2f" />
        <circle cx="65" cy="77" r="1.8" fill="#fff" />
        <circle cx="101" cy="77" r="1.8" fill="#fff" />
      </g>
      {/* smile */}
      <path d="M66 100 Q80 114 94 100" stroke="#7a3b3b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* book */}
      <rect x="52" y="170" width="56" height="38" rx="4" fill="#fff" opacity=".92" />
      <line x1="80" y1="170" x2="80" y2="208" stroke="#b9c3ff" strokeWidth="2" />
    </svg>
  );
}

export default function StudentsHero() {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 20}deg)`;
  };
  const reset = () => (ref.current.style.transform = "rotateY(0) rotateX(0)");

  return (
    <div className="stage" onMouseMove={move} onMouseLeave={reset}>
      <div className="stage-inner" ref={ref}>
        <div className="floor" />
        <div className="stu-wrap left"><Student skin="#f2c9a0" hair="#2b1b12" shirt="#6c8cff" delay="0s" /></div>
        <div className="stu-wrap right"><Student skin="#d9a47a" hair="#1a1020" shirt="#b86cff" girl delay="1.3s" /></div>
      </div>
    </div>
  );
}
