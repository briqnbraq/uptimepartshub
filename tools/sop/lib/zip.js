'use strict';

// Minimal ZIP writer. A .docx is just a ZIP of XML parts, and Node has no
// built-in archiver, so we emit the container by hand rather than take a
// dependency. Output is deterministic: fixed timestamps mean regenerating an
// unchanged SOP produces a byte-identical file.

const zlib = require('zlib');

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

// 1 Jan 2026, 00:00 in DOS date/time format.
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_EOCD = 0x06054b50;
const FLAG_UTF8 = 0x0800;

/**
 * @param {Array<{name: string, data?: Buffer}>} entries
 *   Names ending in "/" are written as directory entries.
 * @returns {Buffer} the complete ZIP archive
 */
function zip(entries) {
  const local = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const isDir = entry.name.endsWith('/');
    const name = Buffer.from(entry.name, 'utf8');
    const raw = isDir ? Buffer.alloc(0) : entry.data;
    const method = raw.length === 0 ? 0 : 8;
    const body = method === 8 ? zlib.deflateRawSync(raw, { level: 9 }) : raw;
    const crc = crc32(raw);

    const header = Buffer.alloc(30);
    header.writeUInt32LE(SIG_LOCAL, 0);
    header.writeUInt16LE(20, 4); // version needed
    header.writeUInt16LE(FLAG_UTF8, 6);
    header.writeUInt16LE(method, 8);
    header.writeUInt16LE(DOS_TIME, 10);
    header.writeUInt16LE(DOS_DATE, 12);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(body.length, 18);
    header.writeUInt32LE(raw.length, 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(0, 28); // extra field length
    local.push(header, name, body);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(SIG_CENTRAL, 0);
    dir.writeUInt16LE(20, 4); // version made by
    dir.writeUInt16LE(20, 6); // version needed
    dir.writeUInt16LE(FLAG_UTF8, 8);
    dir.writeUInt16LE(method, 10);
    dir.writeUInt16LE(DOS_TIME, 12);
    dir.writeUInt16LE(DOS_DATE, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(body.length, 20);
    dir.writeUInt32LE(raw.length, 24);
    dir.writeUInt16LE(name.length, 28);
    dir.writeUInt16LE(0, 30); // extra
    dir.writeUInt16LE(0, 32); // comment
    dir.writeUInt16LE(0, 34); // disk number
    dir.writeUInt16LE(0, 36); // internal attributes
    dir.writeUInt32LE(isDir ? 0x10 : 0, 38); // external attributes
    dir.writeUInt32LE(offset, 42);
    central.push(dir, name);

    offset += header.length + name.length + body.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(SIG_EOCD, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...local, centralBuf, eocd]);
}

module.exports = { zip, crc32 };
