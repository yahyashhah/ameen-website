export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team for support and inquiries'
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 000-0000';
  const hours = process.env.NEXT_PUBLIC_SUPPORT_HOURS || 'Mon-Fri, 9am-5pm EST';
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">We're here to help with any questions or concerns</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href={`mailto:${email}`} className="text-gray-600 hover:underline">{email}</a>
                <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a href={`tel:${phone}`} className="text-gray-600 hover:underline">{phone}</a>
                <p className="text-sm text-gray-500 mt-1">{hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Support Hours</h3>
                <p className="text-gray-600">{hours}</p>
                <p className="text-sm text-gray-500 mt-1">Closed on weekends and holidays</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Before contacting us</h3>
            <p className="text-gray-600 text-sm mb-3">Check out our FAQ page for quick answers to common questions.</p>
            <a href="/support" className="text-sm font-medium hover:underline">Visit Support Center →</a>
          </div>
        </div>

        <div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input 
                type="text" 
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input 
                type="email" 
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <input 
                type="text" 
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea 
                rows={6} 
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Send Message
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our privacy policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
