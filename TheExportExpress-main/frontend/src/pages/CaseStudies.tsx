export default function CaseStudies() {
  const cases = [
    { title: 'US Wellness Retailer', result: 'Reduced landed cost by 12% with consolidation and supplier switching', route: 'India → USA', sku: 'Ayurvedic extracts' },
    { title: 'EU Spice Importer', result: 'Cut lead time by 8 days via multimodal routing and pre-clearance', route: 'India → Netherlands', sku: 'Premium spices' },
    { title: 'MENA Distributor', result: 'Improved forecast accuracy by 15% using price/demand analytics', route: 'India → UAE', sku: 'Agri & wellness' },
  ];
  return (
    <div className="min-h-screen py-24 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <header>
          <h1 className="text-4xl md:text-5xl font-bold cosmic-text-strong">Case Studies</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">A glimpse of measurable outcomes we delivered across key corridors.</p>
        </header>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map(c => (
            <div key={c.title} className="card">
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <div className="text-gray-400 text-sm mt-1">{c.route}</div>
              <div className="text-gray-300 mt-3">{c.sku}</div>
              <div className="text-gray-100 mt-4 font-medium">{c.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


