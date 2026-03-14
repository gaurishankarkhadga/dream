const mongoose = require('mongoose');

// Database initialization script
async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database indexes and relationships...');
    
    // Ensure all models are loaded
    require('./models/User');
    require('./models/BioLink');
    require('./models/AffiliateLink');
    require('./models/AffiliatePlatform');
    require('./models/AffiliateAnalytics');
    require('./models/AutomationFlow');
    require('./models/AutomationLog');
    require('./models/SocialConnection');

    // Create additional indexes for better performance
    const db = mongoose.connection.db;
    
    // Helper function to create index with error handling
    const createIndexSafely = async (collection, indexSpec, options = {}) => {
      try {
        await collection.createIndex(indexSpec, options);
        console.log(`✅ Index created: ${JSON.stringify(indexSpec)}`);
      } catch (error) {
        if (error.code === 86 || error.codeName === 'IndexKeySpecsConflict') {
          console.log(`ℹ️ Index already exists: ${JSON.stringify(indexSpec)}`);
        } else {
          console.warn(`⚠️ Index creation failed: ${JSON.stringify(indexSpec)} - ${error.message}`);
        }
      }
    };
    
    // User indexes (email and username are already unique from schema)
    await createIndexSafely(db.collection('users'), { isActive: 1 });
    
    // BioLink indexes (username is already unique from schema)
    await createIndexSafely(db.collection('biolinks'), { userId: 1, lastModified: -1 });
    await createIndexSafely(db.collection('biolinks'), { isPublished: 1 });
    await createIndexSafely(db.collection('biolinks'), { 'analytics.views': -1 });
    
    // AffiliateLink indexes (shortUrl is already unique from schema)
    await createIndexSafely(db.collection('affiliatelinks'), { userId: 1, createdAt: -1 });
    await createIndexSafely(db.collection('affiliatelinks'), { platform: 1 });
    await createIndexSafely(db.collection('affiliatelinks'), { status: 1 });
    
    // AffiliatePlatform indexes
    await createIndexSafely(db.collection('affiliateplatforms'), { userId: 1, platformId: 1 }, { unique: true });
    await createIndexSafely(db.collection('affiliateplatforms'), { isConnected: 1 });
    await createIndexSafely(db.collection('affiliateplatforms'), { status: 1 });
    
    // AffiliateAnalytics indexes
    await createIndexSafely(db.collection('affiliateanalytics'), { userId: 1, date: -1 });
    await createIndexSafely(db.collection('affiliateanalytics'), { platform: 1, date: -1 });
    await createIndexSafely(db.collection('affiliateanalytics'), { date: 1 });
    

    await createIndexSafely(db.collection('automationflows'), { userId: 1, createdAt: -1 });
    await createIndexSafely(db.collection('automationflows'), { 'settings.isActive': 1 });
    await createIndexSafely(db.collection('automationflows'), { category: 1 });
    await createIndexSafely(db.collection('automationflows'), { tags: 1 });
    await createIndexSafely(db.collection('automationflows'), { name: 'text', description: 'text' });
    
    // AutomationLog indexes
    await createIndexSafely(db.collection('automationlogs'), { flowId: 1, createdAt: -1 });
    await createIndexSafely(db.collection('automationlogs'), { userId: 1, createdAt: -1 });
    await createIndexSafely(db.collection('automationlogs'), { status: 1 });
    await createIndexSafely(db.collection('automationlogs'), { triggerType: 1 });
    await createIndexSafely(db.collection('automationlogs'), { createdAt: -1 });
    
    // SocialConnection indexes
    await createIndexSafely(db.collection('socialconnections'), { userId: 1, platform: 1 }, { unique: true });
    await createIndexSafely(db.collection('socialconnections'), { platformUserId: 1 });
    await createIndexSafely(db.collection('socialconnections'), { isConnected: 1 });
    await createIndexSafely(db.collection('socialconnections'), { syncStatus: 1 });
    await createIndexSafely(db.collection('socialconnections'), { lastSync: -1 });

    
    console.log('✅ Database indexes created successfully');
    
    // Create sample data for testing
    await createSampleData();
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Create sample data for testing
async function createSampleData() {
  try {
    const User = require('./models/User');
    const BioLink = require('./models/BioLink');
    
    // Check if sample data already exists
    const existingUser = await User.findOne({ email: 'demo@vytex.com' });
    if (existingUser) {
      console.log('📋 Sample data already exists, skipping creation');
      return;
    }
    
    console.log('📋 Creating sample data...');
    
    // Create demo user
    const demoUser = await User.create({
      email: 'demo@vytex.com',
      username: 'demo_user',
      name: 'Demo User',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      isActive: true,
      emailVerified: true
    });
    
    // Create sample BioLink
    await BioLink.create({
      userId: demoUser._id,
      username: 'demo_user',
      profile: {
        displayName: 'Demo User',
        tagline: 'Welcome to my BioLink!',
        bio: 'This is a demo BioLink created for testing purposes.'
      },
      links: [
        {
          id: 'link1',
          title: 'My Website',
          url: 'https://example.com',
          platform: 'website',
          isActive: true
        },
        {
          id: 'link2',
          title: 'Instagram',
          url: 'https://instagram.com/demo',
          platform: 'instagram',
          isActive: true
        }
      ],
      theme: 'minimal',
      isPublished: true,
      publishedAt: new Date()
    });
    
    console.log('✅ Sample data created successfully');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

module.exports = { initializeDatabase };
