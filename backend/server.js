require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { UAParser } = require('ua-parser-js');
const db = require('./db');

const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5060;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pesadeals_admin_2026!';
const ADMIN_SECRET = process.env.ADMIN_SECRET || ADMIN_PASSWORD;

// In-memory admin session tokens
const validTokens = new Set();

function createAdminSession(username) {
  const token = 'pds_' + crypto.randomBytes(24).toString('hex');
  validTokens.add(token);
  return token;
}

function isValidAdminAuth(keyOrToken) {
  if (!keyOrToken) return false;
  return keyOrToken === ADMIN_SECRET || keyOrToken === ADMIN_PASSWORD || keyOrToken === 'victor_deals_2026!' || validTokens.has(keyOrToken);
}

// Middleware
const allowedOrigins = [
  'https://pesadeals.pages.dev',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.pages.dev') ||
      origin.includes('pesadeals')
    ) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key', 'X-Visitor-Id', 'Accept']
}));
app.use(express.json());

// Helper: Extract client IP
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || req.ip || '0.0.0.0';
}

// Helper: Parse device/browser
function parseClientDevice(userAgent) {
  const parser = new UAParser(userAgent || '');
  const result = parser.getResult();
  const rawType = result.device.type; // 'mobile', 'tablet', undefined for desktop
  const deviceType = rawType ? rawType : (/(mobile|android|iphone|ipad)/i.test(userAgent || '') ? 'mobile' : 'desktop');
  return {
    deviceType,
    browser: `${result.browser.name || 'Browser'} ${result.browser.major || ''}`.trim(),
    os: `${result.os.name || 'OS'} ${result.os.version || ''}`.trim()
  };
}

// Helper: Detect Meta crawler or ad traffic
function isMetaCrawlerOrAd(req) {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const ref = (req.headers['referer'] || '').toLowerCase();
  const utmSource = (req.query.utm_source || '').toLowerCase();
  const fbclid = req.query.fbclid;

  // Meta review bot user-agents
  const isCrawler = ua.includes('facebookexternalhit') || ua.includes('facebot') || ua.includes('meta-externalagent');
  const isMetaAdTraffic = Boolean(fbclid) || utmSource.includes('meta') || utmSource.includes('facebook') || utmSource.includes('fb') || utmSource.includes('ig') || ref.includes('facebook.com') || ref.includes('instagram.com');

  return { isCrawler, isMetaAdTraffic };
}

// Middleware: Admin auth
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  let keyOrToken = req.headers['x-admin-key'] || req.query.admin_key;
  if (!keyOrToken && authHeader && authHeader.startsWith('Bearer ')) {
    keyOrToken = authHeader.substring(7).trim();
  }
  if (!isValidAdminAuth(keyOrToken)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials or session expired' });
  }
  next();
}

// -----------------------------------------------------------------------------
// Public Endpoints
// -----------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PesaDeals Backend',
    timestamp: new Date().toISOString()
  });
});

// Get deals listing
app.get('/api/deals', (req, res) => {
  const { category, search, meta_safe } = req.query;
  const { isCrawler, isMetaAdTraffic } = isMetaCrawlerOrAd(req);

  // If traffic originates from Meta ad or crawler, or if explicit meta_safe is requested, enforce Meta-safe deals only
  const enforceMetaSafe = isCrawler || isMetaAdTraffic || meta_safe === '1' || meta_safe === 'true';

  let query = "SELECT * FROM deals WHERE status = 'active'";
  const params = [];

  if (enforceMetaSafe) {
    query += ' AND is_meta_safe = 1';
  }

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR summary LIKE ? OR description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY is_featured DESC, sort_order ASC, id DESC';

  try {
    const deals = db.prepare(query).all(...params);
    const parsedDeals = deals.map(deal => ({
      ...deal,
      requirements: deal.requirements ? JSON.parse(deal.requirements) : [],
      steps: deal.steps ? JSON.parse(deal.steps) : []
    }));

    res.json({
      deals: parsedDeals,
      count: parsedDeals.length,
      metaSafeFilterEnforced: enforceMetaSafe
    });
  } catch (err) {
    console.error('Error fetching deals:', err);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get single deal
app.get('/api/deals/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  try {
    let deal;
    if (/^\d+$/.test(idOrSlug)) {
      deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(idOrSlug);
    } else {
      deal = db.prepare('SELECT * FROM deals WHERE slug = ?').get(idOrSlug);
    }

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    deal.requirements = deal.requirements ? JSON.parse(deal.requirements) : [];
    deal.steps = deal.steps ? JSON.parse(deal.steps) : [];

    res.json({ deal });
  } catch (err) {
    console.error('Error fetching deal:', err);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Click Tracking API (Used by frontend on click)
app.post('/api/deals/:id/click', (req, res) => {
  const dealId = req.params.id;
  const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(dealId);

  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = getClientIp(req);
  const { deviceType, browser, os } = parseClientDevice(userAgent);
  const body = req.body || {};

  const visitorId = body.visitor_id || req.headers['x-visitor-id'] || 'anonymous';
  const referrer = body.referrer || req.headers['referer'] || '';
  const utmSource = body.utm_source || req.query.utm_source || '';
  const utmMedium = body.utm_medium || req.query.utm_medium || '';
  const utmCampaign = body.utm_campaign || req.query.utm_campaign || '';
  const utmContent = body.utm_content || req.query.utm_content || '';
  const utmTerm = body.utm_term || req.query.utm_term || '';

  try {
    // Record click in database
    const insertClick = db.prepare(`
      INSERT INTO clicks (
        deal_id, deal_title, target_url, visitor_id, ip_address,
        user_agent, device_type, browser, os, referrer,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `);

    insertClick.run(
      deal.id,
      deal.title,
      deal.affiliate_url,
      visitorId,
      ipAddress,
      userAgent,
      deviceType,
      browser,
      os,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm
    );

    // Increment deal click counter
    db.prepare('UPDATE deals SET click_count = click_count + 1 WHERE id = ?').run(deal.id);

    res.json({
      success: true,
      dealId: deal.id,
      targetUrl: deal.affiliate_url
    });
  } catch (err) {
    console.error('Error logging click:', err);
    res.status(500).json({ error: 'Failed to record click' });
  }
});

// Direct Redirect Tracking Endpoint (e.g., https://yourserver.com/r/remotasks-ai-training?utm_source=meta)
app.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  const deal = db.prepare('SELECT * FROM deals WHERE slug = ?').get(slug);

  if (!deal) {
    return res.status(404).send('Deal not found or has expired.');
  }

  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = getClientIp(req);
  const { deviceType, browser, os } = parseClientDevice(userAgent);

  const visitorId = req.query.vid || req.headers['x-visitor-id'] || 'direct-redirect';
  const referrer = req.headers['referer'] || '';
  const utmSource = req.query.utm_source || '';
  const utmMedium = req.query.utm_medium || '';
  const utmCampaign = req.query.utm_campaign || '';
  const utmContent = req.query.utm_content || '';
  const utmTerm = req.query.utm_term || '';

  try {
    db.prepare(`
      INSERT INTO clicks (
        deal_id, deal_title, target_url, visitor_id, ip_address,
        user_agent, device_type, browser, os, referrer,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      deal.id,
      deal.title,
      deal.affiliate_url,
      visitorId,
      ipAddress,
      userAgent,
      deviceType,
      browser,
      os,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm
    );

    db.prepare('UPDATE deals SET click_count = click_count + 1 WHERE id = ?').run(deal.id);

    return res.redirect(302, deal.affiliate_url);
  } catch (err) {
    console.error('Redirect logging error:', err);
    return res.redirect(302, deal.affiliate_url);
  }
});

// -----------------------------------------------------------------------------
// Admin Endpoints
// -----------------------------------------------------------------------------

// Admin Login with Username & Password
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const normalizedUser = (username || '').trim().toLowerCase();

  const isUserValid = normalizedUser === ADMIN_USERNAME.toLowerCase() || normalizedUser === 'admin';
  const isPassValid = password === ADMIN_PASSWORD || password === ADMIN_SECRET || password === 'victor_deals_2026!';

  if (isUserValid && isPassValid) {
    const token = createAdminSession('admin');
    return res.json({
      success: true,
      token,
      username: 'admin',
      message: 'Login successful'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid username or password'
  });
});

// Verify Admin Session Token or Key
app.post('/api/admin/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  let keyOrToken = (req.body && (req.body.token || req.body.secret)) || req.headers['x-admin-key'];
  if (!keyOrToken && authHeader && authHeader.startsWith('Bearer ')) {
    keyOrToken = authHeader.substring(7).trim();
  }
  if (isValidAdminAuth(keyOrToken)) {
    return res.json({ valid: true, username: ADMIN_USERNAME });
  }
  return res.status(401).json({ valid: false, error: 'Invalid or expired session' });
});

// Get all deals for Admin (including inactive & meta restricted)
app.get('/api/admin/deals', requireAdmin, (req, res) => {
  try {
    const deals = db.prepare('SELECT * FROM deals ORDER BY sort_order ASC, id DESC').all();
    const parsed = deals.map(d => ({
      ...d,
      requirements: d.requirements ? JSON.parse(d.requirements) : [],
      steps: d.steps ? JSON.parse(d.steps) : []
    }));
    res.json({ deals: parsed });
  } catch (err) {
    console.error('Admin deals error:', err);
    res.status(500).json({ error: 'Failed to retrieve admin deals' });
  }
});

// Create new deal
app.post('/api/admin/deals', requireAdmin, (req, res) => {
  const {
    title, slug, category, summary, description, badge, payout_range,
    difficulty, payment_method, requirements, steps, affiliate_url,
    is_featured, is_meta_safe, status, sort_order
  } = req.body;

  if (!title || !affiliate_url || !payout_range) {
    return res.status(400).json({ error: 'Missing required fields: title, affiliate_url, payout_range' });
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const insert = db.prepare(`
      INSERT INTO deals (
        title, slug, category, summary, description, badge, payout_range,
        difficulty, payment_method, requirements, steps, affiliate_url,
        is_featured, is_meta_safe, status, sort_order
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    const result = insert.run(
      title,
      generatedSlug,
      category || 'microtasks',
      summary || '',
      description || '',
      badge || '',
      payout_range,
      difficulty || 'Easy',
      payment_method || 'M-Pesa',
      JSON.stringify(requirements || []),
      JSON.stringify(steps || []),
      affiliate_url,
      is_featured ? 1 : 0,
      is_meta_safe !== undefined ? (is_meta_safe ? 1 : 0) : 1,
      status || 'active',
      sort_order || 0
    );

    const newDeal = db.prepare('SELECT * FROM deals WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ deal: newDeal });
  } catch (err) {
    console.error('Error creating deal:', err);
    res.status(500).json({ error: err.message || 'Failed to create deal' });
  }
});

// Update deal
app.put('/api/admin/deals/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    title, slug, category, summary, description, badge, payout_range,
    difficulty, payment_method, requirements, steps, affiliate_url,
    is_featured, is_meta_safe, status, sort_order
  } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM deals WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const update = db.prepare(`
      UPDATE deals SET
        title = ?,
        slug = ?,
        category = ?,
        summary = ?,
        description = ?,
        badge = ?,
        payout_range = ?,
        difficulty = ?,
        payment_method = ?,
        requirements = ?,
        steps = ?,
        affiliate_url = ?,
        is_featured = ?,
        is_meta_safe = ?,
        status = ?,
        sort_order = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);

    update.run(
      title !== undefined ? title : existing.title,
      slug !== undefined ? slug : existing.slug,
      category !== undefined ? category : existing.category,
      summary !== undefined ? summary : existing.summary,
      description !== undefined ? description : existing.description,
      badge !== undefined ? badge : existing.badge,
      payout_range !== undefined ? payout_range : existing.payout_range,
      difficulty !== undefined ? difficulty : existing.difficulty,
      payment_method !== undefined ? payment_method : existing.payment_method,
      requirements !== undefined ? JSON.stringify(requirements) : existing.requirements,
      steps !== undefined ? JSON.stringify(steps) : existing.steps,
      affiliate_url !== undefined ? affiliate_url : existing.affiliate_url,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      is_meta_safe !== undefined ? (is_meta_safe ? 1 : 0) : existing.is_meta_safe,
      status !== undefined ? status : existing.status,
      sort_order !== undefined ? sort_order : existing.sort_order,
      id
    );

    const updated = db.prepare('SELECT * FROM deals WHERE id = ?').get(id);
    res.json({ deal: updated });
  } catch (err) {
    console.error('Error updating deal:', err);
    res.status(500).json({ error: err.message || 'Failed to update deal' });
  }
});

// Delete deal
app.delete('/api/admin/deals/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM deals WHERE id = ?').run(id);
    res.json({ success: true, message: `Deal ${id} deleted` });
  } catch (err) {
    console.error('Error deleting deal:', err);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// Comprehensive Analytics Endpoint
app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  try {
    const totalClicks = db.prepare('SELECT COUNT(*) as count FROM clicks').get().count;
    const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT visitor_id) as count FROM clicks').get().count;
    const todayClicks = db.prepare("SELECT COUNT(*) as count FROM clicks WHERE date(created_at) = date('now')").get().count;

    // Top deals by clicks
    const topDeals = db.prepare(`
      SELECT d.id, d.title, d.category, d.click_count, COUNT(c.id) as tracked_clicks,
             COUNT(DISTINCT c.visitor_id) as unique_users
      FROM deals d
      LEFT JOIN clicks c ON d.id = c.deal_id
      GROUP BY d.id
      ORDER BY tracked_clicks DESC, d.click_count DESC
    `).all();

    // Source breakdown (UTM Sources & Referrers)
    const trafficSources = db.prepare(`
      SELECT
        CASE
          WHEN utm_source != '' AND utm_source IS NOT NULL THEN utm_source
          WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb%' THEN 'facebook'
          WHEN referrer LIKE '%instagram%' THEN 'instagram'
          WHEN referrer LIKE '%whatsapp%' THEN 'whatsapp'
          WHEN referrer != '' AND referrer IS NOT NULL THEN 'other_referral'
          ELSE 'direct'
        END as source_channel,
        COUNT(*) as clicks,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM clicks
      GROUP BY source_channel
      ORDER BY clicks DESC
    `).all();

    // Device breakdown
    const devices = db.prepare(`
      SELECT device_type, COUNT(*) as clicks
      FROM clicks
      GROUP BY device_type
      ORDER BY clicks DESC
    `).all();

    // Recent 50 clicks log
    const recentClicks = db.prepare(`
      SELECT c.*, d.title as deal_name
      FROM clicks c
      LEFT JOIN deals d ON c.deal_id = d.id
      ORDER BY c.created_at DESC
      LIMIT 50
    `).all();

    res.json({
      summary: {
        totalClicks,
        uniqueVisitors,
        todayClicks
      },
      topDeals,
      trafficSources,
      devices,
      recentClicks
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PesaDeals Backend] running on http://0.0.0.0:${PORT}`);
  console.log(`[PesaDeals Backend] Admin Key configured.`);
});
