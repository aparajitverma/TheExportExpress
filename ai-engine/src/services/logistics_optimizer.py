import asyncio
import logging
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class TransportMode(Enum):
    AIR_FREIGHT = "air_freight"
    SEA_FREIGHT = "sea_freight"
    LAND_TRANSPORT = "land_transport"
    EXPRESS_COURIER = "express_courier"
    MULTIMODAL = "multimodal"

class PackagingType(Enum):
    STANDARD = "standard"
    TEMPERATURE_CONTROLLED = "temperature_controlled"
    FRAGILE = "fragile"
    HAZARDOUS = "hazardous"
    PERISHABLE = "perishable"
    BULK = "bulk"

@dataclass
class ShippingRoute:
    """Detailed shipping route information"""
    route_id: str
    origin_port: str
    destination_port: str
    transport_mode: TransportMode
    carriers: List[str]
    transit_time_days: int
    cost_per_kg: float
    reliability_score: float
    frequency_per_week: int
    capacity_limits: Dict[str, int]
    special_requirements: List[str]
    insurance_available: bool
    tracking_capabilities: List[str]

@dataclass
class PackagingSpec:
    """Detailed packaging specifications"""
    packaging_type: PackagingType
    materials_required: List[str]
    cost_per_unit: float
    weight_factor: float
    volume_factor: float
    protection_level: str
    regulatory_compliance: List[str]
    shelf_life_impact: Optional[int]
    sustainability_score: float

class LogisticsOptimizer:
    """Advanced logistics optimization and packaging service"""
    
    def __init__(self, db_client: Any, redis_client: Any):
        self.db_client = db_client
        self.redis_client = redis_client
        self.cache_ttl = 3600  # 1 hour
        
        # Initialize shipping networks and packaging databases
        self.shipping_routes = self._initialize_shipping_routes()
        self.packaging_specs = self._initialize_packaging_specs()
        self.carrier_networks = self._initialize_carrier_networks()
        self.port_capabilities = self._initialize_port_capabilities()
        
    async def optimize_logistics_chain(
        self,
        product_id: str,
        source_country: str,
        target_country: str,
        quantity: int,
        urgency: str = "normal",
        budget_constraint: Optional[float] = None
    ) -> Dict[str, Any]:
        """Optimize complete logistics chain"""
        try:
            cache_key = f"logistics_optimization_{product_id}_{source_country}_{target_country}_{quantity}"
            cached_result = await self.redis_client.get(cache_key)
            if cached_result:
                return cached_result
            
            optimization = {
                "optimization_id": f"OPT_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "input_parameters": {
                    "product_id": product_id,
                    "source_country": source_country,
                    "target_country": target_country,
                    "quantity": quantity,
                    "urgency": urgency,
                    "budget_constraint": budget_constraint
                },
                "packaging_optimization": await self._optimize_packaging(
                    product_id, quantity, target_country
                ),
                "transport_optimization": await self._optimize_transport(
                    source_country, target_country, quantity, urgency, budget_constraint
                ),
                "route_analysis": await self._analyze_shipping_routes(
                    source_country, target_country, urgency
                ),
                "cost_optimization": await self._optimize_costs(
                    product_id, source_country, target_country, quantity
                ),
                "risk_mitigation": await self._analyze_logistics_risks(
                    source_country, target_country, product_id
                ),
                "timeline_optimization": await self._optimize_timeline(
                    source_country, target_country, urgency
                ),
                "documentation_workflow": await self._optimize_documentation(
                    source_country, target_country, product_id
                ),
                "tracking_strategy": await self._design_tracking_strategy(
                    source_country, target_country
                ),
                "contingency_plans": await self._create_contingency_plans(
                    source_country, target_country, product_id
                ),
                "recommendations": await self._generate_logistics_recommendations(
                    product_id, source_country, target_country, quantity, urgency
                ),
                "generated_at": datetime.utcnow().isoformat()
            }
            
            # Cache the optimization
            await self.redis_client.set(cache_key, optimization, expire=self.cache_ttl)
            
            return optimization
            
        except Exception as e:
            logging.error(f"Error optimizing logistics chain: {str(e)}")
            return {"error": str(e)}
    
    async def _optimize_packaging(
        self, product_id: str, quantity: int, target_country: str
    ) -> Dict[str, Any]:
        """Optimize packaging for the product"""
        try:
            product_characteristics = self._get_product_characteristics(product_id)
            target_regulations = self._get_packaging_regulations(target_country)
            
            packaging_options = []
            
            # Analyze different packaging options
            for pkg_type in PackagingType:
                spec = self.packaging_specs.get(pkg_type.value, {})
                
                if self._is_packaging_suitable(product_characteristics, spec, target_regulations):
                    option = {
                        "packaging_type": pkg_type.value,
                        "description": spec.get("description", ""),
                        "cost_analysis": {
                            "unit_cost": spec.get("cost_per_unit", 0),
                            "total_cost": spec.get("cost_per_unit", 0) * quantity,
                            "cost_per_kg": spec.get("cost_per_unit", 0) / max(1, quantity / 1000)
                        },
                        "specifications": {
                            "materials": spec.get("materials_required", []),
                            "protection_level": spec.get("protection_level", "standard"),
                            "weight_factor": spec.get("weight_factor", 1.0),
                            "volume_factor": spec.get("volume_factor", 1.0),
                            "sustainability_score": spec.get("sustainability_score", 0.5)
                        },
                        "compliance": {
                            "regulatory_compliance": spec.get("regulatory_compliance", []),
                            "target_country_approved": True,
                            "special_certifications": []
                        },
                        "advantages": self._get_packaging_advantages(pkg_type.value, product_characteristics),
                        "limitations": self._get_packaging_limitations(pkg_type.value),
                        "suitability_score": self._calculate_packaging_suitability(
                            product_characteristics, spec, target_regulations
                        )
                    }
                    packaging_options.append(option)
            
            # Sort by suitability score
            packaging_options.sort(key=lambda x: x["suitability_score"], reverse=True)
            
            # Select optimal packaging
            optimal_packaging = packaging_options[0] if packaging_options else None
            
            return {
                "optimal_packaging": optimal_packaging,
                "alternative_options": packaging_options[1:3],  # Top 2 alternatives
                "packaging_requirements": {
                    "primary_packaging": self._get_primary_packaging_requirements(product_id),
                    "secondary_packaging": self._get_secondary_packaging_requirements(quantity),
                    "shipping_packaging": self._get_shipping_packaging_requirements(target_country),
                    "labeling_requirements": self._get_labeling_requirements(product_id, target_country)
                },
                "packaging_best_practices": self._get_packaging_best_practices(product_id),
                "cost_saving_tips": self._get_packaging_cost_tips(),
                "sustainability_options": self._get_sustainable_packaging_options()
            }
            
        except Exception as e:
            logging.error(f"Error optimizing packaging: {str(e)}")
            return {"error": str(e)}
    
    async def _optimize_transport(
        self,
        source_country: str,
        target_country: str,
        quantity: int,
        urgency: str,
        budget_constraint: Optional[float]
    ) -> Dict[str, Any]:
        """Optimize transportation method and route"""
        try:
            # Get available routes
            available_routes = self._get_available_routes(source_country, target_country)
            
            transport_options = []
            
            for route in available_routes:
                # Calculate costs and timelines
                transport_cost = self._calculate_transport_cost(route, quantity)
                transit_time = route.get("transit_time_days", 7)
                
                # Apply urgency factors
                urgency_factor = self._get_urgency_factor(urgency)
                adjusted_cost = transport_cost * urgency_factor["cost_multiplier"]
                adjusted_time = transit_time * urgency_factor["time_multiplier"]
                
                # Check budget constraints
                within_budget = True
                if budget_constraint:
                    within_budget = adjusted_cost <= budget_constraint
                
                option = {
                    "transport_mode": route.get("transport_mode"),
                    "route_details": {
                        "origin": route.get("origin_port"),
                        "destination": route.get("destination_port"),
                        "carriers": route.get("carriers", []),
                        "frequency": route.get("frequency_per_week", 1)
                    },
                    "cost_analysis": {
                        "base_cost": transport_cost,
                        "adjusted_cost": adjusted_cost,
                        "cost_per_kg": adjusted_cost / max(1, quantity),
                        "currency": "USD"
                    },
                    "timeline": {
                        "transit_time_days": int(adjusted_time),
                        "pickup_lead_time": route.get("pickup_lead_time", 2),
                        "customs_clearance": route.get("customs_time", 3),
                        "total_door_to_door": int(adjusted_time) + 5
                    },
                    "service_level": {
                        "reliability_score": route.get("reliability_score", 0.8),
                        "tracking_available": route.get("tracking_available", True),
                        "insurance_available": route.get("insurance_available", True),
                        "temperature_control": route.get("temperature_control", False)
                    },
                    "capacity": {
                        "weight_limit_kg": route.get("weight_limit", 10000),
                        "volume_limit_cbm": route.get("volume_limit", 50),
                        "suitable_for_quantity": quantity <= route.get("weight_limit", 10000)
                    },
                    "constraints": {
                        "within_budget": within_budget,
                        "meets_urgency": True,
                        "regulatory_compliant": True
                    },
                    "overall_score": self._calculate_transport_score(
                        route, adjusted_cost, adjusted_time, urgency, budget_constraint
                    )
                }
                transport_options.append(option)
            
            # Sort by overall score
            transport_options.sort(key=lambda x: x["overall_score"], reverse=True)
            
            return {
                "recommended_transport": transport_options[0] if transport_options else None,
                "alternative_options": transport_options[1:3],
                "transport_comparison": self._create_transport_comparison(transport_options),
                "optimization_factors": {
                    "cost_weight": 0.4,
                    "time_weight": 0.3,
                    "reliability_weight": 0.2,
                    "service_weight": 0.1
                },
                "special_considerations": self._get_transport_considerations(
                    source_country, target_country, quantity
                )
            }
            
        except Exception as e:
            logging.error(f"Error optimizing transport: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_shipping_routes(
        self, source_country: str, target_country: str, urgency: str
    ) -> Dict[str, Any]:
        """Analyze available shipping routes"""
        try:
            routes_analysis = {
                "primary_routes": [],
                "alternative_routes": [],
                "seasonal_considerations": {},
                "route_optimization": {}
            }
            
            # Get primary trade routes
            primary_routes = self._get_primary_trade_routes(source_country, target_country)
            
            for route in primary_routes:
                route_analysis = {
                    "route_name": route.get("name"),
                    "description": route.get("description"),
                    "ports": {
                        "origin": route.get("origin_ports"),
                        "destination": route.get("destination_ports"),
                        "transit": route.get("transit_ports", [])
                    },
                    "advantages": route.get("advantages", []),
                    "challenges": route.get("challenges", []),
                    "capacity": route.get("capacity_info"),
                    "infrastructure": {
                        "port_efficiency": route.get("port_efficiency", {}),
                        "customs_efficiency": route.get("customs_efficiency", {}),
                        "technology_level": route.get("technology_level", "standard")
                    },
                    "seasonal_factors": self._analyze_seasonal_factors(route),
                    "risk_assessment": self._assess_route_risks(route)
                }
                routes_analysis["primary_routes"].append(route_analysis)
            
            # Analyze seasonal considerations
            routes_analysis["seasonal_considerations"] = self._get_seasonal_shipping_analysis(
                source_country, target_country
            )
            
            # Route optimization recommendations
            routes_analysis["route_optimization"] = {
                "recommended_timing": self._get_optimal_shipping_timing(source_country, target_country),
                "consolidation_opportunities": self._get_consolidation_opportunities(),
                "alternative_routing": self._get_alternative_routing_options(source_country, target_country),
                "cost_optimization": self._get_route_cost_optimization_tips()
            }
            
            return routes_analysis
            
        except Exception as e:
            logging.error(f"Error analyzing shipping routes: {str(e)}")
            return {"error": str(e)}
    
    async def _optimize_costs(
        self, product_id: str, source_country: str, target_country: str, quantity: int
    ) -> Dict[str, Any]:
        """Comprehensive cost optimization"""
        try:
            cost_optimization = {
                "cost_breakdown": {},
                "optimization_opportunities": {},
                "savings_strategies": {},
                "cost_benchmarks": {}
            }
            
            # Detailed cost breakdown
            base_costs = self._calculate_base_logistics_costs(
                product_id, source_country, target_country, quantity
            )
            
            cost_optimization["cost_breakdown"] = {
                "packaging_costs": {
                    "materials": base_costs["packaging"]["materials"],
                    "labor": base_costs["packaging"]["labor"],
                    "equipment": base_costs["packaging"]["equipment"],
                    "compliance": base_costs["packaging"]["compliance"],
                    "total": sum(base_costs["packaging"].values())
                },
                "transport_costs": {
                    "pickup": base_costs["transport"]["pickup"],
                    "main_haul": base_costs["transport"]["main_haul"],
                    "delivery": base_costs["transport"]["delivery"],
                    "fuel_surcharge": base_costs["transport"]["fuel_surcharge"],
                    "total": sum(base_costs["transport"].values())
                },
                "handling_costs": {
                    "origin_handling": base_costs["handling"]["origin"],
                    "destination_handling": base_costs["handling"]["destination"],
                    "special_handling": base_costs["handling"]["special"],
                    "total": sum(base_costs["handling"].values())
                },
                "regulatory_costs": {
                    "documentation": base_costs["regulatory"]["documentation"],
                    "inspections": base_costs["regulatory"]["inspections"],
                    "certifications": base_costs["regulatory"]["certifications"],
                    "compliance": base_costs["regulatory"]["compliance"],
                    "total": sum(base_costs["regulatory"].values())
                },
                "insurance_costs": {
                    "cargo_insurance": base_costs["insurance"]["cargo"],
                    "liability_insurance": base_costs["insurance"]["liability"],
                    "total": sum(base_costs["insurance"].values())
                }
            }
            
            # Calculate total costs
            total_cost = sum([
                cost_optimization["cost_breakdown"]["packaging_costs"]["total"],
                cost_optimization["cost_breakdown"]["transport_costs"]["total"],
                cost_optimization["cost_breakdown"]["handling_costs"]["total"],
                cost_optimization["cost_breakdown"]["regulatory_costs"]["total"],
                cost_optimization["cost_breakdown"]["insurance_costs"]["total"]
            ])
            
            cost_optimization["cost_breakdown"]["grand_total"] = total_cost
            cost_optimization["cost_breakdown"]["cost_per_unit"] = total_cost / quantity
            
            # Identify optimization opportunities
            cost_optimization["optimization_opportunities"] = {
                "packaging_optimization": {
                    "potential_savings": total_cost * 0.15,
                    "strategies": [
                        "Bulk packaging for volume orders",
                        "Sustainable packaging alternatives",
                        "Standardized packaging sizes",
                        "Local packaging suppliers"
                    ]
                },
                "transport_optimization": {
                    "potential_savings": total_cost * 0.25,
                    "strategies": [
                        "Consolidated shipments",
                        "Alternative transport modes",
                        "Direct routing",
                        "Volume discounts with carriers"
                    ]
                },
                "timing_optimization": {
                    "potential_savings": total_cost * 0.10,
                    "strategies": [
                        "Off-peak shipping rates",
                        "Seasonal planning",
                        "Advanced booking discounts",
                        "Flexible delivery windows"
                    ]
                }
            }
            
            # Cost saving strategies
            cost_optimization["savings_strategies"] = {
                "immediate_actions": [
                    "Negotiate volume discounts with carriers",
                    "Optimize packaging to reduce dimensional weight",
                    "Consolidate multiple orders",
                    "Use alternative ports if cost-effective"
                ],
                "medium_term_actions": [
                    "Establish preferred carrier relationships",
                    "Invest in packaging optimization",
                    "Develop alternative supply routes",
                    "Implement inventory management"
                ],
                "long_term_actions": [
                    "Establish local distribution centers",
                    "Develop regional supplier networks",
                    "Invest in logistics technology",
                    "Create strategic partnerships"
                ]
            }
            
            # Cost benchmarks
            cost_optimization["cost_benchmarks"] = {
                "industry_average": {
                    "cost_per_kg": total_cost / quantity * 1.15,
                    "your_position": "15% below average"
                },
                "best_in_class": {
                    "cost_per_kg": total_cost / quantity * 0.85,
                    "improvement_potential": "15% savings possible"
                },
                "cost_drivers": [
                    "Distance and route complexity",
                    "Product characteristics and handling",
                    "Regulatory requirements",
                    "Market conditions and capacity"
                ]
            }
            
            return cost_optimization
            
        except Exception as e:
            logging.error(f"Error optimizing costs: {str(e)}")
            return {"error": str(e)}
    
    # Helper methods for logistics optimization
    def _initialize_shipping_routes(self) -> Dict[str, Any]:
        """Initialize shipping routes database"""
        return {
            "IN_US_air": {
                "transport_mode": "air_freight",
                "origin_port": "Delhi (DEL)",
                "destination_port": "New York (JFK)",
                "carriers": ["Air India", "Delta", "Emirates"],
                "transit_time_days": 3,
                "cost_per_kg": 8.5,
                "reliability_score": 0.92,
                "frequency_per_week": 14,
                "weight_limit": 5000,
                "tracking_available": True,
                "insurance_available": True
            },
            "IN_US_sea": {
                "transport_mode": "sea_freight",
                "origin_port": "Mumbai (INMUN)",
                "destination_port": "Los Angeles (USLAX)",
                "carriers": ["Maersk", "MSC", "CMA CGM"],
                "transit_time_days": 18,
                "cost_per_kg": 2.2,
                "reliability_score": 0.88,
                "frequency_per_week": 3,
                "weight_limit": 50000,
                "tracking_available": True,
                "insurance_available": True
            }
        }
    
    def _initialize_packaging_specs(self) -> Dict[str, Any]:
        """Initialize packaging specifications"""
        return {
            "standard": {
                "description": "Standard commercial packaging",
                "materials_required": ["cardboard", "protective_wrap", "labels"],
                "cost_per_unit": 2.5,
                "weight_factor": 1.05,
                "volume_factor": 1.1,
                "protection_level": "basic",
                "regulatory_compliance": ["basic_labeling"],
                "sustainability_score": 0.6
            },
            "temperature_controlled": {
                "description": "Temperature controlled packaging",
                "materials_required": ["insulated_box", "cooling_packs", "temperature_logger"],
                "cost_per_unit": 15.0,
                "weight_factor": 1.3,
                "volume_factor": 1.5,
                "protection_level": "high",
                "regulatory_compliance": ["cold_chain", "temperature_monitoring"],
                "sustainability_score": 0.4
            },
            "pharmaceutical": {
                "description": "Pharmaceutical grade packaging",
                "materials_required": ["tamper_evident", "desiccant", "barrier_protection"],
                "cost_per_unit": 8.0,
                "weight_factor": 1.15,
                "volume_factor": 1.2,
                "protection_level": "pharmaceutical",
                "regulatory_compliance": ["GMP", "FDA_compliant", "tamper_evident"],
                "sustainability_score": 0.5
            }
        }
    
    def _get_product_characteristics(self, product_id: str) -> Dict[str, Any]:
        """Get product characteristics for packaging decisions"""
        characteristics_db = {
            "shilajit": {
                "fragility": "medium",
                "moisture_sensitivity": "high",
                "temperature_sensitivity": "medium",
                "regulatory_category": "health_supplement",
                "special_requirements": ["moisture_protection", "light_protection"]
            },
            "turmeric": {
                "fragility": "low",
                "moisture_sensitivity": "medium",
                "temperature_sensitivity": "low",
                "regulatory_category": "spice",
                "special_requirements": ["color_protection"]
            }
        }
        return characteristics_db.get(product_id, {
            "fragility": "medium",
            "moisture_sensitivity": "medium", 
            "temperature_sensitivity": "medium",
            "regulatory_category": "general",
            "special_requirements": []
        })
    
    def _calculate_transport_score(
        self, route: Dict[str, Any], cost: float, time: float, 
        urgency: str, budget: Optional[float]
    ) -> float:
        """Calculate overall transport option score"""
        # Normalize factors (0-1 scale)
        cost_score = 1.0 - (cost / 10000)  # Assuming max cost of $10k
        time_score = 1.0 - (time / 30)     # Assuming max time of 30 days
        reliability_score = route.get("reliability_score", 0.8)
        
        # Weight factors based on urgency
        if urgency == "urgent":
            weights = {"cost": 0.2, "time": 0.5, "reliability": 0.3}
        elif urgency == "economy":
            weights = {"cost": 0.6, "time": 0.2, "reliability": 0.2}
        else:  # normal
            weights = {"cost": 0.4, "time": 0.3, "reliability": 0.3}
        
        # Calculate weighted score
        score = (
            cost_score * weights["cost"] +
            time_score * weights["time"] +
            reliability_score * weights["reliability"]
        )
        
        return min(1.0, max(0.0, score))
    
    async def _analyze_logistics_risks(
        self, source_country: str, target_country: str, product_id: str
    ) -> Dict[str, Any]:
        """Analyze logistics risks and mitigation strategies"""
        return {
            "risk_categories": {
                "transport_risks": {
                    "delays": {"probability": 0.3, "impact": "medium"},
                    "damage": {"probability": 0.1, "impact": "high"},
                    "loss": {"probability": 0.05, "impact": "high"}
                },
                "regulatory_risks": {
                    "customs_delays": {"probability": 0.2, "impact": "medium"},
                    "documentation_issues": {"probability": 0.15, "impact": "medium"},
                    "compliance_failures": {"probability": 0.1, "impact": "high"}
                },
                "external_risks": {
                    "weather_delays": {"probability": 0.25, "impact": "low"},
                    "port_congestion": {"probability": 0.3, "impact": "medium"},
                    "strikes": {"probability": 0.1, "impact": "high"}
                }
            },
            "mitigation_strategies": {
                "insurance_coverage": "Comprehensive cargo and liability insurance",
                "backup_routes": "Alternative routing options prepared",
                "documentation_verification": "Double-check all documents before shipping",
                "tracking_monitoring": "Real-time tracking and proactive communication",
                "contingency_planning": "Predefined response plans for common issues"
            },
            "overall_risk_level": "medium"
        }
    
    def _calculate_base_logistics_costs(
        self, product_id: str, source_country: str, target_country: str, quantity: int
    ) -> Dict[str, Dict[str, float]]:
        """Calculate detailed base logistics costs"""
        # Simplified cost calculation - in production would use real rates
        base_rate = 5.0  # USD per kg
        
        return {
            "packaging": {
                "materials": quantity * 0.5,
                "labor": quantity * 0.3,
                "equipment": quantity * 0.1,
                "compliance": 200
            },
            "transport": {
                "pickup": 150,
                "main_haul": quantity * base_rate,
                "delivery": 200,
                "fuel_surcharge": quantity * base_rate * 0.15
            },
            "handling": {
                "origin": quantity * 0.2,
                "destination": quantity * 0.3,
                "special": quantity * 0.1
            },
            "regulatory": {
                "documentation": 300,
                "inspections": 150,
                "certifications": 500,
                "compliance": 200
            },
            "insurance": {
                "cargo": quantity * base_rate * 0.02,
                "liability": 100
            }
        }