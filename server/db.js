const { Pool } = require('pg');
const crypto = require('crypto');

// PostgreSQL connection (hosted Supabase or a local Postgres cluster)
// Use the pooler connection string (port 6543, transaction mode) for serverless
let currentConnectionString = process.env.SUPABASE_DB_URL
    || process.env.DATABASE_URL
    || process.env.POSTGRES_URL;

function determineSsl(connStr, sslFlag) {
    const flag = (sslFlag !== undefined && sslFlag !== null ? String(sslFlag) : (process.env.DB_SSL || '')).toLowerCase();
    const isLocalDb = /(^|@)(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(connStr || '');
    return ['1', 'true', 'yes', 'on', 'require'].includes(flag)
        || (!['0', 'false', 'no', 'off', 'disable'].includes(flag) && !isLocalDb);
}

function createPool(connStr, ssl) {
    const p = new Pool({
        connectionString: connStr,
        ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
        max: parseInt(process.env.DB_POOL_MAX || '5', 10),
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000
    });
    p.on('error', (err) => {
        console.error('Unexpected error on idle pg client:', err.message);
    });
    return p;
}

let pool = createPool(currentConnectionString, determineSsl(currentConnectionString));

function getConnectionInfo() {
    try {
        if (!currentConnectionString) {
            return { configured: false };
        }
        let parsed;
        try {
            parsed = new URL(currentConnectionString);
            return {
                configured: true,
                host: parsed.hostname,
                port: parsed.port || '5432',
                database: parsed.pathname.replace(/^\//, ''),
                user: parsed.username,
                ssl: determineSsl(currentConnectionString),
                maskedUrl: `${parsed.protocol}//${parsed.username}:••••••@${parsed.host}${parsed.pathname}`
            };
        } catch {
            return {
                configured: true,
                raw: true,
                maskedUrl: currentConnectionString.replace(/:([^@]+)@/, ':••••••@'),
                ssl: determineSsl(currentConnectionString)
            };
        }
    } catch (e) {
        return { configured: false, error: e.message };
    }
}

async function testConnection(testUrl, testSsl) {
    const ssl = testSsl !== undefined ? testSsl : determineSsl(testUrl);
    const testPool = new Pool({
        connectionString: testUrl,
        ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
        connectionTimeoutMillis: 8000
    });
    try {
        const res = await testPool.query('SELECT version(), current_database(), current_user');
        await testPool.end();
        return {
            success: true,
            version: res.rows[0].version,
            database: res.rows[0].current_database,
            user: res.rows[0].current_user
        };
    } catch (err) {
        try { await testPool.end(); } catch {}
        return { success: false, error: err.message };
    }
}

async function reconfigure(newConnectionString, newSsl) {
    const ssl = newSsl !== undefined ? newSsl : determineSsl(newConnectionString);
    const oldPool = pool;
    const oldConnStr = currentConnectionString;
    
    currentConnectionString = newConnectionString;
    pool = createPool(newConnectionString, ssl);
    dbInitPromise = null;

    const initResult = await ensureInitialized();
    if (!initResult.success) {
        // Rollback if initialization fails
        pool = oldPool;
        currentConnectionString = oldConnStr;
        dbInitPromise = null;
        return { success: false, error: initResult.error };
    }

    try {
        await oldPool.end();
    } catch (e) {
        console.error('Error ending previous pg pool:', e.message);
    }
    return { success: true };
}

let dbInitPromise = null;

function ensureInitialized() {
    if (!dbInitPromise) {
        dbInitPromise = (async () => {
            try {
                if (!currentConnectionString) {
                    throw new Error("SUPABASE_DB_URL / DATABASE_URL environment variable is not defined. Set your Supabase PostgreSQL connection string.");
                }

                // Create tables in Supabase PostgreSQL
                await pool.query(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        role TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS customers (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        phone TEXT NOT NULL,
                        email TEXT,
                        address TEXT,
                        location TEXT,
                        serial_no TEXT,
                        delivery_date TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS complaints (
                        id TEXT PRIMARY KEY,
                        customer_id TEXT REFERENCES customers(id),
                        item_name TEXT NOT NULL,
                        serial_no TEXT,
                        issue TEXT NOT NULL,
                        status TEXT NOT NULL DEFAULT 'Pending',
                        csr_number TEXT,
                        flag_ok BOOLEAN DEFAULT FALSE,
                        flag_r BOOLEAN DEFAULT FALSE,
                        flag_w BOOLEAN DEFAULT FALSE,
                        flag_p BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        service_type TEXT DEFAULT 'In-Shop',
                        service_mode TEXT DEFAULT 'On Center',
                        is_device_intaken INTEGER DEFAULT 1,
                        warranty_details TEXT,
                        warranty_status TEXT,
                        brand TEXT,
                        model TEXT,
                        password TEXT,
                        accessories TEXT
                    );
                    CREATE TABLE IF NOT EXISTS service_records (
                        id TEXT PRIMARY KEY,
                        complaint_id TEXT REFERENCES complaints(id),
                        technician TEXT,
                        issues TEXT,
                        resolution_status TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS status_logs (
                        id TEXT PRIMARY KEY,
                        complaint_id TEXT REFERENCES complaints(id),
                        status TEXT,
                        technician TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS invoices (
                        id TEXT PRIMARY KEY,
                        complaint_id TEXT REFERENCES complaints(id),
                        receipt_number TEXT,
                        service_fees REAL DEFAULT 0,
                        part_costs REAL DEFAULT 0,
                        total REAL DEFAULT 0,
                        spares TEXT,
                        warranty TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS settings (
                        setting_key TEXT PRIMARY KEY,
                        setting_value TEXT
                    );
                    CREATE TABLE IF NOT EXISTS notifications (
                        id TEXT PRIMARY KEY,
                        message TEXT NOT NULL,
                        complaint_id TEXT,
                        csr_number TEXT,
                        created_by TEXT,
                        is_read BOOLEAN DEFAULT false,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS inventory (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        part_number TEXT,
                        category TEXT DEFAULT 'General',
                        unit_price REAL DEFAULT 0,
                        cost_price REAL DEFAULT 0,
                        quantity INTEGER DEFAULT 0,
                        hsn_code TEXT DEFAULT '8473',
                        gst_rate REAL DEFAULT 18,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `);

                // Safely add columns if they don't exist
                try {
                    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS session_id TEXT;");
                    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS app_session_id TEXT;");
                } catch (err) {
                    console.error("Error adding session_id to users:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;");
                } catch (err) {
                    console.error("Error adding is_active to users:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'In-Shop';");
                } catch (err) {
                    console.error("Error adding service_type:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS warranty_details TEXT;");
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS warranty_status TEXT;");
                } catch (err) {
                    console.error("Error adding warranty fields:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS service_mode TEXT DEFAULT 'On Center';");
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS is_device_intaken INTEGER DEFAULT 1;");
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS created_by TEXT;");
                    
                    // Backfill created_by from status_logs for existing records
                    await pool.query(`
                        UPDATE complaints c
                        SET created_by = sl.technician
                        FROM status_logs sl
                        WHERE c.id = sl.complaint_id 
                        AND sl.status = 'Pending (Request Created)'
                        AND c.created_by IS NULL;
                    `);
                } catch (err) {
                    console.error("Error adding service request fields:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;");
                    await pool.query("ALTER TABLE customers ADD COLUMN IF NOT EXISTS location TEXT;");
                } catch (err) {
                    console.error("Error adding customer address/location columns:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS spares TEXT;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS warranty TEXT;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS proforma_number TEXT;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS taxable_amount REAL DEFAULT 0;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gst_rate REAL DEFAULT 18;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gst_type TEXT DEFAULT 'CGST_SGST';");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cgst_amount REAL DEFAULT 0;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sgst_amount REAL DEFAULT 0;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS igst_amount REAL DEFAULT 0;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS grand_total REAL DEFAULT 0;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_gstin TEXT;");
                    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_type TEXT DEFAULT 'Service Report';");
                } catch (err) {
                    console.error("Error adding invoice billing columns:", err.message);
                }

                // Seed sample inventory if empty
                try {
                    const invCountRes = await pool.query('SELECT COUNT(*) as count FROM inventory');
                    if (parseInt(invCountRes.rows[0]?.count || '0', 10) === 0) {
                        const defaultInventory = [
                            { name: '256GB SATA 2.5 SSD', part_number: 'SSD-SATA-256', category: 'Storage', unit_price: 1400, cost_price: 1050, quantity: 10, hsn_code: '8471', gst_rate: 18 },
                            { name: '512GB NVMe M.2 SSD', part_number: 'SSD-NVME-512', category: 'Storage', unit_price: 2600, cost_price: 1950, quantity: 8, hsn_code: '8471', gst_rate: 18 },
                            { name: '8GB DDR4 Laptop RAM (3200MHz)', part_number: 'RAM-DDR4-8G-L', category: 'Memory', unit_price: 1650, cost_price: 1250, quantity: 6, hsn_code: '8473', gst_rate: 18 },
                            { name: '8GB DDR4 Desktop RAM', part_number: 'RAM-DDR4-8G-D', category: 'Memory', unit_price: 1550, cost_price: 1150, quantity: 5, hsn_code: '8473', gst_rate: 18 },
                            { name: '15.6 FHD 30-Pin Laptop Screen', part_number: 'SCR-156-FHD', category: 'Laptop', unit_price: 4200, cost_price: 3300, quantity: 3, hsn_code: '8473', gst_rate: 18 },
                            { name: 'Universal Laptop Charger Adapter 65W', part_number: 'ADP-UNIV-65W', category: 'Laptop', unit_price: 850, cost_price: 550, quantity: 7, hsn_code: '8504', gst_rate: 18 },
                            { name: 'Laptop DC Power Jack Socket', part_number: 'JACK-DC-STD', category: 'Laptop', unit_price: 450, cost_price: 150, quantity: 15, hsn_code: '8473', gst_rate: 18 },
                            { name: 'SMPS 450W Desktop Power Supply', part_number: 'SMPS-450W', category: 'Desktop', unit_price: 1250, cost_price: 900, quantity: 4, hsn_code: '8504', gst_rate: 18 },
                            { name: 'Canon 12A / HP 1005 Toner Cartridge', part_number: 'CART-12A', category: 'Printer', unit_price: 750, cost_price: 450, quantity: 10, hsn_code: '8443', gst_rate: 18 },
                            { name: 'High-Performance Thermal Paste (Tube)', part_number: 'THM-PASTE-TUBE', category: 'Accessories', unit_price: 250, cost_price: 90, quantity: 20, hsn_code: '3824', gst_rate: 18 }
                        ];
                        for (const item of defaultInventory) {
                            await pool.query(
                                'INSERT INTO inventory (id, name, part_number, category, unit_price, cost_price, quantity, hsn_code, gst_rate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                                [crypto.randomUUID(), item.name, item.part_number, item.category, item.unit_price, item.cost_price, item.quantity, item.hsn_code, item.gst_rate]
                            );
                        }
                        console.log('Default inventory items seeded.');
                    }
                } catch (err) {
                    console.error("Error seeding inventory:", err.message);
                }

                try {
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS brand TEXT;");
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS model TEXT;");
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS password TEXT;");
                    await pool.query("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS accessories TEXT;");
                } catch (err) {
                    console.error("Error adding device detail columns:", err.message);
                }

                // Initialize default admin
                const adminUserRes = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
                if (adminUserRes.rows.length === 0) {
                    await pool.query('INSERT INTO users (id, username, password, role) VALUES ($1, $2, $3, $4)', [
                        crypto.randomUUID(), 'admin', 'password123', 'ADMIN'
                    ]);
                    console.log('Default admin user created.');
                }
                
                console.log("Supabase database schema checked and initialized.");
                return { success: true };
            } catch (err) {
                console.error("Database initialization failed:", err.message);
                return { success: false, error: err.message };
            }
        })();
    }
    return dbInitPromise;
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    ensureInitialized,
    getConnectionInfo,
    testConnection,
    reconfigure,
    determineSsl
};
