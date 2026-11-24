const db = require('./db');

const initialDeals = [
  {
    title: 'Remotasks / AI Data Annotation',
    slug: 'remotasks-ai-training',
    category: 'microtasks',
    summary: 'Label images, evaluate chatbot responses, and annotate sensor data from your smartphone or laptop.',
    description: 'Work with leading AI labs to train machine learning models. High accuracy reviewers receive bonus multipliers. Payouts are sent weekly directly via Airtm or PayPal, easily withdrawable to M-Pesa.',
    badge: 'Popular in Kenya',
    payout_range: 'KES 1,200 - 3,500 / day',
    difficulty: 'Easy to Medium',
    payment_method: 'M-Pesa / PayPal',
    requirements: JSON.stringify(['Smartphone or Laptop', 'Basic English fluency', 'Passing onboarding test (15 mins)']),
    steps: JSON.stringify([
      'Sign up using your verified email',
      'Complete the 10-minute training test',
      'Start accepting image and text review queues',
      'Request weekly payout to M-Pesa'
    ]),
    affiliate_url: 'https://www.outlier.ai/',
    is_featured: 1,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 1
  },
  {
    title: 'Premise Kenya - Street & Photo Microtasks',
    slug: 'premise-kenya-tasks',
    category: 'microtasks',
    summary: 'Take photos of supermarket prices, local businesses, and answer short surveys around your town.',
    description: 'Premise pays contributors across Nairobi, Mombasa, Kisumu, Eldoret and other Kenyan towns for ground market intelligence. Directly linked with Safaricom M-Pesa for instant withdrawals starting from just KES 100.',
    badge: 'Instant M-Pesa',
    payout_range: 'KES 350 - 1,500 / day',
    difficulty: 'Very Easy',
    payment_method: 'Direct M-Pesa',
    requirements: JSON.stringify(['Android phone with camera and GPS', 'Safaricom M-Pesa number']),
    steps: JSON.stringify([
      'Download Premise app from Google Play Store',
      'Turn on location/GPS and verify your Safaricom number',
      'Browse tasks tab: reserve a nearby supermarket or shop audit',
      'Submit photos and cash out instant M-Pesa upon approval'
    ]),
    affiliate_url: 'https://www.premise.com/contributors/',
    is_featured: 1,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 2
  },
  {
    title: 'Jumia KOL & Affiliate Partner Program',
    slug: 'jumia-affiliate-program',
    category: 'affiliate',
    summary: 'Earn up to 13% commission sharing popular smartphones, electronics, and fashion deals with your contacts.',
    description: 'Kenya’s biggest online marketplace allows any Kenyan with a smartphone to become an official affiliate. Share custom deal links on WhatsApp status, TikTok, or Facebook groups and earn commission whenever anyone orders.',
    badge: 'High Commission',
    payout_range: 'KES 10,000 - 45,000 / mo',
    difficulty: 'Medium',
    payment_method: 'Bank / M-Pesa',
    requirements: JSON.stringify(['Active WhatsApp, Facebook, or TikTok account', 'Kenyan National ID for KYC']),
    steps: JSON.stringify([
      'Register for free on Jumia KOL Program',
      'Generate tracking links for trending flash sale items',
      'Post links on your WhatsApp status and social channels',
      'Receive monthly commissions on all fulfilled orders'
    ]),
    affiliate_url: 'https://affiliates.jumia.com/',
    is_featured: 1,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 3
  },
  {
    title: 'Audio & Swahili Speech Transcription',
    slug: 'swahili-english-transcription',
    category: 'freelance',
    summary: 'Listen to short Kenyan Swahili and English audio recordings and type what you hear.',
    description: 'Global voice AI companies pay Kenyan transcribers and native Swahili speakers to convert audio clips into clean text. Work on your own schedule from anywhere in Kenya with earphones and a phone or computer.',
    badge: 'No Experience Needed',
    payout_range: 'KES 800 - 2,800 / day',
    difficulty: 'Easy',
    payment_method: 'M-Pesa / PayPal',
    requirements: JSON.stringify(['Good listening skills in Swahili and English', 'Pair of earphones']),
    steps: JSON.stringify([
      'Create contributor account',
      'Pass the Swahili & English audio sample test',
      'Receive audio files and transcribe accurate captions',
      'Get paid per audio minute completed'
    ]),
    affiliate_url: 'https://www.transcribeme.com/transcription-jobs',
    is_featured: 0,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 4
  },
  {
    title: 'ySense & Toluna Kenya Paid Surveys',
    slug: 'ysense-surveys-kenya',
    category: 'surveys',
    summary: 'Share your consumer opinions on Kenyan telecommunication, banking, and beverage brands for cash.',
    description: 'Top international survey panels actively recruiting Kenyan participants. Get paid for 5 to 15-minute opinion questionnaires on mobile networks, consumer goods, and digital apps.',
    badge: 'Beginner Friendly',
    payout_range: 'KES 250 - 900 / day',
    difficulty: 'Very Easy',
    payment_method: 'Airtm / M-Pesa',
    requirements: JSON.stringify(['Any smartphone with internet access', 'Valid email address']),
    steps: JSON.stringify([
      'Register free account and complete your demographic profile',
      'Check daily email alerts or app dashboard for available surveys',
      'Answer questions truthfully to prevent disqualification',
      'Redeem earnings via Airtm into your M-Pesa'
    ]),
    affiliate_url: 'https://www.ysense.com/',
    is_featured: 0,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 5
  },
  {
    title: 'Kilimall Affiliate Influencer Program',
    slug: 'kilimall-affiliate-kenya',
    category: 'affiliate',
    summary: 'Promote budget tech accessories, solar lights, and home appliances in Kenya for up to 10% cut.',
    description: 'Kilimall offers generous commissions for local marketers. Very popular with affordable gadgets, fast Nairobi delivery, and direct M-Pesa settlements.',
    badge: 'Fast Clearance',
    payout_range: 'KES 5,000 - 30,000 / mo',
    difficulty: 'Easy to Medium',
    payment_method: 'Direct M-Pesa',
    requirements: JSON.stringify(['Active smartphone with internet', 'WhatsApp or Facebook audience']),
    steps: JSON.stringify([
      'Sign up as a Kilimall affiliate partner',
      'Pick top-discounted products under KES 2,000 for high conversion',
      'Share links on local bargain groups and personal status',
      'Withdraw accumulated commissions to M-Pesa'
    ]),
    affiliate_url: 'https://www.kilimall.co.ke/',
    is_featured: 0,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 6
  }
];

const count = db.prepare('SELECT COUNT(*) as count FROM deals').get().count;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO deals (
      title, slug, category, summary, description, badge, payout_range,
      difficulty, payment_method, requirements, steps, affiliate_url,
      is_featured, is_meta_safe, status, sort_order
    ) VALUES (
      @title, @slug, @category, @summary, @description, @badge, @payout_range,
      @difficulty, @payment_method, @requirements, @steps, @affiliate_url,
      @is_featured, @is_meta_safe, @status, @sort_order
    )
  `);

  const insertMany = db.transaction((deals) => {
    for (const deal of deals) {
      insert.run(deal);
    }
  });

  insertMany(initialDeals);
  console.log(`Seeded ${initialDeals.length} initial deals.`);
} else {
  console.log(`Deals table already has ${count} records.`);
}
