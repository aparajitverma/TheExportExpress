import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { UserRole } from './types/user';

dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/TheExportExpress';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    let adminUser = await User.findOne({
      role: { $in: [UserRole.SUPER_ADMIN, UserRole.ADMIN] }
    });

    if (!adminUser) {
      console.log('No admin user found. Attempting to create a dummy admin...');
      const existingAdminByEmail = await User.findOne({ email: 'superadmin_seed@example.com' });
      if (existingAdminByEmail) {
        adminUser = existingAdminByEmail;
        console.log('Found existing dummy admin user.');
      } else {
        try {
          adminUser = await User.create({
            name: 'Super Admin (Seed)',
            email: 'superadmin_seed@example.com',
            password: 'SeedPassword123!',
            role: UserRole.SUPER_ADMIN,
            isActive: true,
          });
          console.log('Dummy admin user created successfully.');
        } catch (userError: any) {
          console.error('Could not create dummy admin user:', userError.message);
          console.error('Please ensure an admin user exists or user model requirements are met.');
          await mongoose.disconnect();
          return;
        }
      }
    }

    if (!adminUser) {
      console.error('Critical: Admin user is still not available. Aborting seed.');
      await mongoose.disconnect();
      return;
    }
    const adminUserId = adminUser._id;
    console.log(`Using Admin User ID: ${adminUserId} for createdBy fields.`);

    // Optional: Clean up existing data (BE VERY CAREFUL WITH THIS IN PRODUCTION)
    // console.log('Clearing existing Products and Categories (if uncommented in script)...');
    // await Product.deleteMany({}); // Deletes ALL products
    // await Category.deleteMany({}); // Deletes ALL categories

    const categoriesData = [
      { name: 'Spices', description: 'Authentic Indian spices known for their rich aroma and flavor.', createdBy: adminUserId },
      { name: 'Gems', description: 'Exquisite and certified gemstones from various regions of India.', createdBy: adminUserId },
      { name: 'Agriculture', description: 'High-quality agricultural produce, including organic and specialty items.', createdBy: adminUserId },
      { name: 'Ayurvedic Products', description: 'Traditional Ayurvedic formulations and wellness products.', createdBy: adminUserId },
    ];

    console.log('Seeding Categories...');
    // Simple slug generation for seeding
    const createdCategories = await Category.insertMany(
      categoriesData.map(cat => ({ 
        ...cat, 
        slug: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
      }))
    );
    console.log(`${createdCategories.length} categories seeded successfully.`);
    const categoryMap = new Map(createdCategories.map(cat => [cat.name, cat._id]));

    const productsData = [
      // Spices
      {
        name: 'Kashmiri Saffron',
        description: 'Handpicked, 100% pure Mongra Kesar from the fields of Kashmir, known for its deep red color, strong aroma, and rich flavor. Ideal for culinary and medicinal uses.',
        shortDescription: 'Premium Mongra Kashmiri Saffron threads.',
        category: categoryMap.get('Spices'),
        origin: 'Pampore, Kashmir',
        specifications: { Grade: "A++ (Mongra)", Color: "Deep Crimson", Form: "Threads" },
        certifications: ["GI Tagged Kashmir Saffron", "FSSAI Approved"],
        packagingOptions: ["1g Acrylic Box", "5g Tamper-Proof Jar"],
        images: ['products/placeholder_saffron1.jpg', 'products/placeholder_saffron2.jpg'],
      },
      {
        name: 'Small Cardamom (Choti Elaichi)',
        description: 'Flavorful and aromatic Small Green Cardamom (Choti Elaichi), 8mm bold grade, sourced from the Western Ghats. Perfect for teas, desserts, and savory dishes.',
        shortDescription: 'Aromatic green cardamom pods (8mm bold).',
        category: categoryMap.get('Spices'),
        origin: 'Idukki, Kerala',
        specifications: { Variety: "Green Cardamom (Elettaria cardamomum)", Grade: "8mm Bold", Aroma: "Strong, Sweet" },
        certifications: ["Spice Board Certified", "Agmark"],
        packagingOptions: ["50g Pouch", "250g Box", "1kg Bulk Pack"],
        images: ['products/placeholder_cardamom1.jpg', 'products/placeholder_cardamom2.jpg'],
      },
      {
        name: 'Turmeric (High Curcumin)',
        description: 'Premium Lakadong Turmeric powder, renowned for its exceptionally high curcumin content (7-9%). Offers vibrant color and potent health benefits.',
        shortDescription: 'Lakadong Turmeric powder with high curcumin.',
        category: categoryMap.get('Spices'),
        origin: 'Lakadong, Meghalaya',
        specifications: { Variety: "Lakadong", "Curcumin Content": "7-9%", Form: "Powder" },
        certifications: ["Organic Certified", "FSSAI Approved"],
        packagingOptions: ["200g Jar", "500g Pouch", "Bulk Orders"],
        images: ['products/placeholder_lakadong_turmeric1.jpg', 'products/placeholder_lakadong_turmeric2.jpg'],
      },
      {
        name: 'Lucknowi Fennel Seeds',
        description: 'Lucknowi Fennel Seeds (Saunf), known for their distinctively sweet flavor and aroma. Commonly used as a mouth freshener and in culinary preparations.',
        shortDescription: 'Sweet and aromatic Lucknowi fennel seeds.',
        category: categoryMap.get('Spices'),
        origin: 'Lucknow, Uttar Pradesh',
        specifications: { Type: "Lucknowi Fennel", Flavor: "Sweet", Size: "Medium" },
        certifications: ["FSSAI Approved"],
        packagingOptions: ["100g Pouch", "500g Jar"],
        images: ['products/placeholder_fennel1.jpg', 'products/placeholder_fennel2.jpg'],
      },
      {
        name: 'Malabar Black Pepper',
        description: 'Whole Malabar Black Peppercorns, TGSEB (Tellicherry Garbled Special Extra Bold) grade, known for their strong pungent flavor and aroma.',
        shortDescription: 'Bold Malabar black peppercorns.',
        category: categoryMap.get('Spices'),
        origin: 'Malabar Coast, Kerala',
        specifications: { Variety: "Malabar Black Pepper", Grade: "TGSEB", Flavor: "Pungent, Hot" },
        certifications: ["Spice Board Certified", "Fair Trade"],
        packagingOptions: ["100g Grinder Bottle", "500g Pouch", "1kg Bag"],
        images: ['products/placeholder_pepper1.jpg', 'products/placeholder_pepper2.jpg'],
      },
      // Gems
      {
        name: 'Cut and Polished Diamonds',
        description: 'High-quality, ethically sourced, cut and polished diamonds. Various sizes and grades available, GIA/IGI certified.',
        shortDescription: 'Certified loose brilliant-cut diamonds.',
        category: categoryMap.get('Gems'),
        origin: 'Surat, Gujarat',
        specifications: { Cut: "Brilliant Round", Clarity: "VVS1-SI2", Color: "D-J", Carat: "0.10 - 5.00 ct" },
        certifications: ["GIA Certified", "IGI Certified", "Kimberley Process Compliant"],
        packagingOptions: ["Secure Gemstone Box", "Sealed Tamper-Proof Packets"],
        images: ['products/placeholder_diamond1.jpg', 'products/placeholder_diamond2.jpg'],
      },
      {
        name: 'Karnataka Rubies',
        description: 'Vibrant red natural rubies sourced from Karnataka, known for their color and clarity. Available as faceted stones and cabochons.',
        shortDescription: 'Natural unheated Karnataka rubies.',
        category: categoryMap.get('Gems'),
        origin: 'Channapatna, Karnataka',
        specifications: { Type: "Natural Ruby", Color: "Pinkish-Red to Deep Red", Treatment: "Unheated (Optional: Heated)" },
        certifications: ["Authenticity Certificate by Local Gem Lab"],
        packagingOptions: ["Individual Gem Pouches", "Display Boxes"],
        images: ['products/placeholder_ruby1.jpg', 'products/placeholder_ruby2.jpg'],
      },
      {
        name: 'Kashmir Blue Sapphires',
        description: 'Exceedingly rare and valuable Kashmir Blue Sapphires, famed for their velvety cornflower blue hue. Investment-grade gemstones.',
        shortDescription: 'Rare velvety blue Kashmir sapphires.',
        category: categoryMap.get('Gems'),
        origin: 'Kashmir Valley (Historically)',
        specifications: { Type: "Natural Blue Sapphire", Color: "Velvety Cornflower Blue", Clarity: "Eye-Clean to Minor Inclusions" },
        certifications: ["GRS Certified", "SSEF Certified (for high value stones)"],
        packagingOptions: ["High-Security Gem Case", "Insured Shipping"],
        images: ['products/placeholder_sapphire1.jpg', 'products/placeholder_sapphire2.jpg'],
      },
      {
        name: 'Rajasthan Emeralds',
        description: 'Beautiful green emeralds sourced from Rajasthan, often comparable to Panjshir or Swat Valley emeralds in quality. Minor oil treatment is common.',
        shortDescription: 'Vivid green Panjshir/Swat type emeralds from Rajasthan.',
        category: categoryMap.get('Gems'),
        origin: 'Ajmer, Rajasthan',
        specifications: { Type: "Natural Emerald", Color: "Vivid Green", Treatment: "Minor Cedarwood Oil" },
        certifications: ["Authenticity Certificate"],
        packagingOptions: ["Gemstone Parcels", "Individual Stone Boxes"],
        images: ['products/placeholder_emerald1.jpg', 'products/placeholder_emerald2.jpg'],
      },
      {
        name: 'Hyderabad Pearl Jewelry',
        description: 'Elegant pearl jewelry handcrafted in Hyderabad, featuring high-quality freshwater or cultured pearls, sometimes Basra-like in appearance. Necklaces, earrings, and sets.',
        shortDescription: 'Exquisite Basra-like pearl necklaces from Hyderabad.',
        category: categoryMap.get('Gems'),
        origin: 'Hyderabad, Telangana',
        specifications: { PearlType: "Freshwater/Cultured", Setting: "Gold/Silver", Item: "Necklaces, Earrings, Sets" },
        certifications: ["Certificate of Authenticity for Pearls"],
        packagingOptions: ["Velvet Jewelry Box", "Gift Packaging"],
        images: ['products/placeholder_pearl_jewelry1.jpg', 'products/placeholder_pearl_jewelry2.jpg'],
      },
      // Agriculture
      {
        name: 'Organic Basmati Rice',
        description: 'Premium quality organic Basmati rice, 1121 Steam variety, aged for perfection. Known for its extra-long grains, distinct aroma, and fluffy texture.',
        shortDescription: 'Aged organic 1121 Steam Basmati rice.',
        category: categoryMap.get('Agriculture'),
        origin: 'Punjab, India',
        specifications: { "Grain Length": "Avg 8.35mm", Aging: "Min 18 Months", Type: "1121 Steam Basmati" },
        certifications: ["USDA Organic", "India Organic", "Non-GMO"],
        packagingOptions: ["1kg Non-woven Bag", "5kg Jute Bag", "Bulk"],
        images: ['products/placeholder_basmati1.jpg', 'products/placeholder_basmati2.jpg'],
      },
      {
        name: 'Kesar Mangoes',
        description: 'Deliciously sweet and aromatic Kesar mangoes from the Gir region of Gujarat, also known as the \'Queen of Mangoes\'. Distinct saffron-hued pulp.',
        shortDescription: 'Sweet Gir Kesar mangoes (Queen of Mangoes).',
        category: categoryMap.get('Agriculture'),
        origin: 'Gir, Gujarat',
        specifications: { Variety: "Kesar", Taste: "Sweet, Aromatic", Size: "Medium" },
        certifications: ["GI Tagged Gir Kesar Mango", "APEDA Certified Packhouse"],
        packagingOptions: ["Corrugated Box (1 dozen, 2 dozen)", "Export Quality Packaging"],
        images: ['products/placeholder_kesar_mango1.jpg', 'products/placeholder_kesar_mango2.jpg'],
      },
      {
        name: 'Darjeeling Organic Tea',
        description: 'Exquisite organic Darjeeling tea, FTGFOP1 (Finest Tippy Golden Flowery Orange Pekoe 1) grade, from high-altitude estates. Muscatel flavor.',
        shortDescription: 'Premium FTGFOP1 Darjeeling black tea.',
        category: categoryMap.get('Agriculture'),
        origin: 'Darjeeling, West Bengal',
        specifications: { Type: "Black Tea", Grade: "FTGFOP1", Flush: "Second Flush (typical)" },
        certifications: ["India Organic", "Fair Trade Certified", "Tea Board of India Certified"],
        packagingOptions: ["100g Tea Caddy", "250g Pouch", "Bulk Tea Chests"],
        images: ['products/placeholder_darjeeling_tea1.jpg', 'products/placeholder_darjeeling_tea2.jpg'],
      },
      {
        name: 'Alphonso Mangoes',
        description: 'World-renowned Alphonso mangoes from Ratnagiri, Maharashtra, celebrated for their rich flavor, creamy texture, and saffron color. The \'King of Mangoes\'.',
        shortDescription: 'Ratnagiri Alphonso mangoes (King of Mangoes).',
        category: categoryMap.get('Agriculture'),
        origin: 'Ratnagiri, Maharashtra',
        specifications: { Variety: "Alphonso (Hapus)", Taste: "Rich, Sweet, Non-fibrous", Size: "Medium to Large" },
        certifications: ["GI Tagged Ratnagiri Alphonso", "GlobalG.A.P."],
        packagingOptions: ["Cardboard Boxes (Net Wt. 3kg, 5kg)", "Customized Gift Packs"],
        images: ['products/placeholder_alphonso_mango1.jpg', 'products/placeholder_alphonso_mango2.jpg'],
      },
      {
        name: 'Organic Cashews',
        description: 'Whole white organic cashew nuts, W240 grade, sourced from Goa/Kerala. Creamy, crunchy, and nutritious.',
        shortDescription: 'W240 grade organic cashew nuts.',
        category: categoryMap.get('Agriculture'),
        origin: 'Goa / Kerala',
        specifications: { Grade: "W240 (White Wholes)", Processing: "Steam Roasted", Type: "Organic" },
        certifications: ["India Organic", "USDA Organic", "BRC Certified"],
        packagingOptions: ["250g Vacuum Pouch", "500g Tin", "10kg Bulk Tin"],
        images: ['products/placeholder_cashew1.jpg', 'products/placeholder_cashew2.jpg'],
      },
      // Ayurvedic Products
      {
        name: 'Ashwagandha Supplements',
        description: 'Organic Ashwagandha (Withania somnifera) root extract capsules, standardized for high withanolide content. Supports stress reduction and vitality.',
        shortDescription: 'High-potency organic Ashwagandha capsules.',
        category: categoryMap.get('Ayurvedic Products'),
        origin: 'Rajasthan / Madhya Pradesh',
        specifications: { Form: "Capsules (500mg)", Extract: "Standardized Withanolides > 5%", Type: "Organic" },
        certifications: ["GMP Certified", "USDA Organic", "ISO Certified"],
        packagingOptions: ["60 Capsules Bottle", "90 Capsules Bottle"],
        images: ['products/placeholder_ashwagandha_capsules1.jpg', 'products/placeholder_ashwagandha_capsules2.jpg'],
      },
      {
        name: 'Triphala Powder',
        description: 'A traditional Ayurvedic blend of three fruits: Amla, Haritaki, and Bibhitaki. Organic Triphala powder supports digestion, detoxification, and overall gut health.',
        shortDescription: 'Organic Triphala churna for digestion.',
        category: categoryMap.get('Ayurvedic Products'),
        origin: 'Various (Sourced across India)',
        specifications: { Ingredients: "Amla, Haritaki, Bibhitaki (Equal Parts)", Form: "Fine Powder", Type: "Organic" },
        certifications: ["India Organic", "FSSAI Licensed (Ayush)"],
        packagingOptions: ["100g Pouch", "250g Jar"],
        images: ['products/placeholder_triphala1.jpg', 'products/placeholder_triphala2.jpg'],
      },
      {
        name: 'Neem-Based Skincare',
        description: 'Natural skincare products infused with Neem (Azadirachta indica), known for its antibacterial and purifying properties. Includes face wash, soap, and creams.',
        shortDescription: 'Herbal Neem face wash and soap.',
        category: categoryMap.get('Ayurvedic Products'),
        origin: 'Various (Sourced across India)',
        specifications: { KeyIngredient: "Neem Extract/Oil", Products: "Face Wash, Soap, Cream", SkinType: "Oily/Acne-prone" },
        certifications: ["Ayush Certified", "Cruelty-Free", "Paraben-Free"],
        packagingOptions: ["Individual Product Packaging", "Skincare Sets"],
        images: ['products/placeholder_neem_skincare1.jpg', 'products/placeholder_neem_skincare2.jpg'],
      },
      {
        name: 'Tulsi Capsules',
        description: 'Pure organic Tulsi (Holy Basil) leaf extract capsules. Supports respiratory health, immunity, and stress adaptation.',
        shortDescription: 'Organic Holy Basil (Tulsi) extract capsules.',
        category: categoryMap.get('Ayurvedic Products'),
        origin: 'Central India',
        specifications: { Form: "Capsules (400mg)", Type: "Organic Holy Basil Extract", Benefits: "Immunity, Stress Relief" },
        certifications: ["USDA Organic", "GMP Certified"],
        packagingOptions: ["60 Capsules HDPE Bottle", "Bulk Orders"],
        images: ['products/placeholder_tulsi_capsules1.jpg', 'products/placeholder_tulsi_capsules2.jpg'],
      },
      {
        name: 'Kumkumadi Massage Oil',
        description: 'Authentic Kumkumadi Tailam, a classical Ayurvedic facial oil made with saffron and other precious herbs. Promotes skin radiance, reduces blemishes, and evens skin tone.',
        shortDescription: 'Traditional Kumkumadi Tailam for face glow.',
        category: categoryMap.get('Ayurvedic Products'),
        origin: 'Kerala / South India (Traditional preparation)',
        specifications: { KeyIngredients: "Saffron, Sandalwood, Manjistha", BaseOil: "Sesame Oil", Application: "Facial Massage" },
        certifications: ["Ayush Premium Mark (for some brands)", "Authentic Ayurvedic Formulation"],
        packagingOptions: ["15ml Dropper Bottle", "30ml Luxury Bottle"],
        images: ['products/placeholder_kumkumadi_oil1.jpg', 'products/placeholder_kumkumadi_oil2.jpg'],
      },
    ];

    console.log('Seeding Products...');
    const validProductsData = productsData.filter(p => p.category);
    if (validProductsData.length !== productsData.length) {
        console.warn('Some products were filtered out due to missing category IDs. Check category names in productsData.');
    }

    if (validProductsData.length > 0) {
        const createdProducts = await Product.insertMany(validProductsData);
        console.log(`${createdProducts.length} products seeded successfully.`);
    } else {
        console.log('No valid products to seed after filtering.');
    }

    console.log('Database seeding completed successfully!');

  } catch (error: any) {
    console.error('Error during database seeding:', error.message);
    if (error.errors) {
      for (const field in error.errors) {
        console.error(`Validation error for ${field}: ${error.errors[field].message}`);
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedData(); 