import { useEffect, useState, useCallback } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent } from "./api";
import StudentCard from "./components/StudentCard.jsx";
import StudentForm from "./components/StudentForm.jsx";
import StudentsHero from "./components/StudentsHero.jsx";

export default function App() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // null | {} (new) | student
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setStudents(await getStudents(q));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const save = async (fd, id) => {
    id ? await updateStudent(id, fd) : await createStudent(fd);
    setEditing(null);
    load();
  };

  const remove = async (s) => {
    if (!confirm(`Delete ${s.name}?`)) return;
    await deleteStudent(s._id);
    load();
  };

  const courses = new Set(students.map((s) => s.course)).size;

  return (
    <>
      <div className="bg" />
      <header className="hero">
        <div>
          <h1>Edu<span>Verse</span></h1>
          <p className="muted">Student Management System</p>
          <div className="stats">
            <div className="stat glass"><b>{students.length}</b><span>Students</span></div>
            <div className="stat glass"><b>{courses}</b><span>Courses</span></div>
          </div>
        </div>
        <StudentsHero />
      </header>

      <main>
        <div className="toolbar glass">
          <input placeholder="🔍 Search name, roll no, course, email…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn primary" onClick={() => setEditing({})}>+ Add Student</button>
        </div>

        {error && <p className="error center">{error}</p>}
        {loading ? (
          <p className="muted center">Loading…</p>
        ) : students.length === 0 ? (
          <p className="muted center">No students found.</p>
        ) : (
          <div className="grid">
            {students.map((s) => (
              <StudentCard key={s._id} s={s} onEdit={setEditing} onDelete={remove} />
            ))}
          </div>
        )}
      </main>

      {editing && (
        <StudentForm student={editing._id ? editing : null} onSave={save} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
