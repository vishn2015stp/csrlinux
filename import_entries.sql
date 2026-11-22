-- Import 76 records into Hyper-CSR (PostgreSQL)
-- Safe to re-run: skips existing records based on CSR number.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7736357219' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'shrilal', '7736357219', '2025-05-05 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '6194') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'WD 1 TB HDD', 'WD 1 TB HDD', 'Return', '6194',
            '2025-05-05 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-05-05 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9074505746' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'prasad', '9074505746', '2025-05-07 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '6835') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp laptop dead', 'hp laptop dead', 'Ready', '6835',
            '2025-05-07 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2025-05-07 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9539367209' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'abraham', '9539367209', '2025-02-08 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7124') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp deskjet ink advantage 2778 not printing', 'hp deskjet ink advantage 2778 not printing', 'Pending', '7124',
            '2025-02-08 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2025-02-08 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '6238389396' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'ajithkumar', '6238389396', '2025-04-09 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7130') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus laptop dead', 'asus laptop dead', 'Return', '7130',
            '2025-04-09 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-04-09 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9497149927' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'reena', '9497149927', '2025-08-09 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7132') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus laptop dead hinges broken', 'asus laptop dead hinges broken', 'Return', '7132',
            '2025-08-09 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-08-09 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9387888000' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'kumar', '9387888000', '2025-09-18 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7177') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus laptop dead', 'asus laptop dead', 'Return', '7177',
            '2025-09-18 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-09-18 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8281785594' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'mary dasan', '8281785594', '2025-09-29 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7610') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'brother printer checking', 'brother printer checking', 'Pending', '7610',
            '2025-09-29 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2025-09-29 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    v_cust_id := NULL;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'royal force', '', '2025-10-22 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7208') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'lenevo laptop dead', 'lenevo laptop dead', 'Return', '7208',
            '2025-10-22 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-10-22 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8281455465' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'dulcy', '8281455465', '2025-01-11 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7733') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'acer aspire display+kb+battery', 'acer aspire display+kb+battery', 'Return', '7733',
            '2025-01-11 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-01-11 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9809851039' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'vishnu vishvandh', '9809851039', '2025-10-11 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7756') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc dead condition', 'pc dead condition', 'Pending', '7756',
            '2025-10-11 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2025-10-11 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9447265724' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'suresh kumar', '9447265724', '2025-11-11 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7760') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, '12 a toner refill', '12 a toner refill', 'Pending', '7760',
            '2025-11-11 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2025-11-11 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7012149879' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'vinod  babu', '7012149879', '2025-11-12 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7768') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp laptop dead condition', 'hp laptop dead condition', 'Return', '7768',
            '2025-11-12 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-11-12 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9633553589' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'lal', '9633553589', '2025-11-14 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7773') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp deskjet 2700 print not coming', 'hp deskjet 2700 print not coming', 'Pending', '7773',
            '2025-11-14 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2025-11-14 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9995848555' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'all season', '9995848555', '2025-11-15 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7777') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hikvision sn fr9252035', 'hikvision sn fr9252035', 'Return', '7777',
            '2025-11-15 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-11-15 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9483522977' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'mathu', '9483522977', '2025-11-22 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7804') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell pc dead', 'dell pc dead', 'Pending', '7804',
            '2025-11-22 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2025-11-22 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9446942288' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'bsnl', '9446942288', '2025-03-12 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7832') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'ddr 3 consistant ram 8gb 2 pcs', 'ddr 3 consistant ram 8gb 2 pcs', 'Return', '7832',
            '2025-03-12 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-03-12 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9387262608' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'anoop', '9387262608', '2025-12-31 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7911') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell laptop dead', 'dell laptop dead', 'Return', '7911',
            '2025-12-31 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2025-12-31 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8921433942' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'madhu', '8921433942', '2026-07-01 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7927') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'acer desktop not on', 'acer desktop not on', 'Pending', '7927',
            '2026-07-01 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-07-01 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7994010948' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'aslam', '7994010948', '2026-01-13 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7951') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc flickering', 'pc flickering', 'Ready', '7951',
            '2026-01-13 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-01-13 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7356507790' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'bala gopal', '7356507790', '2026-01-19 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7964') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell laptop dead condition', 'dell laptop dead condition', 'Return', '7964',
            '2026-01-19 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-01-19 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9895579085' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'seeba', '9895579085', '2026-01-20 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7968') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'canon g3010 not printing', 'canon g3010 not printing', 'Pending', '7968',
            '2026-01-20 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-01-20 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9947806715' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'sam', '9947806715', '2026-01-28 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7992') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc dead condition', 'pc dead condition', 'Pending', '7992',
            '2026-01-28 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-01-28 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9746725170' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'sini raj', '9746725170', '2026-01-31 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7306') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp deskjet1112 not printing', 'hp deskjet1112 not printing', 'Pending', '7306',
            '2026-01-31 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-01-31 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8086194391' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'vishnu', '8086194391', '2026-04-02 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7315') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp 515 ink tank print not working', 'hp 515 ink tank print not working', 'Return', '7315',
            '2026-04-02 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-04-02 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9447699360' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'shivadas', '9447699360', '2026-09-02 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7327') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc autometic restart', 'pc autometic restart', 'Pending', '7327',
            '2026-09-02 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-09-02 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9847318472' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'thumbi', '9847318472', '2026-09-03 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7375') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell mouse warrenty', 'dell mouse warrenty', 'Return', '7375',
            '2026-09-03 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-09-03 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8111956231' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'rafi', '8111956231', '2026-03-19 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7396') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'canon g3010 printer shade', 'canon g3010 printer shade', 'Pending', '7396',
            '2026-03-19 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-03-19 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9461112447' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Sebastian', '9461112447', '2026-03-21 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7437') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'acer laptop dead condition', 'acer laptop dead condition', 'Return', '7437',
            '2026-03-21 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-03-21 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7994690465' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'nirmala thomus', '7994690465', '2026-11-04 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7483') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell laptop completlydead condition', 'dell laptop completlydead condition', 'Return', '7483',
            '2026-11-04 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-11-04 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9895208345' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'deepu', '9895208345', '2026-04-22 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '7498') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'epson l130 printer only', 'epson l130 printer only', 'Return', '7498',
            '2026-04-22 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-04-22 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9846004824' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'thabil', '9846004824', '2026-05-14 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8054') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'acer laptop dead condition', 'acer laptop dead condition', 'Ready', '8054',
            '2026-05-14 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-05-14 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8848643422' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'vignesh', '8848643422', '2026-01-06 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8105') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus tuf dead condition ligth blink only', 'asus tuf dead condition ligth blink only', 'Pending', '8105',
            '2026-01-06 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-01-06 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9847402204' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'thrikaruva panchayathu', '9847402204', '2026-06-06 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8123') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'toner refill', 'toner refill', 'Pending', '8123',
            '2026-06-06 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-06-06 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9895777752' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'sabu', '9895777752', '2026-12-06 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8139') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'l3150 print error', 'l3150 print error', 'Return', '8139',
            '2026-12-06 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-12-06 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9446796505' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'pramoth', '9446796505', '2026-06-27 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8195') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp laptop ssd add and customer products add', 'hp laptop ssd add and customer products add', 'Return', '8195',
            '2026-06-27 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-06-27 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9497134642' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'shajudheen', '9497134642', '2026-02-07 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8211') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc os eroor', 'pc os eroor', 'Pending', '8211',
            '2026-02-07 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-02-07 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7306056197' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'n ramachandran', '7306056197', '2026-06-07 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8221') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp printer e3 error', 'hp printer e3 error', 'Pending', '8221',
            '2026-06-07 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-06-07 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9633971823' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'anilkumar', '9633971823', '2026-07-18 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8267') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc not booting divice', 'pc not booting divice', 'Pending', '8267',
            '2026-07-18 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-07-18 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7994120294' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'nevin', '7994120294', '2026-11-08 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8346') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell laptop dead condition', 'dell laptop dead condition', 'Return', '8346',
            '2026-11-08 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-11-08 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8129240891' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'nidheesh', '8129240891', '2026-08-17 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8358') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc dead condition warrenty', 'pc dead condition warrenty', 'Warranty', '8358',
            '2026-08-17 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Warranty', 'admin', '2026-08-17 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8714429686' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'vipin', '8714429686', '2026-07-09 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8397') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'desktop pc dead', 'desktop pc dead', 'Ready', '8397',
            '2026-07-09 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-07-09 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9547640178' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'hasinar', '9547640178', '2026-09-22 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8450') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hapipola wave warrenty', 'hapipola wave warrenty', 'Warranty', '8450',
            '2026-09-22 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Warranty', 'admin', '2026-09-22 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7306710661' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'surya', '7306710661', '2026-09-24 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8457') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc os install', 'pc os install', 'Ready', '8457',
            '2026-09-24 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-09-24 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9744552240' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'jd lsgd kollam', '9744552240', '2026-09-25 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8458') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp 2 laptop dell laptop hp pc dead', 'hp 2 laptop dell laptop hp pc dead', 'Return', '8458',
            '2026-09-25 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-09-25 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9074444639' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'sharath', '9074444639', '2026-09-26 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8469') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'cpu asrock rx570 8 gb warrenty', 'cpu asrock rx570 8 gb warrenty', 'Warranty', '8469',
            '2026-09-26 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Warranty', 'admin', '2026-09-26 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8921521603' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'karthik', '8921521603', '2026-10-03 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8493') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'alieanwear laptop dead condition', 'alieanwear laptop dead condition', 'Pending', '8493',
            '2026-10-03 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-10-03 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7356312668' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'prasandh', '7356312668', '2026-10-08 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8606') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'canon lbp2900 b sound problem', 'canon lbp2900 b sound problem', 'Return', '8606',
            '2026-10-08 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-10-08 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    v_cust_id := NULL;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'matha medicals', '', '2026-10-14 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8624') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc dead condition', 'pc dead condition', 'Waiting for Reply', '8624',
            '2026-10-14 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Waiting for Reply', 'admin', '2026-10-14 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7025746427' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'hari kumar', '7025746427', '2026-10-15 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8627') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'zebronics ups not turn on', 'zebronics ups not turn on', 'Ready', '8627',
            '2026-10-15 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-10-15 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9847286934' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'ajas', '9847286934', '2026-10-16 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8631') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'dell 3540 not turn on', 'dell 3540 not turn on', 'Return', '8631',
            '2026-10-16 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-10-16 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9048509266' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'rahul', '9048509266', '2026-10-17 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8636') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc sometimes off full cleaning', 'pc sometimes off full cleaning', 'Pending', '8636',
            '2026-10-17 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-10-17 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8137852252' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'amal', '8137852252', '2026-10-22 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8644') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'lenevo g5070  not on', 'lenevo g5070  not on', 'Return', '8644',
            '2026-10-22 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-10-22 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9526222266' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'benojoy', '9526222266', '2026-10-23 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8651') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'desktop pc dead board warrenty', 'desktop pc dead board warrenty', 'Warranty', '8651',
            '2026-10-23 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Warranty', 'admin', '2026-10-23 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9387269381' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'jayakumar', '9387269381', '2026-10-27 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8666') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'epson m1100 lines issue', 'epson m1100 lines issue', 'Return', '8666',
            '2026-10-27 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-10-27 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9072736242' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'vishnu thankchan', '9072736242', '2026-10-29 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8676') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'desktop pc not display', 'desktop pc not display', 'Warranty', '8676',
            '2026-10-29 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Warranty', 'admin', '2026-10-29 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7558847575' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'fayas si', '7558847575', '2026-11-04 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8688') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus v16 not charging', 'asus v16 not charging', 'Ready', '8688',
            '2026-11-04 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-11-04 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9619865406' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'arun', '9619865406', '2026-11-04 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8689') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp laserjet p1108 and hp inktank 416 dead', 'hp laserjet p1108 and hp inktank 416 dead', 'Pending', '8689',
            '2026-11-04 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-11-04 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8089212399' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Mahesh', '8089212399', '2026-11-06 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8694') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Dell 5420 Not On  Laptop with adaptor and power cable', 'Dell 5420 Not On  Laptop with adaptor and power cable', 'Waiting for Reply', '8694',
            '2026-11-06 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Waiting for Reply', 'admin', '2026-11-06 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9895899096' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Harbour Engineering Asramom', '9895899096', '2026-11-09 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8698') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Hp laserjet 1005 not printing', 'Hp laserjet 1005 not printing', 'Pending', '8698',
            '2026-11-09 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-11-09 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9895433882' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Sagar', '9895433882', '2026-11-10 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8702') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Hp pavillion dead laptop without adaptor & Power cable', 'Hp pavillion dead laptop without adaptor & Power cable', 'Pending', '8702',
            '2026-11-10 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-11-10 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9497767456' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Kailas', '9497767456', '2026-11-10 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8706') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Desktop PC dead', 'Desktop PC dead', 'Ready', '8706',
            '2026-11-10 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-11-10 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7386221220' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'thanooj', '7386221220', '2026-11-14 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8720') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'lenovo v330 ssd problem', 'lenovo v330 ssd problem', 'Waiting for Reply', '8720',
            '2026-11-14 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Waiting for Reply', 'admin', '2026-11-14 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9497780045' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Unknown Customer', '9497780045', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8722') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp smart tank 585 not printing', 'hp smart tank 585 not printing', 'Return', '8722',
            '2026-11-16 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9207999654' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Karma Acadamy', '9207999654', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8725') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'desktop pc', 'desktop pc', 'Return', '8725',
            '2026-11-16 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9961162957' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'syama', '9961162957', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8723') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus x505 dead', 'asus x505 dead', 'Ready', '8723',
            '2026-11-16 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9447185428' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'bindu', '9447185428', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8724') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'asus tuff dead', 'asus tuff dead', 'Delivered', '8724',
            '2026-11-16 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Delivered', 'admin', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '920799954' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'karma acadamy', '920799954', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8725') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'pc dead', 'pc dead', 'Return', '8725',
            '2026-11-16 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Return', 'admin', '2026-11-16 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9746603730' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Any Rachel Varghese', '9746603730', '2026-11-17 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8727') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Lapcare Monitor', 'Lapcare Monitor', 'Warranty', '8727',
            '2026-11-17 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Warranty', 'admin', '2026-11-17 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9562186767' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Neethu', '9562186767', '2026-11-17 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8728') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'HP 15 FQ dead', 'HP 15 FQ dead', 'Ready', '8728',
            '2026-11-17 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-11-17 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7510266821' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'jose johan', '7510266821', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8733') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Acer lapto dead', 'Acer lapto dead', 'Pending', '8733',
            '2026-11-19 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '7994734344' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Pradeep', '7994734344', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8737') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Hplap speakee complaint', 'Hplap speakee complaint', 'Delivered', '8737',
            '2026-11-19 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Delivered', 'admin', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8590022340' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Biju', '8590022340', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8738') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Pc serial card error', 'Pc serial card error', 'Ready', '8738',
            '2026-11-19 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '8075261692' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'Gayathri', '8075261692', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8739') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'Acer laptop Hinges', 'Acer laptop Hinges', 'Delivered', '8739',
            '2026-11-19 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Delivered', 'admin', '2026-11-19 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '83001011870' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'sona', '83001011870', '2026-11-20 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8740') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'hp software', 'hp software', 'Ready', '8740',
            '2026-11-20 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Ready', 'admin', '2026-11-20 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9447090238' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'sethu prakash', '9447090238', '2026-11-20 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8741') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'canon mf 3010 not printing', 'canon mf 3010 not printing', 'Pending', '8741',
            '2026-11-20 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Pending', 'admin', '2026-11-20 10:00:00'::TIMESTAMP);
    END IF;
END $$;
DO $$
DECLARE
    v_cust_id TEXT;
    v_comp_id TEXT;
BEGIN
    SELECT id INTO v_cust_id FROM customers WHERE phone = '9446835911' LIMIT 1;
    IF v_cust_id IS NULL THEN
        v_cust_id := gen_random_uuid()::TEXT;
        INSERT INTO customers (id, name, phone, created_at)
        VALUES (v_cust_id, 'LALU', '9446835911', '2026-11-21 10:00:00'::TIMESTAMP);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM complaints WHERE csr_number = '8742') THEN
        v_comp_id := gen_random_uuid()::TEXT;
        INSERT INTO complaints (
            id, customer_id, item_name, issue, status, csr_number,
            created_at, service_type, service_mode, is_device_intaken, created_by
        ) VALUES (
            v_comp_id, v_cust_id, 'LENOVO KEYBOARD', 'LENOVO KEYBOARD', 'Delivered', '8742',
            '2026-11-21 10:00:00'::TIMESTAMP, 'In-Shop', 'On Center', 1, 'admin'
        );

        INSERT INTO status_logs (id, complaint_id, status, technician, created_at)
        VALUES (gen_random_uuid()::TEXT, v_comp_id, 'Delivered', 'admin', '2026-11-21 10:00:00'::TIMESTAMP);
    END IF;
END $$;

COMMIT;
