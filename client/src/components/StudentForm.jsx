import { useState } from "react";

const empty = { name: "", email: "", rollNo: "", course: "", year: 1, phone: "", grade: "" };

export default function StudentForm({ student, onSave, onClose }) {
  const [form, setForm] = useState(student ? { ...empty, ...student } : empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(student?.photo || "");
  const [consent, setConsent] = useState(false);
  const [askPermission, setAskPermission] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Step 1: user picks a file -> we ask permission before accepting it
  const pick = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPendingFile(f);
    setAskPermission(true);
    e.target.value = "";
  };

  const allow = () => {
    setFile(pendingFile);
    setPreview(URL.createObjectURL(pendingFile));
    setConsent(true);
    setRemovePhoto(false);
    setAskPermission(false);
  };

  const deny = () => {
    setPendingFile(null);
    setAskPermission(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      ["name", "email", "rollNo", "course", "year", "phone", "grade"].forEach((k) => fd.append(k, form[k] ?? ""));
      if (file) {
        fd.append("photo", file);
        fd.append("photoConsent", String(consent));
      }
      if (removePhoto) fd.append("removePhoto", "true");
      await onSave(fd, student?._id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="overlay">
      <form className="modal glass" onSubmit={submit}>
        <h2>{student ? "Edit Student" : "Add Student"}</h2>

        <div className="photo-row">
          <div className="avatar big">{preview ? <img src={preview} alt="preview" /> : <span>📷</span>}</div>
          <div>
            <label className="btn ghost">
              Choose photo
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pick} />
            </label>
            {preview && (
              <button type="button" className="btn link" onClick={() => { setPreview(""); setFile(null); setConsent(false); setRemovePhoto(true); }}>
                Remove
              </button>
            )}
            <p className="small muted">Max 2 MB. You'll be asked for permission before a photo is added.</p>
          </div>
        </div>

        <div className="grid2">
          <input required placeholder="Full name" value={form.name} onChange={set("name")} />
          <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} />
          <input required placeholder="Roll number" value={form.rollNo} onChange={set("rollNo")} />
          <input required placeholder="Course" value={form.course} onChange={set("course")} />
          <input type="number" min="1" max="8" placeholder="Year" value={form.year} onChange={set("year")} />
          <input placeholder="Grade (e.g. A)" value={form.grade} onChange={set("grade")} />
          <input placeholder="Phone" value={form.phone} onChange={set("phone")} />
        </div>

        {error && <p className="error">{error}</p>}
        <div className="actions end">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>

        {askPermission && (
          <div className="permission">
            <div className="glass perm-box">
              <h3>📸 Permission needed</h3>
              <p>
                Do you have permission from this student (or their parent/guardian) to store and display
                this photo in the system?
              </p>
              <div className="actions end">
                <button type="button" className="btn ghost" onClick={deny}>No, cancel</button>
                <button type="button" className="btn primary" onClick={allow}>Yes, I have permission</button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
