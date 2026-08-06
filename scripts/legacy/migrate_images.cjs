const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

function saveBase64Image(base64String) {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return null;
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const extension = type.split('/')[1];
    const filename = `migrated-${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
}

function traverseAndMigrate(obj) {
    let modified = false;
    for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].startsWith('data:image')) {
            const newPath = saveBase64Image(obj[key]);
            if (newPath) {
                console.log(`Migrated image at key: ${key}`);
                obj[key] = newPath;
                modified = true;
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (traverseAndMigrate(obj[key])) {
                modified = true;
            }
        }
    }
    return modified;
}

try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    if (traverseAndMigrate(db)) {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        console.log('Successfully migrated all Base64 images to file system.');
    } else {
        console.log('No Base64 images found to migrate.');
    }
} catch (error) {
    console.error('Error migrating images:', error);
}
