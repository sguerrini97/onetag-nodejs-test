const Zip = require('adm-zip');
const fs = require('fs/promises');
const path = require('path');

(async () => {
    try {
        const ignore = [
            'node_modules',
            'dist',
        ];
        const zip = new Zip();
        const entries = await fs.readdir('.');
        for (const entry of entries) {
            if (!ignore.includes(entry)) {
                const stats = await fs.stat(entry);
                if (stats.isDirectory()) {
                    zip.addLocalFolder(entry, entry);
                } else if (stats.isFile()) {
                    zip.addLocalFile(entry);
                }
            }
        }
        zip.writeZip(path.resolve('dist', 'consegna.zip'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
