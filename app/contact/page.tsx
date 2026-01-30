export const dynamic = 'force-static';

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 000‑0000';
  const hours = process.env.NEXT_PUBLIC_SUPPORT_HOURS || 'Mon–Fri, 9am–5pm';
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-3">Contact</h1>
      <div className="space-y-2 text-gray-700">
        <p>We’re here to help with sizing, compatibility, or order questions.</p>
        <p><span className="font-medium">Email:</span> <a className="underline" href={`mailto:${email}`}>{email}</a></p>
        <p><span className="font-medium">Phone:</span> <a className="underline" href={`tel:${phone}`}>{phone}</a></p>
        <p><span className="font-medium">Support Hours:</span> {hours}</p>
      </div>
    </div>
  );
}
