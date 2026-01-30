export const dynamic = 'force-static';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-3">About {process.env.NEXT_PUBLIC_BRAND_NAME || 'Our Store'}</h1>
      <p className="text-gray-700 mb-4">
        We’re a team of product enthusiasts dedicated to building better everyday setups. Our catalog focuses on thoughtfully designed, durable accessories from trusted brands—tested for reliability in real workflows.
      </p>
      <p className="text-gray-700">
        From charging to workspace essentials, everything is curated to help you do your best work. New drops arrive regularly—join our newsletter to stay in the loop.
      </p>
    </div>
  );
}
