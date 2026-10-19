import { useRef } from "react";

export default function StudentCard({ s, onEdit, onDelete }) {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(10px)`;
  };
  const reset = () => (ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)");

  const initials = s.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="card3d" ref={ref} onMouseMove={move} onMouseLeave={reset}>
      <div className="avatar">
        {s.photo ? <img src={s.photo} alt={s.name} /> : <span>{initials}</span>}
      </div>
      <h3>{s.name}</h3>
      <p className="muted">{s.course} • Year {s.year}</p>
      <div className="chips">
        <span className="chip">Roll {s.rollNo}</span>
        <span className="chip accent">Grade {s.grade}</span>
      </div>
      <p className="small">✉ {s.email}</p>
      {s.phone && <p className="small">☎ {s.phone}</p>}
      <div className="actions">
        <button className="btn ghost" onClick={() => onEdit(s)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(s)}>Delete</button>
      </div>
    </div>
  );
}
