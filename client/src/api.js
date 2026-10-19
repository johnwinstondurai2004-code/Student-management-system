const BASE = "/api/students";

const handle = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getStudents = (q = "") => fetch(`${BASE}?q=${encodeURIComponent(q)}`).then(handle);
export const createStudent = (fd) => fetch(BASE, { method: "POST", body: fd }).then(handle);
export const updateStudent = (id, fd) => fetch(`${BASE}/${id}`, { method: "PUT", body: fd }).then(handle);
export const deleteStudent = (id) => fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle);
