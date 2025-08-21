import { useEffect, useRef, useState } from "react";
import "./CreateUserModal.css";

export default function CreateUserModal({ open, onClose, onCreated }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const dialogRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Simple focus trap into dialog for accessibility (first input)
  useEffect(() => {
    if (open && dialogRef.current) {
      const firstInput = dialogRef.current.querySelector("input[type='email']");
      firstInput?.focus();
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      setMsg("Email is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: trimmedName || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      // Persist & notify parent
      localStorage.setItem("landmarkr:user", JSON.stringify(body));
      onCreated?.(body);
      // Reset form & close
      setEmail("");
      setName("");
      onClose();
    } catch (err) {
      setMsg(String(err.message || err));
    }
  }

  if (!open) return null;

  return (
    <div className="cu-backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="cu-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-title"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <header className="cu-header">
          <h3 id="create-user-title">Create a User</h3>
          <button className="cu-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <form className="cu-form" onSubmit={handleSubmit}>
          <label className="cu-label">
            Email
            <input
              type="email"
              className="cu-input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="cu-label">
            Display name (optional)
            <input
              type="text"
              className="cu-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {msg && <div className="cu-msg">{msg}</div>}

          <div className="cu-actions">
            <button type="button" className="cu-btn cu-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cu-btn cu-btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
