export const metadata = {
  title: 'Support & FAQ',
  description: 'Find answers to common questions and get help with your orders'
};

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 5-7 business days. Expedited shipping (2-3 business days) is available at checkout.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you\'ll receive a tracking number via email. You can also check your order status in your account.'
      }
    ]
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for most products. Items must be unused and in original packaging.'
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our support team at support@example.com with your order number. We\'ll provide you with a return label.'
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive your return.'
      }
    ]
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your products authentic?',
        a: 'Yes, we only sell authentic products sourced directly from authorized distributors.'
      },
      {
        q: 'Do you offer warranties?',
        a: 'All products come with manufacturer warranties. Extended warranty options are available at checkout.'
      },
      {
        q: 'Can I get product recommendations?',
        a: 'Absolutely! Contact our team at support@example.com or use our live chat for personalized recommendations.'
      }
    ]
  },
  {
    category: 'Account & Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, PayPal, and other secure payment methods.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, we use industry-standard encryption and never store your complete payment details.'
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'You can modify or cancel orders within 1 hour of placing them. Contact support immediately for assistance.'
      }
    ]
  }
];

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Support & FAQ</h1>
        <p className="text-gray-600 text-lg mb-8">Find answers to commonly asked questions</p>
        
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h2 className="font-semibold mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-4">Our support team is here to assist you.</p>
          <div className="space-y-2">
            <p><strong>Email:</strong> support@example.com</p>
            <p><strong>Hours:</strong> Monday - Friday, 9AM - 6PM EST</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{section.category}</h2>
            <div className="space-y-6">
              {section.questions.map((item, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
