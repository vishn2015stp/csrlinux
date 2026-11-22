require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const db = require('../server/db.js');
const crypto = require('crypto');

const records = [
  {
    "slNo": "1",
    "createdAt": "2025-05-05 10:00:00",
    "csrNo": "6194",
    "custName": "shrilal",
    "mobile": "7736357219",
    "productComplaint": "WD 1 TB HDD",
    "status": "Return"
  },
  {
    "slNo": "2",
    "createdAt": "2025-05-07 10:00:00",
    "csrNo": "6835",
    "custName": "prasad",
    "mobile": "9074505746",
    "productComplaint": "hp laptop dead",
    "status": "Ready"
  },
  {
    "slNo": "3",
    "createdAt": "2025-02-08 10:00:00",
    "csrNo": "7124",
    "custName": "abraham",
    "mobile": "9539367209",
    "productComplaint": "hp deskjet ink advantage 2778 not printing",
    "status": "Pending"
  },
  {
    "slNo": "4",
    "createdAt": "2025-04-09 10:00:00",
    "csrNo": "7130",
    "custName": "ajithkumar",
    "mobile": "6238389396",
    "productComplaint": "asus laptop dead",
    "status": "Return"
  },
  {
    "slNo": "5",
    "createdAt": "2025-08-09 10:00:00",
    "csrNo": "7132",
    "custName": "reena",
    "mobile": "9497149927",
    "productComplaint": "asus laptop dead hinges broken",
    "status": "Return"
  },
  {
    "slNo": "6",
    "createdAt": "2025-09-18 10:00:00",
    "csrNo": "7177",
    "custName": "kumar",
    "mobile": "9387888000",
    "productComplaint": "asus laptop dead",
    "status": "Return"
  },
  {
    "slNo": "7",
    "createdAt": "2025-09-29 10:00:00",
    "csrNo": "7610",
    "custName": "mary dasan",
    "mobile": "8281785594",
    "productComplaint": "brother printer checking",
    "status": "Pending"
  },
  {
    "slNo": "8",
    "createdAt": "2025-10-22 10:00:00",
    "csrNo": "7208",
    "custName": "royal force",
    "mobile": "",
    "productComplaint": "lenevo laptop dead",
    "status": "Return"
  },
  {
    "slNo": "9",
    "createdAt": "2025-01-11 10:00:00",
    "csrNo": "7733",
    "custName": "dulcy",
    "mobile": "8281455465",
    "productComplaint": "acer aspire display+kb+battery",
    "status": "Return"
  },
  {
    "slNo": "10",
    "createdAt": "2025-10-11 10:00:00",
    "csrNo": "7756",
    "custName": "vishnu vishvandh",
    "mobile": "9809851039",
    "productComplaint": "pc dead condition",
    "status": "Pending"
  },
  {
    "slNo": "11",
    "createdAt": "2025-11-11 10:00:00",
    "csrNo": "7760",
    "custName": "suresh kumar",
    "mobile": "9447265724",
    "productComplaint": "12 a toner refill",
    "status": "Pending"
  },
  {
    "slNo": "12",
    "createdAt": "2025-11-12 10:00:00",
    "csrNo": "7768",
    "custName": "vinod  babu",
    "mobile": "7012149879",
    "productComplaint": "hp laptop dead condition",
    "status": "Return"
  },
  {
    "slNo": "13",
    "createdAt": "2025-11-14 10:00:00",
    "csrNo": "7773",
    "custName": "lal",
    "mobile": "9633553589",
    "productComplaint": "hp deskjet 2700 print not coming",
    "status": "Pending"
  },
  {
    "slNo": "14",
    "createdAt": "2025-11-15 10:00:00",
    "csrNo": "7777",
    "custName": "all season",
    "mobile": "9995848555",
    "productComplaint": "hikvision sn fr9252035",
    "status": "Return"
  },
  {
    "slNo": "15",
    "createdAt": "2025-11-22 10:00:00",
    "csrNo": "7804",
    "custName": "mathu",
    "mobile": "9483522977",
    "productComplaint": "dell pc dead",
    "status": "Pending"
  },
  {
    "slNo": "16",
    "createdAt": "2025-03-12 10:00:00",
    "csrNo": "7832",
    "custName": "bsnl",
    "mobile": "9446942288",
    "productComplaint": "ddr 3 consistant ram 8gb 2 pcs",
    "status": "Return"
  },
  {
    "slNo": "17",
    "createdAt": "2025-12-31 10:00:00",
    "csrNo": "7911",
    "custName": "anoop",
    "mobile": "9387262608",
    "productComplaint": "dell laptop dead",
    "status": "Return"
  },
  {
    "slNo": "18",
    "createdAt": "2026-07-01 10:00:00",
    "csrNo": "7927",
    "custName": "madhu",
    "mobile": "8921433942",
    "productComplaint": "acer desktop not on",
    "status": "Pending"
  },
  {
    "slNo": "19",
    "createdAt": "2026-01-13 10:00:00",
    "csrNo": "7951",
    "custName": "aslam",
    "mobile": "7994010948",
    "productComplaint": "pc flickering",
    "status": "Ready"
  },
  {
    "slNo": "20",
    "createdAt": "2026-01-19 10:00:00",
    "csrNo": "7964",
    "custName": "bala gopal",
    "mobile": "7356507790",
    "productComplaint": "dell laptop dead condition",
    "status": "Return"
  },
  {
    "slNo": "21",
    "createdAt": "2026-01-20 10:00:00",
    "csrNo": "7968",
    "custName": "seeba",
    "mobile": "9895579085",
    "productComplaint": "canon g3010 not printing",
    "status": "Pending"
  },
  {
    "slNo": "22",
    "createdAt": "2026-01-28 10:00:00",
    "csrNo": "7992",
    "custName": "sam",
    "mobile": "9947806715",
    "productComplaint": "pc dead condition",
    "status": "Pending"
  },
  {
    "slNo": "23",
    "createdAt": "2026-01-31 10:00:00",
    "csrNo": "7306",
    "custName": "sini raj",
    "mobile": "9746725170",
    "productComplaint": "hp deskjet1112 not printing",
    "status": "Pending"
  },
  {
    "slNo": "24",
    "createdAt": "2026-04-02 10:00:00",
    "csrNo": "7315",
    "custName": "vishnu",
    "mobile": "8086194391",
    "productComplaint": "hp 515 ink tank print not working",
    "status": "Return"
  },
  {
    "slNo": "25",
    "createdAt": "2026-09-02 10:00:00",
    "csrNo": "7327",
    "custName": "shivadas",
    "mobile": "9447699360",
    "productComplaint": "pc autometic restart",
    "status": "Pending"
  },
  {
    "slNo": "26",
    "createdAt": "2026-09-03 10:00:00",
    "csrNo": "7375",
    "custName": "thumbi",
    "mobile": "9847318472",
    "productComplaint": "dell mouse warrenty",
    "status": "Return"
  },
  {
    "slNo": "27",
    "createdAt": "2026-03-19 10:00:00",
    "csrNo": "7396",
    "custName": "rafi",
    "mobile": "8111956231",
    "productComplaint": "canon g3010 printer shade",
    "status": "Pending"
  },
  {
    "slNo": "28",
    "createdAt": "2026-03-21 10:00:00",
    "csrNo": "7437",
    "custName": "Sebastian",
    "mobile": "9461112447",
    "productComplaint": "acer laptop dead condition",
    "status": "Return"
  },
  {
    "slNo": "29",
    "createdAt": "2026-11-04 10:00:00",
    "csrNo": "7483",
    "custName": "nirmala thomus",
    "mobile": "7994690465",
    "productComplaint": "dell laptop completlydead condition",
    "status": "Return"
  },
  {
    "slNo": "30",
    "createdAt": "2026-04-22 10:00:00",
    "csrNo": "7498",
    "custName": "deepu",
    "mobile": "9895208345",
    "productComplaint": "epson l130 printer only",
    "status": "Return"
  },
  {
    "slNo": "31",
    "createdAt": "2026-05-14 10:00:00",
    "csrNo": "8054",
    "custName": "thabil",
    "mobile": "9846004824",
    "productComplaint": "acer laptop dead condition",
    "status": "Ready"
  },
  {
    "slNo": "32",
    "createdAt": "2026-01-06 10:00:00",
    "csrNo": "8105",
    "custName": "vignesh",
    "mobile": "8848643422",
    "productComplaint": "asus tuf dead condition ligth blink only",
    "status": "Pending"
  },
  {
    "slNo": "33",
    "createdAt": "2026-06-06 10:00:00",
    "csrNo": "8123",
    "custName": "thrikaruva panchayathu",
    "mobile": "9847402204",
    "productComplaint": "toner refill",
    "status": "Pending"
  },
  {
    "slNo": "34",
    "createdAt": "2026-12-06 10:00:00",
    "csrNo": "8139",
    "custName": "sabu",
    "mobile": "9895777752",
    "productComplaint": "l3150 print error",
    "status": "Return"
  },
  {
    "slNo": "35",
    "createdAt": "2026-06-27 10:00:00",
    "csrNo": "8195",
    "custName": "pramoth",
    "mobile": "9446796505",
    "productComplaint": "hp laptop ssd add and customer products add",
    "status": "Return"
  },
  {
    "slNo": "36",
    "createdAt": "2026-02-07 10:00:00",
    "csrNo": "8211",
    "custName": "shajudheen",
    "mobile": "9497134642",
    "productComplaint": "pc os eroor",
    "status": "Pending"
  },
  {
    "slNo": "37",
    "createdAt": "2026-06-07 10:00:00",
    "csrNo": "8221",
    "custName": "n ramachandran",
    "mobile": "7306056197",
    "productComplaint": "hp printer e3 error",
    "status": "Pending"
  },
  {
    "slNo": "38",
    "createdAt": "2026-07-18 10:00:00",
    "csrNo": "8267",
    "custName": "anilkumar",
    "mobile": "9633971823",
    "productComplaint": "pc not booting divice",
    "status": "Pending"
  },
  {
    "slNo": "39",
    "createdAt": "2026-11-08 10:00:00",
    "csrNo": "8346",
    "custName": "nevin",
    "mobile": "7994120294",
    "productComplaint": "dell laptop dead condition",
    "status": "Return"
  },
  {
    "slNo": "40",
    "createdAt": "2026-08-17 10:00:00",
    "csrNo": "8358",
    "custName": "nidheesh",
    "mobile": "8129240891",
    "productComplaint": "pc dead condition warrenty",
    "status": "Warranty"
  },
  {
    "slNo": "41",
    "createdAt": "2026-07-09 10:00:00",
    "csrNo": "8397",
    "custName": "vipin",
    "mobile": "8714429686",
    "productComplaint": "desktop pc dead",
    "status": "Ready"
  },
  {
    "slNo": "42",
    "createdAt": "2026-09-22 10:00:00",
    "csrNo": "8450",
    "custName": "hasinar",
    "mobile": "9547640178",
    "productComplaint": "hapipola wave warrenty",
    "status": "Warranty"
  },
  {
    "slNo": "43",
    "createdAt": "2026-09-24 10:00:00",
    "csrNo": "8457",
    "custName": "surya",
    "mobile": "7306710661",
    "productComplaint": "pc os install",
    "status": "Ready"
  },
  {
    "slNo": "44",
    "createdAt": "2026-09-25 10:00:00",
    "csrNo": "8458",
    "custName": "jd lsgd kollam",
    "mobile": "9744552240",
    "productComplaint": "hp 2 laptop dell laptop hp pc dead",
    "status": "Return"
  },
  {
    "slNo": "45",
    "createdAt": "2026-09-26 10:00:00",
    "csrNo": "8469",
    "custName": "sharath",
    "mobile": "9074444639",
    "productComplaint": "cpu asrock rx570 8 gb warrenty",
    "status": "Warranty"
  },
  {
    "slNo": "46",
    "createdAt": "2026-10-03 10:00:00",
    "csrNo": "8493",
    "custName": "karthik",
    "mobile": "8921521603",
    "productComplaint": "alieanwear laptop dead condition",
    "status": "Pending"
  },
  {
    "slNo": "47",
    "createdAt": "2026-10-08 10:00:00",
    "csrNo": "8606",
    "custName": "prasandh",
    "mobile": "7356312668",
    "productComplaint": "canon lbp2900 b sound problem",
    "status": "Return"
  },
  {
    "slNo": "48",
    "createdAt": "2026-10-14 10:00:00",
    "csrNo": "8624",
    "custName": "matha medicals",
    "mobile": "",
    "productComplaint": "pc dead condition",
    "status": "Waiting for Reply"
  },
  {
    "slNo": "49",
    "createdAt": "2026-10-15 10:00:00",
    "csrNo": "8627",
    "custName": "hari kumar",
    "mobile": "7025746427",
    "productComplaint": "zebronics ups not turn on",
    "status": "Ready"
  },
  {
    "slNo": "50",
    "createdAt": "2026-10-16 10:00:00",
    "csrNo": "8631",
    "custName": "ajas",
    "mobile": "9847286934",
    "productComplaint": "dell 3540 not turn on",
    "status": "Return"
  },
  {
    "slNo": "51",
    "createdAt": "2026-10-17 10:00:00",
    "csrNo": "8636",
    "custName": "rahul",
    "mobile": "9048509266",
    "productComplaint": "pc sometimes off full cleaning",
    "status": "Pending"
  },
  {
    "slNo": "52",
    "createdAt": "2026-10-22 10:00:00",
    "csrNo": "8644",
    "custName": "amal",
    "mobile": "8137852252",
    "productComplaint": "lenevo g5070  not on",
    "status": "Return"
  },
  {
    "slNo": "53",
    "createdAt": "2026-10-23 10:00:00",
    "csrNo": "8651",
    "custName": "benojoy",
    "mobile": "9526222266",
    "productComplaint": "desktop pc dead board warrenty",
    "status": "Warranty"
  },
  {
    "slNo": "54",
    "createdAt": "2026-10-27 10:00:00",
    "csrNo": "8666",
    "custName": "jayakumar",
    "mobile": "9387269381",
    "productComplaint": "epson m1100 lines issue",
    "status": "Return"
  },
  {
    "slNo": "55",
    "createdAt": "2026-10-29 10:00:00",
    "csrNo": "8676",
    "custName": "vishnu thankchan",
    "mobile": "9072736242",
    "productComplaint": "desktop pc not display",
    "status": "Warranty"
  },
  {
    "slNo": "56",
    "createdAt": "2026-11-04 10:00:00",
    "csrNo": "8688",
    "custName": "fayas si",
    "mobile": "7558847575",
    "productComplaint": "asus v16 not charging",
    "status": "Ready"
  },
  {
    "slNo": "57",
    "createdAt": "2026-11-04 10:00:00",
    "csrNo": "8689",
    "custName": "arun",
    "mobile": "9619865406",
    "productComplaint": "hp laserjet p1108 and hp inktank 416 dead",
    "status": "Pending"
  },
  {
    "slNo": "58",
    "createdAt": "2026-11-06 10:00:00",
    "csrNo": "8694",
    "custName": "Mahesh",
    "mobile": "8089212399",
    "productComplaint": "Dell 5420 Not On  Laptop with adaptor and power cable",
    "status": "Waiting for Reply"
  },
  {
    "slNo": "59",
    "createdAt": "2026-11-09 10:00:00",
    "csrNo": "8698",
    "custName": "Harbour Engineering Asramom",
    "mobile": "9895899096",
    "productComplaint": "Hp laserjet 1005 not printing",
    "status": "Pending"
  },
  {
    "slNo": "60",
    "createdAt": "2026-11-10 10:00:00",
    "csrNo": "8702",
    "custName": "Sagar",
    "mobile": "9895433882",
    "productComplaint": "Hp pavillion dead laptop without adaptor & Power cable",
    "status": "Pending"
  },
  {
    "slNo": "61",
    "createdAt": "2026-11-10 10:00:00",
    "csrNo": "8706",
    "custName": "Kailas",
    "mobile": "9497767456",
    "productComplaint": "Desktop PC dead",
    "status": "Ready"
  },
  {
    "slNo": "62",
    "createdAt": "2026-11-14 10:00:00",
    "csrNo": "8720",
    "custName": "thanooj",
    "mobile": "7386221220",
    "productComplaint": "lenovo v330 ssd problem",
    "status": "Waiting for Reply"
  },
  {
    "slNo": "63",
    "createdAt": "2026-11-16 10:00:00",
    "csrNo": "8722",
    "custName": "Unknown Customer",
    "mobile": "9497780045",
    "productComplaint": "hp smart tank 585 not printing",
    "status": "Return"
  },
  {
    "slNo": "64",
    "createdAt": "2026-11-16 10:00:00",
    "csrNo": "8725",
    "custName": "Karma Acadamy",
    "mobile": "9207999654",
    "productComplaint": "desktop pc",
    "status": "Return"
  },
  {
    "slNo": "65",
    "createdAt": "2026-11-16 10:00:00",
    "csrNo": "8723",
    "custName": "syama",
    "mobile": "9961162957",
    "productComplaint": "asus x505 dead",
    "status": "Ready"
  },
  {
    "slNo": "66",
    "createdAt": "2026-11-16 10:00:00",
    "csrNo": "8724",
    "custName": "bindu",
    "mobile": "9447185428",
    "productComplaint": "asus tuff dead",
    "status": "Delivered"
  },
  {
    "slNo": "67",
    "createdAt": "2026-11-16 10:00:00",
    "csrNo": "8725",
    "custName": "karma acadamy",
    "mobile": "920799954",
    "productComplaint": "pc dead",
    "status": "Return"
  },
  {
    "slNo": "68",
    "createdAt": "2026-11-17 10:00:00",
    "csrNo": "8727",
    "custName": "Any Rachel Varghese",
    "mobile": "9746603730",
    "productComplaint": "Lapcare Monitor",
    "status": "Warranty"
  },
  {
    "slNo": "69",
    "createdAt": "2026-11-17 10:00:00",
    "csrNo": "8728",
    "custName": "Neethu",
    "mobile": "9562186767",
    "productComplaint": "HP 15 FQ dead",
    "status": "Ready"
  },
  {
    "slNo": "70",
    "createdAt": "2026-11-19 10:00:00",
    "csrNo": "8733",
    "custName": "jose johan",
    "mobile": "7510266821",
    "productComplaint": "Acer lapto dead",
    "status": "Pending"
  },
  {
    "slNo": "71",
    "createdAt": "2026-11-19 10:00:00",
    "csrNo": "8737",
    "custName": "Pradeep",
    "mobile": "7994734344",
    "productComplaint": "Hplap speakee complaint",
    "status": "Delivered"
  },
  {
    "slNo": "72",
    "createdAt": "2026-11-19 10:00:00",
    "csrNo": "8738",
    "custName": "Biju",
    "mobile": "8590022340",
    "productComplaint": "Pc serial card error",
    "status": "Ready"
  },
  {
    "slNo": "73",
    "createdAt": "2026-11-19 10:00:00",
    "csrNo": "8739",
    "custName": "Gayathri",
    "mobile": "8075261692",
    "productComplaint": "Acer laptop Hinges",
    "status": "Delivered"
  },
  {
    "slNo": "74",
    "createdAt": "2026-11-20 10:00:00",
    "csrNo": "8740",
    "custName": "sona",
    "mobile": "83001011870",
    "productComplaint": "hp software",
    "status": "Ready"
  },
  {
    "slNo": "75",
    "createdAt": "2026-11-20 10:00:00",
    "csrNo": "8741",
    "custName": "sethu prakash",
    "mobile": "9447090238",
    "productComplaint": "canon mf 3010 not printing",
    "status": "Pending"
  },
  {
    "slNo": "76",
    "createdAt": "2026-11-21 10:00:00",
    "csrNo": "8742",
    "custName": "LALU",
    "mobile": "9446835911",
    "productComplaint": "LENOVO KEYBOARD",
    "status": "Delivered"
  }
];

async function importRecords() {
    console.log('Connecting to database and initializing schema...');
    await db.ensureInitialized();
    console.log(`Starting import of ${records.length} records...`);

    let imported = 0;
    let skipped = 0;

    for (const r of records) {
        try {
            // Check if complaint already exists
            const existing = await db.query('SELECT id FROM complaints WHERE csr_number = $1', [r.csrNo]);
            if (existing.rows.length > 0) {
                console.log(`[SKIP] CSR #${r.csrNo} already exists.`);
                skipped++;
                continue;
            }

            // Find or create customer
            let custId;
            if (r.mobile) {
                const custRes = await db.query('SELECT id FROM customers WHERE phone = $1 LIMIT 1', [r.mobile]);
                if (custRes.rows.length > 0) {
                    custId = custRes.rows[0].id;
                }
            }

            if (!custId) {
                custId = crypto.randomUUID();
                await db.query(
                    'INSERT INTO customers (id, name, phone, created_at) VALUES ($1, $2, $3, $4)',
                    [custId, r.custName, r.mobile || '', r.createdAt]
                );
            }

            // Insert complaint
            const compId = crypto.randomUUID();
            await db.query(`
                INSERT INTO complaints (
                    id, customer_id, item_name, issue, status, csr_number,
                    created_at, service_type, service_mode, is_device_intaken, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'In-Shop', 'On Center', 1, 'admin')
            `, [compId, custId, r.productComplaint, r.productComplaint, r.status, r.csrNo, r.createdAt]);

            // Insert status log
            await db.query(
                'INSERT INTO status_logs (id, complaint_id, status, technician, created_at) VALUES ($1, $2, $3, $4, $5)',
                [crypto.randomUUID(), compId, r.status, 'admin', r.createdAt]
            );

            imported++;
            console.log(`[OK] CSR #${r.csrNo} - ${r.custName} (${r.status})`);
        } catch (err) {
            console.error(`[ERROR] Failed to import CSR #${r.csrNo}: ${err.message}`);
        }
    }

    console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}, Total: ${records.length}`);
    process.exit(0);
}

importRecords().catch(err => {
    console.error('Fatal import error:', err);
    process.exit(1);
});
