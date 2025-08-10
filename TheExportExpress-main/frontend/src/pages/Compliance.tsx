export default function Compliance() {
  return (
    <div className="min-h-screen py-24 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl md:text-5xl font-bold cosmic-text-strong">Compliance & Certifications</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">Our compliance stack ensures every shipment meets origin and destination requirements.</p>
        </header>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">India (Export)</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>DGFT Export License</li>
              <li>FSSAI / AYUSH certificates</li>
              <li>Phytosanitary Certificate</li>
              <li>Certificate of Origin</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Destination (Import)</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>FDA labeling for dietary supplements (US)</li>
              <li>EU product compliance and customs filings</li>
              <li>Certificates per HS code where applicable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


