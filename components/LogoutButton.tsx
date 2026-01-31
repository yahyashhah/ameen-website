"use client";

export default function LogoutButton() {
  const onLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload();
    } catch {
      // ignore
    }
  };
  return (
    <button onClick={onLogout} className="text-sm text-gray-600 hover:underline">Logout</button>
  );
}
