import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertCircle, TrendingUp, Globe, Package, DollarSign, Truck, FileText, Users } from 'lucide-react';

const TradeAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [analysisParams, setAnalysisParams] = useState({
    product_name: 'shilajit',
    source_country: 'IN',
    target_country: 'US',
    quantity: 1000,
    budget: 50000,
    current_price: 25.0
  });

  // Mock data for demonstration
  const mockData = {
    trade_overview: {
      product: 'Shilajit',
      source_country: 'India',
      target_country: 'United States',
      quantity: 1000,
      budget: 50000
    },
    market_intelligence: {
      current_market_conditions: {
        demand_level: 'high',
        supply_availability: 'moderate',
        price_trend: 'increasing',
        market_growth: '15% annually'
      }
    },
    pricing_analysis: {
      cost_structure: {
        source_price: '$25/gram',
        total_landed_cost: '$27.75/gram'
      },
      market_pricing: {
        wholesale_market: {
          current_range: '$30-40/gram',
          profit_margin: '15-20%'
        }
      }
    },
    supplier_recommendations: {
      recommended_suppliers: [
        {
          supplier_id: 'SUP_001',
          name: 'Himalayan Gold Exports',
          location: 'Rishikesh, Uttarakhand, India',
          contact: {
            primary_contact: 'Rajesh Kumar',
            email: 'rajesh@himalayangold.com',
            phone: '+91-9876543210'
          },
          pricing: {
            base_price: '$24/gram'
          },
          quality_assurance: {
            quality_score: 4.8
          },
          logistics: {
            lead_time: '15-20 days'
          },
          business_profile: {
            certifications: ['ISO 9001', 'FSSAI', 'Organic India']
          },
          credibility_score: 9.2
        },
        {
          supplier_id: 'SUP_002',
          name: 'Shilajit Direct India',
          location: 'Chandigarh, Punjab, India',
          contact: {
            primary_contact: 'Priya Sharma',
            email: 'priya@shilajitdirect.in',
            phone: '+91-9988776655'
          },
          pricing: {
            base_price: '$26/gram'
          },
          quality_assurance: {
            quality_score: 4.6
          },
          logistics: {
            lead_time: '12-18 days'
          },
          business_profile: {
            certifications: ['GMP', 'FDA registered', 'Export license']
          },
          credibility_score: 8.8
        }
      ],
      negotiation_tips: [
        'Request samples before bulk orders',
        'Negotiate better rates for quantities >1kg',
        'Ask for extended payment terms for repeat orders',
        'Request additional certifications if needed for US market'
      ],
      red_flags_to_avoid: [
        'Suppliers without proper certifications',
        'Unusually low prices (may indicate poor quality)',
        'No physical address or business registration',
        'Reluctance to provide samples or test reports'
      ]
    },
    logistics_optimization: {
      shipping_options: {
        air_freight: {
          transit_time: '5-7 days',
          cost: '$8-12/kg',
          best_for: 'Small quantities, urgent orders',
          recommended_carriers: ['DHL', 'FedEx', 'UPS']
        },
        sea_freight: {
          transit_time: '25-35 days',
          cost: '$2-4/kg',
          best_for: 'Large quantities >100kg',
          recommended_carriers: ['Maersk', 'MSC', 'CMA CGM']
        },
        express_courier: {
          transit_time: '3-5 days',
          cost: '$15-25/kg',
          best_for: 'Samples, small orders <5kg',
          recommended_carriers: ['DHL Express', 'FedEx Priority']
        }
      },
      recommended_route: {
        origin: 'Delhi/Mumbai, India',
        destination: 'Los Angeles/New York, USA',
        method: 'Air freight for <50kg, Sea freight for >50kg',
        total_time: '12-15 days including customs'
      },
      packaging_requirements: {
        primary_packaging: 'Food-grade sealed pouches/containers',
        secondary_packaging: 'Corrugated boxes with cushioning',
        labeling: 'Product name, weight, origin, batch number',
        special_requirements: 'Moisture protection, temperature control'
      }
    },
    regulatory_requirements: {
      export_requirements_india: {
        mandatory_documents: [
          'Export License (DGFT)',
          'FSSAI Certificate',
          'Certificate of Origin',
          'Phytosanitary Certificate',
          'Commercial Invoice',
          'Packing List'
        ],
        product_specific: {
          ayush_license: 'Required for Ayurvedic products',
          lab_testing_certificate: 'Heavy metals, microbiology'
        }
      },
      import_requirements_usa: {
        fda_requirements: {
          facility_registration: 'Required for food facilities',
          process_filing: 'Required for dietary supplements',
          labeling_compliance: 'FDA dietary supplement rules'
        },
        customs_requirements: {
          customs_duty: '0% (health supplement)',
          entry_documents: [
            'Commercial Invoice',
            'Bill of Lading',
            'Packing List',
            'FDA Prior Notice'
          ]
        }
      },
      compliance_timeline: {
        preparation_phase: '30-45 days',
        document_processing: '15-20 days',
        shipment_clearance: '3-5 days',
        total_timeline: '50-70 days for first shipment'
      },
      regulatory_costs: {
        fda_registration: '$200-500',
        testing_costs: '$500-1000',
        documentation: '$300-500',
        total_estimated: '$2000-4000'
      }
    },
    risk_assessment: {
      risk_categories: {
        market_risks: {
          demand_volatility: { level: 'medium' },
          price_fluctuation: { level: 'high' },
          competition: { level: 'medium' }
        },
        operational_risks: {
          supply_disruption: { level: 'medium' },
          quality_issues: { level: 'low' },
          logistics_delays: { level: 'medium' }
        }
      }
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/v2/trade-analysis/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisParams),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result.data);
        setAnalysisData(result.data);
        setError(null);
      } else {
        const errorResult = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`API request failed: ${errorResult.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching trade analysis:', error);
      setError(`Connection error: ${error instanceof Error ? error.message : 'Unable to connect to AI engine'}`);
    }
    setLoading(false);
  };

  const renderOverview = () => {
    const data = analysisData || mockData;
    const { trade_overview, pricing_analysis, risk_assessment } = data;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trade Overview Card */}
        <Card className="col-span-full bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="w-5 h-5" />
              Trade Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Product</p>
                <p className="font-semibold text-gray-300 capitalize">{trade_overview?.product}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Route</p>
                <p className="font-semibold text-gray-300">{trade_overview?.source_country} → {trade_overview?.target_country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Quantity</p>
                <p className="font-semibold text-gray-300">{trade_overview?.quantity?.toLocaleString()} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Budget</p>
                <p className="font-semibold text-gray-300">${trade_overview?.budget?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Conditions */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" />
              Market Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Demand Level</span>
                <Badge variant="default">
                  {data.market_intelligence?.current_market_conditions?.demand_level}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Supply</span>
                <Badge variant="warning">
                  {data.market_intelligence?.current_market_conditions?.supply_availability}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Price Trend</span>
                <Badge variant="success">
                  {data.market_intelligence?.current_market_conditions?.price_trend}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Market Growth</span>
                <span className="font-semibold text-green-600">
                  {data.market_intelligence?.current_market_conditions?.market_growth}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Analysis */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="w-5 h-5" />
              Pricing Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Source Price</span>
                <span className="font-semibold text-gray-300">{pricing_analysis.cost_structure?.source_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Landed Cost</span>
                <span className="font-semibold text-gray-300">{pricing_analysis.cost_structure?.total_landed_cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Market Price</span>
                <span className="font-semibold text-green-600">
                  {pricing_analysis.market_pricing?.wholesale_market?.current_range}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Profit Margin</span>
                <span className="font-semibold text-green-600">
                  {pricing_analysis.market_pricing?.wholesale_market?.profit_margin}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="w-5 h-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(risk_assessment.risk_categories || {}).map(([category, risks]: [string, any]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium capitalize text-gray-300">{category.replace('_', ' ')}</h4>
                  {Object.entries(risks).map(([risk, details]: [string, any]) => (
                    <div key={risk} className="flex justify-between text-sm">
                      <span className="text-gray-300">{risk.replace('_', ' ')}</span>
                      <Badge variant={details.level === 'high' ? 'destructive' : details.level === 'medium' ? 'warning' : 'secondary'}>
                        {details.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSuppliers = () => {
    const data = analysisData || mockData;
    const { recommended_suppliers, negotiation_tips, red_flags_to_avoid } = data.supplier_recommendations;

    return (
      <div className="space-y-6">
        {/* Recommended Suppliers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommended_suppliers?.map((supplier: any) => (
            <Card key={supplier.supplier_id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>{supplier.name}</span>
                  <Badge variant="default">Score: {supplier.credibility_score}/10</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-medium text-gray-300">{supplier.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Contact</p>
                    <div className="text-sm">
                      <p className="text-gray-300">{supplier.contact?.primary_contact}</p>
                      <p className="text-gray-300">{supplier.contact?.email}</p>
                      <p className="text-gray-300">{supplier.contact?.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Pricing</p>
                    <p className="font-semibold text-green-600">{supplier.pricing?.base_price}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Quality Score</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${(supplier.quality_assurance?.quality_score / 5) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm">{supplier.quality_assurance?.quality_score}/5</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Lead Time</p>
                    <p className="font-medium text-gray-300">{supplier.logistics?.lead_time}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.business_profile?.certifications?.map((cert: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Negotiation Tips */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              Negotiation Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Negotiation Strategies</h4>
                <ul className="space-y-1">
                  {negotiation_tips?.map((tip: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span className="text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Red Flags to Avoid</h4>
                <ul className="space-y-1">
                  {red_flags_to_avoid?.map((flag: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span className="text-gray-300">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLogistics = () => {
    const data = analysisData || mockData;
    const { shipping_options, recommended_route, packaging_requirements } = data.logistics_optimization;

    return (
      <div className="space-y-6">
        {/* Shipping Options Comparison */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Truck className="w-5 h-5" />
              Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(shipping_options || {}).map(([option, details]: [string, any]) => (
                <div key={option} className="border border-gray-600 rounded-lg p-4 bg-gray-700/30">
                  <h4 className="font-medium capitalize mb-3 text-gray-300">{option.replace('_', ' ')}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Transit Time</span>
                      <span className="font-medium text-gray-300">{details.transit_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Cost</span>
                      <span className="font-medium text-green-600">{details.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Best For</span>
                      <span className="text-xs text-gray-300">{details.best_for}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Carriers</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {details.recommended_carriers?.map((carrier: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">{carrier}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Route */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recommended Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Route Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Origin</span>
                    <span className="font-medium text-gray-300">{recommended_route.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Destination</span>
                    <span className="font-medium text-gray-300">{recommended_route.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="font-medium text-gray-300">{recommended_route.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Time</span>
                    <span className="font-medium text-gray-300">{recommended_route.total_time}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packaging Requirements */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Package className="w-5 h-5" />
              Packaging Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Primary Packaging</h4>
                <p className="text-sm text-gray-400">{packaging_requirements.primary_packaging}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Secondary Packaging</h4>
                <p className="text-sm text-gray-400">{packaging_requirements.secondary_packaging}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Labeling</h4>
                <p className="text-sm text-gray-400">{packaging_requirements.labeling}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-300">Special Requirements</h4>
                <p className="text-sm text-gray-400">{packaging_requirements.special_requirements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDocumentation = () => {
    const data = analysisData || mockData;
    const { export_requirements_india, import_requirements_usa, compliance_timeline, regulatory_costs } = data.regulatory_requirements;

    return (
      <div className="space-y-6">
        {/* Export Requirements */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              Export Requirements (India)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Mandatory Documents</h4>
                <ul className="space-y-2">
                  {export_requirements_india?.mandatory_documents?.map((doc: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span className="text-sm text-gray-300">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Product Specific</h4>
                {Object.entries(export_requirements_india?.product_specific || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="mb-2">
                    <span className="text-sm font-medium capitalize text-gray-300">{key.replace('_', ' ')}: </span>
                    <span className="text-sm text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Requirements */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Import Requirements (USA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3 text-gray-300">FDA Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(import_requirements_usa?.fda_requirements || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-3 bg-gray-700/50 rounded">
                      <span className="text-sm font-medium capitalize text-gray-300">{key.replace('_', ' ')}: </span>
                      <span className="text-sm text-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Customs Requirements</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Customs Duty</span>
                    <span className="font-medium text-gray-300">{import_requirements_usa?.customs_requirements?.customs_duty}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Entry Documents Required:</span>
                    <ul className="mt-2 space-y-1">
                      {import_requirements_usa?.customs_requirements?.entry_documents?.map((doc: string, index: number) => (
                        <li key={index} className="text-sm ml-4 list-disc text-gray-300">{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline and Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Compliance Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(compliance_timeline || {}).map(([phase, duration]: [string, any]) => (
                  <div key={phase} className="flex justify-between">
                    <span className="capitalize text-gray-400">{phase.replace('_', ' ')}</span>
                    <span className="font-medium text-gray-300">{duration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Regulatory Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(regulatory_costs || {}).map(([cost, amount]: [string, any]) => (
                  <div key={cost} className="flex justify-between">
                    <span className="capitalize text-gray-400">{cost.replace('_', ' ')}</span>
                    <span className="font-medium text-gray-300">{amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span>📈</span>
            Trade Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Comprehensive arbitrage analysis and trade intelligence
          </p>
        </div>
      </div>

      {/* Analysis Parameters */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Analysis Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product</label>
              <Select 
                value={analysisParams.product_name} 
                onValueChange={(value) => setAnalysisParams({...analysisParams, product_name: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shilajit">Shilajit</SelectItem>
                  <SelectItem value="turmeric">Turmeric</SelectItem>
                  <SelectItem value="cardamom">Cardamom</SelectItem>
                  <SelectItem value="saffron">Saffron</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Source Country</label>
              <Select 
                value={analysisParams.source_country} 
                onValueChange={(value) => setAnalysisParams({...analysisParams, source_country: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                  <SelectItem value="TH">Thailand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Country</label>
              <Select 
                value={analysisParams.target_country} 
                onValueChange={(value) => setAnalysisParams({...analysisParams, target_country: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
              <Input
                type="number"
                value={analysisParams.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnalysisParams({...analysisParams, quantity: parseInt(e.target.value)})}
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
              <Input
                type="number"
                value={analysisParams.budget}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnalysisParams({...analysisParams, budget: parseFloat(e.target.value)})}
                placeholder="50000"
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Connection Error</span>
            </div>
            <p className="text-sm text-gray-300">{error}</p>
          </CardHeader>
        </Card>
      )}

      {/* Results Status */}
      {!error && !loading && !analysisData && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Ready for Analysis</span>
            </div>
            <p className="text-sm text-gray-300">
              Click "Analyze" to get comprehensive trade intelligence from the AI engine.
            </p>
          </CardHeader>
        </Card>
      )}

      {loading && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
              <span className="text-blue-400 font-medium">Analyzing...</span>
            </div>
            <p className="text-sm text-gray-300">
              AI engine is processing your trade analysis request. This may take a few moments.
            </p>
          </CardHeader>
        </Card>
      )}

      {/* Analysis Results Tabs - Only show when we have data */}
      {(analysisData || (!loading && !error)) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="suppliers" className="mt-6">
            {renderSuppliers()}
          </TabsContent>

          <TabsContent value="logistics" className="mt-6">
            {renderLogistics()}
          </TabsContent>

          <TabsContent value="documentation" className="mt-6">
            {renderDocumentation()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TradeAnalytics;