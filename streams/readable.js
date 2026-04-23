const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'inp.txt');

const readStream = fs.createReadStream(filePath);

readStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk.toString());
});
readStream.on('end', () => {
    console.log('No more data to read.');
});
readStream.on('error', (err) => {
    console.error('Error reading file:', err);
});
const outputPath = path.join(__dirname, 'out.txt');
const writeStream = fs.createWriteStream(outputPath);

readStream.pipe(writeStream);
writeStream.on('finish', () => {
    console.log('All data has been written.');
});

