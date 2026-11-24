const db = require('./db');

const initialDeals = [
  {
    title: 'TaskArena — Train AI Models & Earn',
    slug: 'taskarena',
    category: 'microtasks',
    summary: 'Train cutting-edge AI models from your phone or PC. Evaluate responses, tag datasets, and get paid weekly to M-Pesa.',
    description: 'TaskArena is Kenya’s premier platform connecting contributors with international AI data annotation workflows. Work flexibly reviewing text, images, and audio datasets with instant onboarding.',
    badge: 'Hot • AI Training',
    payout_range: 'Ksh 1,500 – 4,500 / day',
    difficulty: 'Easy to Medium',
    payment_method: 'Direct M-Pesa',
    requirements: JSON.stringify(['Smartphone or Computer', 'Good English comprehension', 'Basic computer literacy']),
    steps: JSON.stringify([
      'Visit taskarena.co.ke and create contributor account',
      'Complete the 10-minute training benchmark test',
      'Select available data queues and submit reviews',
      'Request withdrawal directly to M-Pesa'
    ]),
    affiliate_url: 'https://taskarena.co.ke',
    is_featured: 1,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 1
  },
  {
    title: 'Mobicredits — Instant Emergency Mobile Loans',
    slug: 'mobicredits',
    category: 'finance',
    summary: 'Instant emergency cash advances and micro-loans sent straight to your Safaricom M-Pesa in under 5 minutes.',
    description: 'Need fast funds for your business or personal hustle? Mobicredits offers quick credit limit calculations with zero paperwork. Fast approval and instant M-Pesa disbursement.',
    badge: 'Instant Cash',
    payout_range: 'Ksh 2,000 – 50,000 Limit',
    difficulty: 'Instant',
    payment_method: 'Direct M-Pesa',
    requirements: JSON.stringify(['Safaricom M-Pesa line active for 6+ months', 'Kenyan National ID (18+)', 'Smartphone with internet access']),
    steps: JSON.stringify([
      'Go to mobicredit.co.ke and enter phone number',
      'Verify National ID to calculate instant limit',
      'Select loan duration and confirm terms',
      'Receive loan funds directly into M-Pesa'
    ]),
    affiliate_url: 'https://mobicredit.co.ke',
    is_featured: 1,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 2
  },
  {
    title: 'Lovelane — Get Paid to Chat & Connect',
    slug: 'lovelane',
    category: 'dating',
    summary: 'Earn real income chatting, replying to text exchanges, and moderating conversations on Kenya’s premier social dating app.',
    description: 'Lovelane compensates active chat moderators and conversationalists. Maintain engaging, polite discussions with users looking to connect. Payouts accumulated per message exchange.',
    badge: 'Earn Per Chat',
    payout_range: 'Ksh 800 – 2,500 / day',
    difficulty: 'Easy',
    payment_method: 'Direct M-Pesa',
    requirements: JSON.stringify(['Must be 18+ years of age', 'Smartphone with WhatsApp/Browser', 'Engaging conversational skills']),
    steps: JSON.stringify([
      'Visit lovelane.pages.dev and register profile',
      'Verify age (18+) and profile details',
      'Accept chat requests and keep chats active',
      'Cash out accumulated earnings via M-Pesa'
    ]),
    affiliate_url: 'https://lovelane.pages.dev',
    is_featured: 1,
    is_meta_safe: 0,
    status: 'active',
    sort_order: 3
  },
  {
    title: 'BetPalace — 100% Deposit Cashback Bonus',
    slug: 'betpalace',
    category: 'betting',
    summary: 'Deposit Ksh 300 or above and get a 100% cashback bonus refund to boost your sports predictions.',
    description: 'BetPalace provides Kenyan football and sports fans with risk-buffer promos. Any deposit over Ksh 300 qualifies for an immediate 100% cashback bonus credited to your wallet balance.',
    badge: '100% Cashback (> Ksh 300)',
    payout_range: '100% Cashback Bonus',
    difficulty: 'Easy',
    payment_method: 'M-Pesa Paybill',
    requirements: JSON.stringify(['Must be 18+ years old (BCLB Regulated)', 'Safaricom M-Pesa line', 'Minimum deposit of Ksh 300']),
    steps: JSON.stringify([
      'Visit betpalace.co.ke and register player account',
      'Deposit Ksh 300 or more via M-Pesa paybill',
      'Claim 100% cashback bonus in your account',
      'Wager with buffered stakes'
    ]),
    affiliate_url: 'https://betpalace.co.ke',
    is_featured: 0,
    is_meta_safe: 0,
    status: 'active',
    sort_order: 4
  },
  {
    title: 'Remotasks / AI Data Annotation',
    slug: 'remotasks-ai-training',
    category: 'microtasks',
    summary: 'Label images, evaluate chatbot responses, and annotate sensor data from your smartphone or laptop.',
    description: 'Work with leading AI labs to train machine learning models. High accuracy reviewers receive bonus multipliers. Payouts are sent weekly directly via Airtm or PayPal, easily withdrawable to M-Pesa.',
    badge: 'Popular in Kenya',
    payout_range: 'Ksh 1,200 – 3,500 / day',
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
    is_featured: 0,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 5
  },
  {
    title: 'Premise Kenya - Street & Photo Microtasks',
    slug: 'premise-kenya-tasks',
    category: 'microtasks',
    summary: 'Take photos of supermarket prices, local businesses, and answer short surveys around your town.',
    description: 'Premise pays contributors across Nairobi, Mombasa, Kisumu, Eldoret and other Kenyan towns for ground market intelligence. Directly linked with Safaricom M-Pesa for instant withdrawals starting from just KES 100.',
    badge: 'Instant M-Pesa',
    payout_range: 'Ksh 350 – 1,500 / day',
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
    is_featured: 0,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 6
  },
  {
    title: 'Jumia KOL & Affiliate Partner Program',
    slug: 'jumia-affiliate-program',
    category: 'affiliate',
    summary: 'Earn up to 13% commission sharing popular smartphones, electronics, and fashion deals with your contacts.',
    description: 'Kenya’s biggest online marketplace allows any Kenyan with a smartphone to become an official affiliate. Share custom deal links on WhatsApp status, TikTok, or Facebook groups and earn commission whenever anyone orders.',
    badge: 'High Commission',
    payout_range: 'Ksh 10,000 – 45,000 / mo',
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
    is_featured: 0,
    is_meta_safe: 1,
    status: 'active',
    sort_order: 7
  }
];

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
  ON CONFLICT(slug) DO UPDATE SET
    title=excluded.title,
    category=excluded.category,
    summary=excluded.summary,
    description=excluded.description,
    badge=excluded.badge,
    payout_range=excluded.payout_range,
    difficulty=excluded.difficulty,
    payment_method=excluded.payment_method,
    requirements=excluded.requirements,
    steps=excluded.steps,
    affiliate_url=excluded.affiliate_url,
    is_featured=excluded.is_featured,
    is_meta_safe=excluded.is_meta_safe,
    status=excluded.status,
    sort_order=excluded.sort_order
`);

const insertMany = db.transaction((deals) => {
  for (const deal of deals) {
    insert.run(deal);
  }
});

insertMany(initialDeals);
console.log(`Seeded/Synced ${initialDeals.length} initial deals.`);
