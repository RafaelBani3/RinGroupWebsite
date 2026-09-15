import { PrismaClient, Role, ContentStatus, NewsStatus, CareerStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PT RIN Group Indonesia database seed...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      '❌ Missing required environment variables: ADMIN_EMAIL and ADMIN_PASSWORD must be defined to run the seed script safely.'
    );
  }

  // 1. Seed SUPER_ADMIN account securely
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: 'RIN Group System Administrator',
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`✓ Super Admin account verified for email: ${adminEmail}`);

  // 2. Seed Singleton Company Profile
  await prisma.companyProfile.upsert({
    where: { isSingleton: true },
    update: {
      name: 'PT RIN Group Indonesia',
      shortName: 'RIN Group',
      description:
        'PT RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive restaurant and culinary concepts in Indonesia.',
      about:
        'RIN Group operates with a commitment to culinary precision, authentic Japanese hospitality, and strategic operational management. Across every concept, our team delivers memorable dining encounters grounded in quality ingredients and guest-first experiences.',
      vision:
        'To be the leading hospitality and restaurant group recognized for shaping Indonesia’s dining landscape through authentic, high-standard culinary experiences.',
      mission:
        '1. Cultivate culinary excellence across all dining concepts.\n2. Practice genuine, attentive hospitality at every guest touchpoint.\n3. Build sustainable, high-performing restaurant operations.\n4. Empower our team members to grow into culinary and service leaders.',
      philosophy:
        'Built Around Food. Driven by People.\nWe believe that dining is an art of hospitality that connects people, culture, and memorable flavors.',
      address: 'Corporate Office: Alam Sutera, Tangerang, Banten, Indonesia',
      email: 'corporate@ringroup.co.id',
      phone: '+62 21 5000 0000',
      mapUrl: 'https://maps.google.com',
      instagram: 'https://instagram.com/ringroup.id',
      linkedin: 'https://linkedin.com/company/rin-group-indonesia',
    },
    create: {
      isSingleton: true,
      name: 'PT RIN Group Indonesia',
      shortName: 'RIN Group',
      description:
        'PT RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive restaurant and culinary concepts in Indonesia.',
      about:
        'RIN Group operates with a commitment to culinary precision, authentic Japanese hospitality, and strategic operational management. Across every concept, our team delivers memorable dining encounters grounded in quality ingredients and guest-first experiences.',
      vision:
        'To be the leading hospitality and restaurant group recognized for shaping Indonesia’s dining landscape through authentic, high-standard culinary experiences.',
      mission:
        '1. Cultivate culinary excellence across all dining concepts.\n2. Practice genuine, attentive hospitality at every guest touchpoint.\n3. Build sustainable, high-performing restaurant operations.\n4. Empower our team members to grow into culinary and service leaders.',
      philosophy:
        'Built Around Food. Driven by People.\nWe believe that dining is an art of hospitality that connects people, culture, and memorable flavors.',
      address: 'Corporate Office: Alam Sutera, Tangerang, Banten, Indonesia',
      email: 'corporate@ringroup.co.id',
      phone: '+62 21 5000 0000',
      mapUrl: 'https://maps.google.com',
      instagram: 'https://instagram.com/ringroup.id',
      linkedin: 'https://linkedin.com/company/rin-group-indonesia',
    },
  });

  console.log('✓ Company profile singleton seeded.');

  // 3. Seed Singleton Site Setting
  await prisma.siteSetting.upsert({
    where: { isSingleton: true },
    update: {
      siteName: 'PT RIN Group Indonesia',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ringroup.co.id',
      defaultSeoTitle: 'RIN Group Indonesia | Food & Beverage Company',
      defaultMetaDesc:
        'RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
      gaId: process.env.NEXT_PUBLIC_GA_ID || '',
      maintenanceMode: false,
    },
    create: {
      isSingleton: true,
      siteName: 'PT RIN Group Indonesia',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ringroup.co.id',
      defaultSeoTitle: 'RIN Group Indonesia | Food & Beverage Company',
      defaultMetaDesc:
        'RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
      gaId: process.env.NEXT_PUBLIC_GA_ID || '',
      maintenanceMode: false,
    },
  });

  console.log('✓ Site settings seeded.');

  // 4. Seed Initial Verified Brand Concepts
  const brandsData = [
    {
      name: 'Sukiyaki RIN',
      slug: 'sukiyaki-rin',
      tagline: 'Artisanal Sukiyaki & Shabu-Shabu Experience',
      shortDescription:
        'Specializing in premium Japanese hot pot with curated cuts of marbled beef, slow-simmered warishita broth, and attentive tableside service.',
      description:
        'Sukiyaki RIN brings the revered Japanese hot-pot culinary tradition to Indonesia with exceptional craft. Each dining experience centers around carefully sourced ingredients, rich hand-crafted warishita, and serene hospitality inspired by classical Japanese dining parlors.',
      category: 'Japanese Sukiyaki & Shabu-Shabu',
      concept: 'Authentic Kansai & Kanto style sukiyaki dining with private dining options and tableside preparation.',
      story:
        'Conceived to celebrate the subtle balance of sweet and savory in traditional warishita, Sukiyaki RIN was shaped around the ethos of mindful, unhurried dining.',
      coverImage: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1600&auto=format&fit=crop',
      logoUrl: '',
      gallery: [
        'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop',
      ],
      sortOrder: 1,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      seoTitle: 'Sukiyaki RIN | RIN Group Indonesia',
      seoDescription:
        'Discover Sukiyaki RIN, a distinctive Japanese dining concept within the PT RIN Group Indonesia culinary portfolio.',
      locations: [
        {
          name: 'Sukiyaki RIN — Alam Sutera',
          address: 'Alam Sutera Boulevard, Tangerang, Banten',
          city: 'Tangerang',
          hours: '11:00 - 22:00',
          phone: '+62 21 5000 0001',
          mapUrl: 'https://maps.google.com/?q=Sukiyaki+RIN+Alam+Sutera+Boulevard+Tangerang',
        },
      ],
    },
    {
      name: 'Yakiniku TEN',
      slug: 'yakiniku-ten',
      tagline: 'Refined Charcoal Japanese Barbecue',
      shortDescription:
        'Contemporary Japanese yakiniku highlighting prized cuts, smokeless charcoal grilling, and house-blended tare sauces.',
      description:
        'Yakiniku TEN honors the craft of Japanese fire and grill. Savor an array of prime cuts, expertly carved and grilled to perfection over pristine coals, paired with seasonal side dishes and curated beverages in an intimate, modern atmosphere.',
      category: 'Japanese Yakiniku',
      concept: 'Premium Japanese barbecue with smokeless table grills and omakase-level cut selections.',
      story:
        'Created to elevate casual grill culture into a refined evening journey, Yakiniku TEN combines culinary precision with warm, contemporary hospitality.',
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
      logoUrl: '',
      gallery: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      ],
      sortOrder: 2,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      seoTitle: 'Yakiniku TEN | RIN Group Indonesia',
      seoDescription: 'Explore Yakiniku TEN, refined Japanese charcoal barbecue by PT RIN Group Indonesia.',
      locations: [
        {
          name: 'Yakiniku TEN — West Jakarta',
          address: 'Jakarta Barat, DKI Jakarta',
          city: 'Jakarta',
          hours: '12:00 - 22:00',
          phone: '+62 21 5000 0002',
          mapUrl: 'https://maps.google.com/?q=Yakiniku+TEN+Jakarta',
        },
      ],
    },
    {
      name: 'Ryu Jin',
      slug: 'ryu-jin',
      tagline: 'Modern Japanese Izakaya & Robatayaki',
      shortDescription:
        'A vibrant communal culinary space celebrating skewered delicacies, artisanal ramen, and lively Japanese izakaya culture.',
      description:
        'Ryu Jin reinterprets Tokyo’s energetic evening dining culture. From crackling robata skewers to comforting specialty broths and refreshing drinks, it provides a warm meeting ground for friends, colleagues, and food lovers.',
      category: 'Japanese Izakaya & Robata',
      concept: 'Energetic after-hours dining with open hearth robata grilling and crafted Japanese small plates.',
      story:
        'Ryu Jin was conceptualized as a celebration of spirited gatherings, where authentic flavors meet relaxed ambiance.',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop',
      logoUrl: '',
      gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'],
      sortOrder: 3,
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      seoTitle: 'Ryu Jin | RIN Group Indonesia',
      seoDescription: 'Discover Ryu Jin, modern Japanese izakaya and robata dining by RIN Group Indonesia.',
      locations: [
        {
          name: 'Ryu Jin — Gading Serpong',
          address: 'Gading Serpong, Tangerang, Banten',
          city: 'Tangerang',
          hours: '11:30 - 23:00',
          phone: '+62 21 5000 0003',
          mapUrl: 'https://maps.google.com/?q=Ryu+Jin+Gading+Serpong+Tangerang',
        },
      ],
    },
    {
      name: 'Sumomatsu',
      slug: 'sumomatsu',
      tagline: 'Crafted Comfort Japanese Dining',
      shortDescription:
        'Hearty, comforting Japanese staples crafted with uncompromising dedication to quality and homestyle warmth.',
      description:
        'Sumomatsu brings wholesome Japanese comfort food to guests seeking authentic warmth. Specializing in hearty sets, comforting dons, and delicate appetizers, Sumomatsu makes fine Japanese dining approachable every day.',
      category: 'Casual Japanese Comfort',
      concept: 'Accessible, comfort-driven Japanese cuisine emphasizing nourishing broths and generous sets.',
      story:
        'Sumomatsu reflects our belief that exceptional hospitality begins with familiar, deeply satisfying flavors.',
      coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1600&auto=format&fit=crop',
      logoUrl: '',
      gallery: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1200&auto=format&fit=crop'],
      sortOrder: 4,
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      seoTitle: 'Sumomatsu | RIN Group Indonesia',
      seoDescription: 'Explore Sumomatsu, crafted comfort Japanese dining by PT RIN Group Indonesia.',
      locations: [
        {
          name: 'Sumomatsu — Tangerang',
          address: 'Tangerang, Banten',
          city: 'Tangerang',
          hours: '10:00 - 22:00',
          phone: '+62 21 5000 0004',
          mapUrl: 'https://maps.google.com/?q=Sumomatsu+Tangerang',
        },
      ],
    },
  ];

  for (const b of brandsData) {
    const { locations, ...brandFields } = b;
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        ...brandFields,
      },
      create: {
        ...brandFields,
      },
    });

    if (locations && locations.length > 0) {
      await prisma.brandLocation.deleteMany({ where: { brandId: brand.id } });
      for (const loc of locations) {
        await prisma.brandLocation.create({
          data: {
            brandId: brand.id,
            name: loc.name,
            address: loc.address,
            city: loc.city,
            hours: loc.hours,
            phone: loc.phone,
            mapUrl: loc.mapUrl,
          },
        });
      }
    }
  }

  console.log('✓ Brand portfolio seeded (Sukiyaki RIN, Yakiniku TEN, Ryu Jin, Sumomatsu).');

  // 5. Seed News Categories and Sample Articles
  const catCorp = await prisma.newsCategory.upsert({
    where: { slug: 'company-updates' },
    update: { name: 'Company Updates' },
    create: { name: 'Company Updates', slug: 'company-updates', description: 'Official corporate news from PT RIN Group Indonesia.' },
  });

  const catCulinary = await prisma.newsCategory.upsert({
    where: { slug: 'culinary-craft' },
    update: { name: 'Culinary & Craft' },
    create: { name: 'Culinary & Craft', slug: 'culinary-craft', description: 'Stories behind our ingredients, broths, and culinary techniques.' },
  });

  const catPeople = await prisma.newsCategory.upsert({
    where: { slug: 'people-hospitality' },
    update: { name: 'People & Hospitality' },
    create: { name: 'People & Hospitality', slug: 'people-hospitality', description: 'Recognizing our team and service culture.' },
  });

  await prisma.newsArticle.upsert({
    where: { slug: 'strengthening-culinary-standards-across-concepts' },
    update: {
      title: 'Strengthening Culinary Standards Across Our Restaurant Portfolio',
      excerpt:
        'How PT RIN Group Indonesia maintains consistency, flavor precision, and ingredient integrity across all dining operations.',
      content:
        '<p>At PT RIN Group Indonesia, culinary excellence is never an afterthought—it is the foundational standard that defines every kitchen in our portfolio. From artisanal warishita broths to carefully managed charcoal temperatures, every detail is engineered to respect the craft of authentic dining.</p><p>As our concepts continue to evolve, we continually reinforce our supply chain partnerships, ensuring that our beef selections, dashi bases, and seasonal items meet the highest standards of culinary integrity.</p>',
      coverImage: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop',
      categoryId: catCulinary.id,
      authorId: superAdmin.id,
      status: NewsStatus.PUBLISHED,
      publishedAt: new Date('2026-08-10T10:00:00Z'),
      seoTitle: 'Strengthening Culinary Standards | RIN Group News',
      seoDescription: 'Read how PT RIN Group Indonesia sets and upholds high culinary standards across its restaurant brands.',
    },
    create: {
      title: 'Strengthening Culinary Standards Across Our Restaurant Portfolio',
      slug: 'strengthening-culinary-standards-across-concepts',
      excerpt:
        'How PT RIN Group Indonesia maintains consistency, flavor precision, and ingredient integrity across all dining operations.',
      content:
        '<p>At PT RIN Group Indonesia, culinary excellence is never an afterthought—it is the foundational standard that defines every kitchen in our portfolio. From artisanal warishita broths to carefully managed charcoal temperatures, every detail is engineered to respect the craft of authentic dining.</p><p>As our concepts continue to evolve, we continually reinforce our supply chain partnerships, ensuring that our beef selections, dashi bases, and seasonal items meet the highest standards of culinary integrity.</p>',
      coverImage: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=1200&auto=format&fit=crop',
      categoryId: catCulinary.id,
      authorId: superAdmin.id,
      status: NewsStatus.PUBLISHED,
      publishedAt: new Date('2026-08-10T10:00:00Z'),
      seoTitle: 'Strengthening Culinary Standards | RIN Group News',
      seoDescription: 'Read how PT RIN Group Indonesia sets and upholds high culinary standards across its restaurant brands.',
    },
  });

  await prisma.newsArticle.upsert({
    where: { slug: 'the-spirit-of-omotenashi-in-modern-dining' },
    update: {
      title: 'The Spirit of Omotenashi: Delivering Genuine Guest Hospitality',
      excerpt:
        'Exploring how mindfulness and anticipation of guest needs guide the training of service teams at RIN Group restaurants.',
      content:
        '<p>Hospitality is more than routine service; it is the art of anticipating a guest’s need before it is voiced. In all RIN Group dining locations, our front-of-house teams undergo continuous immersion in attentive, respectful hospitality.</p><p>Whether serving guests in private dining rooms or bustling evening grills, our goal remains uniform: making every visitor feel valued and genuinely cared for.</p>',
      coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop',
      categoryId: catPeople.id,
      authorId: superAdmin.id,
      status: NewsStatus.PUBLISHED,
      publishedAt: new Date('2026-08-25T14:00:00Z'),
      seoTitle: 'The Spirit of Omotenashi | RIN Group Insights',
      seoDescription: 'Discover our approach to Japanese hospitality and service culture across RIN Group restaurants.',
    },
    create: {
      title: 'The Spirit of Omotenashi: Delivering Genuine Guest Hospitality',
      slug: 'the-spirit-of-omotenashi-in-modern-dining',
      excerpt:
        'Exploring how mindfulness and anticipation of guest needs guide the training of service teams at RIN Group restaurants.',
      content:
        '<p>Hospitality is more than routine service; it is the art of anticipating a guest’s need before it is voiced. In all RIN Group dining locations, our front-of-house teams undergo continuous immersion in attentive, respectful hospitality.</p><p>Whether serving guests in private dining rooms or bustling evening grills, our goal remains uniform: making every visitor feel valued and genuinely cared for.</p>',
      coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop',
      categoryId: catPeople.id,
      authorId: superAdmin.id,
      status: NewsStatus.PUBLISHED,
      publishedAt: new Date('2026-08-25T14:00:00Z'),
      seoTitle: 'The Spirit of Omotenashi | RIN Group Insights',
      seoDescription: 'Discover our approach to Japanese hospitality and service culture across RIN Group restaurants.',
    },
  });

  console.log('✓ News categories and sample articles seeded.');

  // 6. Seed Sample Career Vacancies
  await prisma.career.upsert({
    where: { slug: 'restaurant-general-manager' },
    update: {
      title: 'Restaurant General Manager',
      department: 'Operations',
      location: 'Tangerang / Jakarta',
      employmentType: 'Full-time',
      description:
        'We are seeking an experienced Restaurant General Manager to lead daily dining operations, ensure service excellence, and uphold brand standards across our Japanese dining concepts.',
      responsibilities:
        '- Oversee full restaurant floor operations and team management.\n- Maintain quality benchmarks for culinary presentation and guest satisfaction.\n- Manage operational budgets, inventory controls, and labor scheduling.\n- Coach and mentor service staff in hospitality standards.',
      requirements:
        '- Minimum 3-5 years of leadership experience in premium F&B or hospitality.\n- Strong understanding of Japanese restaurant service and guest relations.\n- Proven track record of operational efficiency and team development.\n- Excellent communication and crisis resolution abilities.',
      benefits:
        '- Competitive executive compensation package.\n- Performance and revenue bonuses.\n- Comprehensive medical coverage.\n- Career advancement opportunities within RIN Group brands.',
      applicationUrl: 'mailto:careers@ringroup.co.id?subject=Application:%20Restaurant%20General%20Manager',
      status: CareerStatus.PUBLISHED,
      closingDate: new Date('2026-12-31T23:59:59Z'),
    },
    create: {
      title: 'Restaurant General Manager',
      slug: 'restaurant-general-manager',
      department: 'Operations',
      location: 'Tangerang / Jakarta',
      employmentType: 'Full-time',
      description:
        'We are seeking an experienced Restaurant General Manager to lead daily dining operations, ensure service excellence, and uphold brand standards across our Japanese dining concepts.',
      responsibilities:
        '- Oversee full restaurant floor operations and team management.\n- Maintain quality benchmarks for culinary presentation and guest satisfaction.\n- Manage operational budgets, inventory controls, and labor scheduling.\n- Coach and mentor service staff in hospitality standards.',
      requirements:
        '- Minimum 3-5 years of leadership experience in premium F&B or hospitality.\n- Strong understanding of Japanese restaurant service and guest relations.\n- Proven track record of operational efficiency and team development.\n- Excellent communication and crisis resolution abilities.',
      benefits:
        '- Competitive executive compensation package.\n- Performance and revenue bonuses.\n- Comprehensive medical coverage.\n- Career advancement opportunities within RIN Group brands.',
      applicationUrl: 'mailto:careers@ringroup.co.id?subject=Application:%20Restaurant%20General%20Manager',
      status: CareerStatus.PUBLISHED,
      closingDate: new Date('2026-12-31T23:59:59Z'),
    },
  });

  console.log('✓ Career vacancies seeded.');

  // 7. Seed Initial SEO Metadata for Static Routes
  const seoRoutes = [
    {
      path: '/',
      title: 'RIN Group Indonesia | Food & Beverage Company',
      description:
        'PT RIN Group Indonesia is a Food & Beverage company focused on developing and managing distinctive culinary concepts and restaurant experiences in Indonesia.',
    },
    {
      path: '/about',
      title: 'About PT RIN Group Indonesia | Culinary Excellence & Hospitality',
      description:
        'Learn about PT RIN Group Indonesia, our hospitality philosophy, culinary standards, and restaurant management vision.',
    },
    {
      path: '/brands',
      title: 'Our Restaurant Brands | PT RIN Group Indonesia',
      description:
        'Explore the curated dining concepts managed and developed by PT RIN Group Indonesia, including Sukiyaki RIN, Yakiniku TEN, Ryu Jin, and Sumomatsu.',
    },
    {
      path: '/career',
      title: 'Careers at RIN Group Indonesia | Join Our Team',
      description:
        'Discover opportunities to build distinctive dining experiences with PT RIN Group Indonesia across restaurant operations and leadership.',
    },
    {
      path: '/news',
      title: 'News & Insights | PT RIN Group Indonesia',
      description:
        'Read the latest corporate updates, culinary insights, and hospitality articles from PT RIN Group Indonesia.',
    },
    {
      path: '/contact',
      title: 'Contact PT RIN Group Indonesia | Corporate Inquiries',
      description:
        'Get in touch with PT RIN Group Indonesia for business inquiries, partnerships, restaurant opportunities, and corporate relations.',
    },
  ];

  for (const s of seoRoutes) {
    await prisma.seoMetadata.upsert({
      where: { path: s.path },
      update: {
        title: s.title,
        description: s.description,
        ogTitle: s.title,
        ogDescription: s.description,
      },
      create: {
        path: s.path,
        title: s.title,
        description: s.description,
        ogTitle: s.title,
        ogDescription: s.description,
        robots: 'index, follow',
      },
    });
  }

  console.log('✓ SEO route metadata seeded.');
  console.log('✨ Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
