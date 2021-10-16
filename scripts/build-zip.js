#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const DEST_DIR = path.join(__dirname, '../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

const extractExtensionData = () => {
  const extPackageJson = require('../package.json');

  return {
    name: extPackageJson.name,
    version: extPackageJson.version,
  };
};

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR);
  }
};

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`);

  const archive_zip = archiver('zip', { zlib: { level: 9 } });
  const archive_xpi = archiver('zip', { zlib: { level: 9 } });

  const stream = fs.createWriteStream(path.join(dist, zipFilename));
  const xpiStream = fs.createWriteStream(path.join(dist, zipFilename.replace('.zip', '.xpi')));

  return new Promise((resolve, reject) => {
    stream.on('close', () => resolve());
    xpiStream.on('close', () => resolve());

    archive_zip
      .directory(src, false)
      .on('error', err => reject(err))
      .pipe(stream);
    archive_zip.finalize();

    archive_xpi
      .directory(src, false)
      .on('error', err => reject(err))
      .pipe(xpiStream);
    archive_xpi.finalize();
  });
};

const main = () => {
  const { name, version } = extractExtensionData();
  const zipFilename = `${name}-v${version}.zip`;

  makeDestZipDirIfNotExists();

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
    .then(() => console.info('OK'))
    .catch(console.err);
};

main();
