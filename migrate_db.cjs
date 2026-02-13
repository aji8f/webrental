const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    if (db.categories) {
        let modified = false;
        db.categories = db.categories.map(cat => {
            if (!cat.type) {
                modified = true;
                return { ...cat, type: 'service' };
            }
            return cat;
        });

        // Add initial portfolio categories if missing
        const portfolioCats = ['Wedding', 'Corporate', 'Concert', 'Government'];
        portfolioCats.forEach(pCat => {
            const exists = db.categories.find(c => c.name === pCat && c.type === 'portfolio');
            if (!exists) {
                modified = true;
                const slug = pCat.toLowerCase().replace(/\s+/g, '-');
                db.categories.push({
                    id: `CAT-${Math.floor(Math.random() * 10000)}`,
                    name: pCat,
                    slug: slug,
                    description: `${pCat} events portfolio.`,
                    count: 0,
                    type: 'portfolio'
                });
            }
        });

        if (modified) {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            console.log('Successfully migrated categories in db.json');
        } else {
            console.log('No migration needed.');
        }
    }
} catch (error) {
    console.error('Error migrating db.json:', error);
}
