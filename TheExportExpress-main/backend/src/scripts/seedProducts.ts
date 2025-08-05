import mongoose from 'mongoose';
import { Product } from '../models/Product';

const MONGODB_URI = "mongodb://localhost:27017/exportexpress";

const products = [
  // Spices
  {
    name: 'Kashmiri Saffron',
    category: 'Spices',
    description: 'Premium grade Kashmiri saffron known for its distinct aroma, flavor, and deep red color. Our saffron strands are carefully harvested from the Kashmir Valley.',
    shortDescription: 'Premium grade Kashmiri saffron with distinct aroma and flavor',
    specifications: {
      'Grade': 'Premium',
      'Color': 'Deep Red',
      'Origin': 'Kashmir Valley',
      'Packaging Size': '1g, 5g, 10g',
      'Shelf Life': '24 months'
    },
    images: ['products/kashmiri-saffron.jpg'],
    certifications: ['ISO 22000:2018', 'FSSAI', 'Organic Certified'],
    packagingOptions: ['Premium Glass Bottle', 'Vacuum Sealed Pouch', 'Bulk Packaging'],
    origin: 'Kashmir, India'
  },
  {
    name: 'Small Cardamom',
    category: 'Spices',
    description: 'Premium quality small cardamom (green cardamom) known for its intense aroma and flavor. Perfect for both culinary and medicinal uses.',
    shortDescription: 'Premium quality small green cardamom',
    specifications: {
      'Grade': 'Premium',
      'Color': 'Green',
      'Origin': 'Kerala',
      'Packaging Size': '100g, 250g, 500g',
      'Shelf Life': '18 months'
    },
    images: ['products/small-cardamom.jpg'],
    certifications: ['ISO 22000:2018', 'FSSAI'],
    packagingOptions: ['Vacuum Sealed Pouch', 'Bulk Packaging'],
    origin: 'Kerala, India'
  },
  {
    name: 'Turmeric (High Curcumin)',
    category: 'Spices',
    description: 'High curcumin content turmeric powder known for its medicinal properties and rich golden color. Sourced from the finest turmeric farms.',
    shortDescription: 'High curcumin content premium turmeric powder',
    specifications: {
      'Curcumin Content': '≥ 5%',
      'Color': 'Deep Yellow',
      'Origin': 'Tamil Nadu',
      'Packaging Size': '100g, 250g, 500g, 1kg',
      'Shelf Life': '24 months'
    },
    images: ['products/turmeric.jpg'],
    certifications: ['ISO 22000:2018', 'FSSAI', 'Organic Certified'],
    packagingOptions: ['Stand-up Pouch', 'Bulk Packaging'],
    origin: 'Tamil Nadu, India'
  },
  {
    name: 'Lucknowi Fennel Seeds',
    category: 'Spices',
    description: 'Premium quality fennel seeds from Lucknow, known for their sweet aroma and medicinal properties.',
    shortDescription: 'Premium Lucknowi fennel seeds with sweet aroma',
    specifications: {
      'Grade': 'Premium',
      'Color': 'Greenish-Brown',
      'Origin': 'Lucknow',
      'Packaging Size': '100g, 250g, 500g',
      'Shelf Life': '18 months'
    },
    images: ['products/fennel-seeds.jpg'],
    certifications: ['ISO 22000:2018', 'FSSAI'],
    packagingOptions: ['Vacuum Sealed Pouch', 'Bulk Packaging'],
    origin: 'Lucknow, India'
  },
  {
    name: 'Malabar Black Pepper',
    category: 'Spices',
    description: 'Premium Malabar black pepper known for its strong aroma and pungent taste. Sourced directly from Malabar farms.',
    shortDescription: 'Premium Malabar black pepper with strong aroma',
    specifications: {
      'Grade': 'Premium',
      'Type': 'Black Peppercorns',
      'Origin': 'Malabar Coast',
      'Packaging Size': '100g, 250g, 500g',
      'Shelf Life': '24 months'
    },
    images: ['products/black-pepper.jpg'],
    certifications: ['ISO 22000:2018', 'FSSAI', 'Organic Certified'],
    packagingOptions: ['Vacuum Sealed Pouch', 'Bulk Packaging'],
    origin: 'Malabar Coast, India'
  },

  // Gems
  {
    name: 'Cut and Polished Diamonds',
    category: 'Gems',
    description: 'Exquisitely cut and polished diamonds from India\'s finest diamond cutting centers. Available in various grades and sizes.',
    shortDescription: 'Premium cut and polished diamonds',
    specifications: {
      'Cut': 'Excellent',
      'Clarity': 'VS and above',
      'Color': 'D-F',
      'Sizes': '0.5 to 5 carats',
      'Certification': 'GIA Certified'
    },
    images: ['products/diamonds.jpg'],
    certifications: ['GIA', 'IGI', 'Kimberley Process'],
    packagingOptions: ['Secure Box', 'Certificate Holder'],
    origin: 'Surat, India'
  },
  {
    name: 'Karnataka Rubies',
    category: 'Gems',
    description: 'Natural rubies from Karnataka mines, known for their deep red color and clarity. Available in various sizes and grades.',
    shortDescription: 'Natural Karnataka rubies with deep red color',
    specifications: {
      'Color': 'Deep Red',
      'Clarity': 'VS',
      'Cut': 'Mixed',
      'Sizes': '0.5 to 3 carats',
      'Treatment': 'None'
    },
    images: ['products/rubies.jpg'],
    certifications: ['GGL', 'IGI'],
    packagingOptions: ['Secure Box', 'Certificate Holder'],
    origin: 'Karnataka, India'
  },
  {
    name: 'Kashmir Blue Sapphires',
    category: 'Gems',
    description: 'Rare and precious Kashmir blue sapphires, known for their exceptional cornflower blue color and velvety appearance.',
    shortDescription: 'Rare Kashmir blue sapphires',
    specifications: {
      'Color': 'Cornflower Blue',
      'Origin': 'Kashmir',
      'Clarity': 'VS-SI',
      'Sizes': '0.5 to 2 carats',
      'Treatment': 'None'
    },
    images: ['products/blue-sapphires.jpg'],
    certifications: ['GGTL', 'IGI'],
    packagingOptions: ['Secure Box', 'Certificate Holder'],
    origin: 'Kashmir, India'
  },
  {
    name: 'Rajasthan Emeralds',
    category: 'Gems',
    description: 'Natural emeralds from Rajasthan mines, known for their rich green color and exceptional quality.',
    shortDescription: 'Natural Rajasthan emeralds',
    specifications: {
      'Color': 'Rich Green',
      'Clarity': 'VS-SI',
      'Cut': 'Mixed',
      'Sizes': '0.5 to 3 carats',
      'Treatment': 'Minor'
    },
    images: ['products/emeralds.jpg'],
    certifications: ['GRS', 'IGI'],
    packagingOptions: ['Secure Box', 'Certificate Holder'],
    origin: 'Rajasthan, India'
  },
  {
    name: 'Hyderabad Pearl Jewelry',
    category: 'Gems',
    description: 'Exquisite pearl jewelry from Hyderabad, featuring natural and cultured pearls in various designs.',
    shortDescription: 'Premium Hyderabad pearl jewelry',
    specifications: {
      'Pearl Type': 'Natural and Cultured',
      'Size Range': '6-12mm',
      'Color': 'White to Cream',
      'Quality': 'AAA',
      'Settings': 'Gold and Silver'
    },
    images: ['products/pearl-jewelry.jpg'],
    certifications: ['IGI', 'BIS Hallmark'],
    packagingOptions: ['Jewelry Box', 'Certificate Holder'],
    origin: 'Hyderabad, India'
  },

  // Agriculture
  {
    name: 'Organic Basmati Rice',
    category: 'Agriculture',
    description: 'Premium organic basmati rice known for its long grains, distinctive aroma, and superior taste.',
    shortDescription: 'Premium organic basmati rice',
    specifications: {
      'Type': 'Organic Basmati',
      'Grain Length': 'Extra Long',
      'Age': 'Aged 2 years',
      'Packaging Size': '1kg, 5kg, 25kg',
      'Certification': 'Organic Certified'
    },
    images: ['products/basmati-rice.jpg'],
    certifications: ['Organic', 'FSSAI', 'ISO 22000:2018'],
    packagingOptions: ['Vacuum Sealed', 'Jute Bags', 'PP Bags'],
    origin: 'Punjab, India'
  },
  {
    name: 'Kesar Mangoes',
    category: 'Agriculture',
    description: 'Premium Kesar mangoes known for their sweet taste and unique flavor. Sourced from Gujarat\'s finest orchards.',
    shortDescription: 'Sweet and flavorful Kesar mangoes',
    specifications: {
      'Variety': 'Kesar',
      'Grade': 'Export Quality',
      'Size': 'Medium to Large',
      'Packaging': '4kg, 10kg boxes',
      'Season': 'May-June'
    },
    images: ['products/kesar-mangoes.jpg'],
    certifications: ['GlobalGAP', 'FSSAI'],
    packagingOptions: ['Cardboard Box', 'Wooden Box'],
    origin: 'Gujarat, India'
  },
  {
    name: 'Darjeeling Organic Tea',
    category: 'Agriculture',
    description: 'Premium organic Darjeeling tea, known as the "Champagne of Teas" with its distinctive muscatel flavor.',
    shortDescription: 'Premium organic Darjeeling tea',
    specifications: {
      'Grade': 'FTGFOP1',
      'Type': 'Black Tea',
      'Flush': 'First Flush',
      'Packaging Size': '100g, 250g, 1kg',
      'Certification': 'Organic Certified'
    },
    images: ['products/darjeeling-tea.jpg'],
    certifications: ['Organic', 'FSSAI', 'Tea Board of India'],
    packagingOptions: ['Aluminum Foil Pouch', 'Wooden Box', 'Bulk'],
    origin: 'Darjeeling, India'
  },
  {
    name: 'Alphonso Mangoes',
    category: 'Agriculture',
    description: 'Premium Alphonso mangoes from Ratnagiri, known for their rich taste, sweet aroma, and smooth texture.',
    shortDescription: 'Premium Ratnagiri Alphonso mangoes',
    specifications: {
      'Variety': 'Alphonso',
      'Grade': 'Export Quality',
      'Size': 'Medium to Large',
      'Packaging': '4kg, 10kg boxes',
      'Season': 'April-May'
    },
    images: ['products/alphonso-mangoes.jpg'],
    certifications: ['GlobalGAP', 'FSSAI'],
    packagingOptions: ['Cardboard Box', 'Wooden Box'],
    origin: 'Ratnagiri, Maharashtra, India'
  },
  {
    name: 'Indian Cashew Nuts',
    category: 'Agriculture',
    description: 'High-quality Indian cashew nuts known for their creamy taste and nutritional benefits.',
    shortDescription: 'High-quality Indian cashew nuts',
    specifications: {
      'Grade': 'W240',
      'Type': 'Whole',
      'Origin': 'Kerala',
      'Packaging Size': '250g, 500g, 1kg',
      'Shelf Life': '12 months'
    },
    images: ['products/cashew-nuts.jpg'],
    certifications: ['FSSAI', 'ISO 22000:2018'],
    packagingOptions: ['Vacuum Sealed Pouch', 'Bulk Packaging'],
    origin: 'Kerala, India'
  },
  // Ayurvedic Products
  {
    name: 'Ashwagandha Root Powder',
    category: 'Ayurvedic Products',
    description: 'Organic Ashwagandha root powder known for its adaptogenic properties and numerous health benefits.',
    shortDescription: 'Organic Ashwagandha root powder',
    specifications: {
      'Form': 'Powder',
      'Origin': 'Rajasthan',
      'Packaging Size': '100g, 250g, 500g',
      'Certification': 'Organic Certified'
    },
    images: ['products/ashwagandha-powder.jpg'],
    certifications: ['Organic', 'FSSAI'],
    packagingOptions: ['Stand-up Pouch', 'Bulk Packaging'],
    origin: 'Rajasthan, India'
  },
  {
    name: 'Herbal Triphala Powder',
    category: 'Ayurvedic Products',
    description: 'A blend of three fruits, Triphala is a traditional Ayurvedic formula for detoxification and rejuvenation.',
    shortDescription: 'Traditional Ayurvedic Triphala powder',
    specifications: {
      'Form': 'Powder',
      'Ingredients': 'Amla, Bibhitaki, Haritaki',
      'Packaging Size': '100g, 250g, 500g',
      'Certification': 'Organic Certified'
    },
    images: ['products/triphala-powder.jpg'],
    certifications: ['Organic', 'FSSAI'],
    packagingOptions: ['Stand-up Pouch', 'Bulk Packaging'],
    origin: 'India'
  },
  {
    name: 'Brahmi (Bacopa Monnieri) Extract',
    category: 'Ayurvedic Products',
    description: 'High-quality Brahmi extract known for its cognitive-enhancing properties and use in traditional medicine.',
    shortDescription: 'High-quality Brahmi extract',
    specifications: {
      'Form': 'Capsules',
      'Strength': '500mg',
      'Count': '60 Capsules',
      'Certification': 'GMP Certified'
    },
    images: ['products/brahmi-extract.jpg'],
    certifications: ['GMP', 'FSSAI'],
    packagingOptions: ['HDPE Bottle', 'Blister Pack'],
    origin: 'India'
  },
  {
    name: 'Neem Oil',
    category: 'Ayurvedic Products',
    description: 'Cold-pressed neem oil known for its powerful medicinal properties, including antibacterial and antifungal effects.',
    shortDescription: 'Cold-pressed neem oil',
    specifications: {
      'Form': 'Oil',
      'Extraction': 'Cold-Pressed',
      'Packaging Size': '100ml, 250ml, 500ml',
      'Certification': 'Organic Certified'
    },
    images: ['products/neem-oil.jpg'],
    certifications: ['Organic', 'FSSAI'],
    packagingOptions: ['Glass Bottle', 'PET Bottle'],
    origin: 'India'
  },
  {
    name: 'Organic Turmeric Capsules',
    category: 'Ayurvedic Products',
    description: 'High-potency organic turmeric capsules with black pepper extract for enhanced absorption.',
    shortDescription: 'High-potency organic turmeric capsules',
    specifications: {
      'Form': 'Capsules',
      'Strength': '750mg',
      'Count': '90 Capsules',
      'Contains': 'Black Pepper Extract'
    },
    images: ['products/turmeric-capsules.jpg'],
    certifications: ['Organic', 'GMP', 'FSSAI'],
    packagingOptions: ['HDPE Bottle', 'Blister Pack'],
    origin: 'India'
  },
  // Textiles
  {
    name: 'Jaipuri Block Print Cotton Fabric',
    category: 'Textiles',
    description: 'High-quality cotton fabric with traditional Jaipuri block prints, perfect for apparel and home decor.',
    shortDescription: 'High-quality cotton fabric with Jaipuri block prints',
    specifications: {
      'Material': '100% Cotton',
      'Print': 'Hand Block Print',
      'Width': '44 inches',
      'Origin': 'Jaipur'
    },
    images: ['products/jaipuri-fabric.jpg'],
    certifications: ['Handloom Mark'],
    packagingOptions: ['Rolls', 'Cut-to-size'],
    origin: 'Jaipur, India'
  },
  {
    name: 'Handwoven Pashmina Shawls',
    category: 'Textiles',
    description: 'Exquisite handwoven Pashmina shawls from Kashmir, known for their softness, warmth, and intricate designs.',
    shortDescription: 'Exquisite handwoven Pashmina shawls',
    specifications: {
      'Material': '100% Pashmina',
      'Weave': 'Hand Woven',
      'Size': '2m x 1m',
      'Origin': 'Kashmir'
    },
    images: ['products/pashmina-shawl.jpg'],
    certifications: ['Handloom Mark', 'Woolmark'],
    packagingOptions: ['Gift Box', 'Standard Package'],
    origin: 'Kashmir, India'
  },
  {
    name: 'Kanjeevaram Silk Sarees',
    category: 'Textiles',
    description: 'Traditional Kanjeevaram silk sarees from Tamil Nadu, known for their vibrant colors and rich silk fabric.',
    shortDescription: 'Traditional Kanjeevaram silk sarees',
    specifications: {
      'Material': 'Pure Silk',
      'Zari': 'Pure Gold Zari',
      'Length': '6.25 meters',
      'Origin': 'Kanchipuram'
    },
    images: ['products/kanjeevaram-saree.jpg'],
    certifications: ['Silk Mark', 'Handloom Mark'],
    packagingOptions: ['Saree Box', 'Gift Wrapping'],
    origin: 'Kanchipuram, India'
  },
  {
    name: 'Organic Cotton Towels',
    category: 'Textiles',
    description: 'Soft and absorbent organic cotton towels available in various sizes and colors.',
    shortDescription: 'Soft and absorbent organic cotton towels',
    specifications: {
      'Material': '100% Organic Cotton',
      'GSM': '600',
      'Sizes': 'Bath, Hand, Face',
      'Certification': 'GOTS Certified'
    },
    images: ['products/organic-towels.jpg'],
    certifications: ['GOTS', 'Fair Trade'],
    packagingOptions: ['Set of 3', 'Individual Pieces'],
    origin: 'Tamil Nadu, India'
  },
  {
    name: 'Embroidered Cushion Covers',
    category: 'Textiles',
    description: 'Hand-embroidered cushion covers with intricate designs, perfect for adding a touch of elegance to any space.',
    shortDescription: 'Hand-embroidered cushion covers',
    specifications: {
      'Material': 'Cotton/Silk Blend',
      'Embroidery': 'Hand-embroidered',
      'Size': '16x16 inches',
      'Closure': 'Zipper'
    },
    images: ['products/cushion-covers.jpg'],
    certifications: ['Craft Mark'],
    packagingOptions: ['Set of 2', 'Individual'],
    origin: 'Rajasthan, India'
  },
  // Handicrafts
  {
    name: 'Rajasthan Wooden Handicrafts',
    category: 'Handicrafts',
    description: 'Beautifully carved wooden handicrafts from Rajasthan, including figurines, boxes, and decorative items.',
    shortDescription: 'Beautifully carved wooden handicrafts',
    specifications: {
      'Material': 'Sheesham Wood',
      'Art': 'Hand Carved',
      'Origin': 'Rajasthan'
    },
    images: ['products/wooden-handicrafts.jpg'],
    certifications: ['Craft Mark'],
    packagingOptions: ['Bubble Wrap', 'Cardboard Box'],
    origin: 'Rajasthan, India'
  },
  {
    name: 'Jaipur Blue Pottery',
    category: 'Handicrafts',
    description: 'Traditional blue pottery from Jaipur, known for its vibrant colors and intricate designs.',
    shortDescription: 'Traditional blue pottery from Jaipur',
    specifications: {
      'Material': 'Quartz Powder',
      'Art': 'Hand Painted',
      'Origin': 'Jaipur'
    },
    images: ['products/blue-pottery.jpg'],
    certifications: ['Craft Mark'],
    packagingOptions: ['Foam Packaging', 'Export Box'],
    origin: 'Jaipur, India'
  },
  {
    name: 'Bidriware Metal Handicrafts',
    category: 'Handicrafts',
    description: 'Exquisite Bidriware metal handicrafts from Karnataka, featuring intricate silver inlay work on a zinc-copper alloy.',
    shortDescription: 'Exquisite Bidriware metal handicrafts',
    specifications: {
      'Material': 'Zinc-Copper Alloy',
      'Inlay': 'Pure Silver',
      'Origin': 'Bidar'
    },
    images: ['products/bidriware.jpg'],
    certifications: ['Craft Mark'],
    packagingOptions: ['Velvet Box', 'Export Packaging'],
    origin: 'Bidar, Karnataka, India'
  },
  {
    name: 'Marble Inlay Table Tops',
    category: 'Handicrafts',
    description: 'Elegant marble inlay table tops with semi-precious stones, inspired by the art of the Taj Mahal.',
    shortDescription: 'Elegant marble inlay table tops',
    specifications: {
      'Material': 'White Marble',
      'Inlay': 'Semi-precious Stones',
      'Origin': 'Agra'
    },
    images: ['products/marble-inlay.jpg'],
    certifications: ['Craft Mark'],
    packagingOptions: ['Wooden Crate', 'Foam Padding'],
    origin: 'Agra, India'
  },
  {
    name: 'Handmade Paper Products',
    category: 'Handicrafts',
    description: 'Eco-friendly handmade paper products including journals, bags, and stationery.',
    shortDescription: 'Eco-friendly handmade paper products',
    specifications: {
      'Material': 'Recycled Cotton Rag',
      'Type': 'Journals, Bags, Stationery',
      'Origin': 'Sanganer'
    },
    images: ['products/handmade-paper.jpg'],
    certifications: ['Eco-friendly Mark'],
    packagingOptions: ['Custom Packaging'],
    origin: 'Sanganer, India'
  },
  // Jewelry
  {
    name: 'Kundan Meena Jewelry Set',
    category: 'Jewelry',
    description: 'Traditional Kundan Meena jewelry set with intricate designs, perfect for weddings and special occasions.',
    shortDescription: 'Traditional Kundan Meena jewelry set',
    specifications: {
      'Material': 'Gold Plated Silver',
      'Stones': 'Kundan, Meenakari',
      'Origin': 'Jaipur'
    },
    images: ['products/kundan-meena.jpg'],
    certifications: ['BIS Hallmark'],
    packagingOptions: ['Jewelry Box', 'Velvet Pouch'],
    origin: 'Jaipur, India'
  },
  {
    name: 'Temple Jewelry Collection',
    category: 'Jewelry',
    description: 'Exquisite temple jewelry inspired by ancient temple architecture and deities, crafted in gold-plated silver.',
    shortDescription: 'Exquisite temple jewelry collection',
    specifications: {
      'Material': 'Gold Plated Silver',
      'Style': 'Temple Jewelry',
      'Origin': 'Tamil Nadu'
    },
    images: ['products/temple-jewelry.jpg'],
    certifications: ['BIS Hallmark'],
    packagingOptions: ['Jewelry Box', 'Secure Packaging'],
    origin: 'Tamil Nadu, India'
  },
  {
    name: 'Silver Filigree Jewelry',
    category: 'Jewelry',
    description: 'Delicate silver filigree jewelry from Orissa, known for its intricate and artistic designs.',
    shortDescription: 'Delicate silver filigree jewelry',
    specifications: {
      'Material': 'Sterling Silver',
      'Art': 'Filigree Work',
      'Origin': 'Cuttack'
    },
    images: ['products/silver-filigree.jpg'],
    certifications: ['BIS Hallmark'],
    packagingOptions: ['Jewelry Box', 'Gift Pouch'],
    origin: 'Cuttack, Orissa, India'
  },
  {
    name: 'Tribal Beaded Jewelry',
    category: 'Jewelry',
    description: 'Handmade tribal beaded jewelry from Nagaland, featuring vibrant colors and unique patterns.',
    shortDescription: 'Handmade tribal beaded jewelry',
    specifications: {
      'Material': 'Glass Beads, Natural Fibers',
      'Style': 'Tribal Jewelry',
      'Origin': 'Nagaland'
    },
    images: ['products/tribal-jewelry.jpg'],
    certifications: ['Craft Mark'],
    packagingOptions: ['Eco-friendly Pouch', 'Gift Box'],
    origin: 'Nagaland, India'
  },
  {
    name: 'Polki Diamond Necklace',
    category: 'Jewelry',
    description: 'Stunning Polki diamond necklace with uncut diamonds and traditional Indian craftsmanship.',
    shortDescription: 'Stunning Polki diamond necklace',
    specifications: {
      'Material': 'Gold',
      'Stones': 'Uncut Diamonds (Polki)',
      'Origin': 'Rajasthan'
    },
    images: ['products/polki-necklace.jpg'],
    certifications: ['BIS Hallmark'],
    packagingOptions: ['Luxury Jewelry Box'],
    origin: 'Rajasthan, India'
  },
  // Leather
  {
    name: 'Finished Leather for Shoes',
    category: 'Leather',
    description: 'High-quality finished leather for manufacturing shoes, available in various colors and finishes.',
    shortDescription: 'High-quality finished leather for shoes',
    specifications: {
      'Type': 'Cowhide, Goatskin',
      'Finish': 'Aniline, Semi-aniline',
      'Thickness': '1.2mm - 1.6mm',
      'Origin': 'Kanpur'
    },
    images: ['products/finished-leather.jpg'],
    certifications: ['ISO 9001:2015'],
    packagingOptions: ['Rolls', 'Custom Cuts'],
    origin: 'Kanpur, India'
  },
  {
    name: 'Leather Handbags',
    category: 'Leather',
    description: 'Stylish and durable leather handbags for women, available in various designs and colors.',
    shortDescription: 'Stylish and durable leather handbags',
    specifications: {
      'Material': 'Genuine Leather',
      'Lining': 'Fabric',
      'Compartments': 'Multiple',
      'Origin': 'Kolkata'
    },
    images: ['products/leather-handbags.jpg'],
    certifications: ['ISO 9001:2015'],
    packagingOptions: ['Dust Bag', 'Gift Box'],
    origin: 'Kolkata, India'
  },
  {
    name: 'Men\'s Leather Wallets',
    category: 'Leather',
    description: 'Genuine leather wallets for men, featuring multiple compartments and a sleek design.',
    shortDescription: 'Genuine leather wallets for men',
    specifications: {
      'Material': 'Genuine Leather',
      'Features': 'RFID Blocking',
      'Compartments': 'Card Slots, Bill Compartment',
      'Origin': 'Chennai'
    },
    images: ['products/leather-wallets.jpg'],
    certifications: ['ISO 9001:2015'],
    packagingOptions: ['Gift Box', 'Standard Packaging'],
    origin: 'Chennai, India'
  },
  {
    name: 'Leather Belts',
    category: 'Leather',
    description: 'High-quality leather belts for men and women, available in various styles and sizes.',
    shortDescription: 'High-quality leather belts',
    specifications: {
      'Material': 'Genuine Leather',
      'Buckle': 'Stainless Steel',
      'Width': '1.5 inches',
      'Origin': 'Agra'
    },
    images: ['products/leather-belts.jpg'],
    certifications: ['ISO 9001:2015'],
    packagingOptions: ['Individual Box', 'Bulk Packaging'],
    origin: 'Agra, India'
  },
  {
    name: 'Leather Jackets',
    category: 'Leather',
    description: 'Classic leather jackets for men and women, made from genuine leather and available in various styles.',
    shortDescription: 'Classic leather jackets',
    specifications: {
      'Material': 'Genuine Sheepskin Leather',
      'Lining': 'Polyester',
      'Style': 'Biker, Bomber',
      'Origin': 'Delhi'
    },
    images: ['products/leather-jackets.jpg'],
    certifications: ['ISO 9001:2015'],
    packagingOptions: ['Jacket Cover', 'Secure Box'],
    origin: 'Delhi, India'
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding products.');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    await Product.insertMany(products);
    console.log(`${products.length} products have been seeded.`);

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

seedProducts(); 