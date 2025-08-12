import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProductPage from '../ProductPage';
import ProductInfoTabs from '../ProductInfoTabs';
import ProductSpecifications from '../ProductSpecifications';
import ProductFeaturesShowcase from '../ProductFeaturesShowcase';
import { Product } from '../../types/product';

// Mock product data for testing
const mockProduct: Product = {
  _id: 'test-product-1',
  name: 'Premium Basmati Rice',
  description: 'High-quality basmati rice sourced from Punjab, India.',
  shortDescription: 'Premium long-grain basmati rice with distinctive aroma.',
  category: 'Grains & Pulses',
  origin: 'Punjab, India',
  images: ['/test-image-1.jpg', '/test-image-2.jpg'],
  specifications: {
    'Grain Length': '6.5-7.0 mm',
    'Moisture Content': '12-14%',
    'Purity': '99.5%',
    'Quality Grade': 'Export Grade A'
  },
  certifications: ['ISO 22000:2018', 'HACCP Certified', 'Organic Certified'],
  packagingOptions: ['1 kg packs', '5 kg bags', '25 kg bulk bags'],
  isActive: true
};

// Test component for ProductInfoTabs
export const ProductInfoTabsTest: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ProductInfoTabs Test</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProductInfoTabs
          product={mockProduct}
          onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        />
      </div>
    </div>
  );
};

// Test component for ProductSpecifications
export const ProductSpecificationsTest: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ProductSpecifications Test</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProductSpecifications
          product={mockProduct}
          enableSearch={true}
          enableFiltering={true}
          enableComparison={false}
          defaultExpanded={false}
          groupSpecifications={true}
        />
      </div>
    </div>
  );
};

// Test component for ProductFeaturesShowcase
export const ProductFeaturesShowcaseTest: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ProductFeaturesShowcase Test</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProductFeaturesShowcase
          product={mockProduct}
          enableScrollAnimation={true}
          enableProgressiveDisclosure={true}
          maxFeaturesVisible={6}
          layout="grid"
        />
      </div>
    </div>
  );
};

// Test component for complete ProductPage
export const ProductPageTest: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <ProductPage />
      </div>
    </BrowserRouter>
  );
};

// Combined test component
const ProductInfoSystemTest: React.FC = () => {
  const [activeTest, setActiveTest] = React.useState<string>('tabs');

  const tests = [
    { id: 'tabs', label: 'Info Tabs', component: <ProductInfoTabsTest /> },
    { id: 'specs', label: 'Specifications', component: <ProductSpecificationsTest /> },
    { id: 'features', label: 'Features Showcase', component: <ProductFeaturesShowcaseTest /> },
    { id: 'page', label: 'Complete Page', component: <ProductPageTest /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Test Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Product Information System Tests
          </h1>
          <div className="flex space-x-2">
            {tests.map((test) => (
              <button
                key={test.id}
                onClick={() => setActiveTest(test.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTest === test.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {test.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div>
        {tests.find(test => test.id === activeTest)?.component}
      </div>
    </div>
  );
};

export default ProductInfoSystemTest;