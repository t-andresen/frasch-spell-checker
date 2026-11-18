/**
 * Reads one file from a zip archive, for example `description.xml` from a
 * LibreOffice extension (`.oxt`).
 *
 * It handles what zip tools write for small archives: files stored as they are
 * or compressed with "deflate". A damaged archive throws an error.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
import { inflateRawSync } from 'node:zlib';

/**
 * Returns the content of the file `name` in the archive, or `undefined` when
 * the archive has no file of that name.
 */
export function readZipEntry(archive: Buffer, name: string): Buffer | undefined {
	// The list of files ends with a record that starts with these bytes.
	const end = archive.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
	if (end === -1 || end + 22 > archive.length) {
		throw new Error('The file is not a zip archive.');
	}
	const entryCount = archive.readUInt16LE(end + 10);
	let offset = archive.readUInt32LE(end + 16);

	for (let index = 0; index < entryCount; index++) {
		const method = archive.readUInt16LE(offset + 10);
		const compressedSize = archive.readUInt32LE(offset + 20);
		const nameLength = archive.readUInt16LE(offset + 28);
		const localOffset = archive.readUInt32LE(offset + 42);
		const entryName = archive.toString('utf8', offset + 46, offset + 46 + nameLength);
		offset += 46 + nameLength + archive.readUInt16LE(offset + 30) + archive.readUInt16LE(offset + 32);

		if (entryName === name) {
			const start = localOffset + 30 + archive.readUInt16LE(localOffset + 26) + archive.readUInt16LE(localOffset + 28);
			const data = archive.subarray(start, start + compressedSize);
			if (method === 0) {
				return Buffer.from(data);
			}
			if (method === 8) {
				return inflateRawSync(data);
			}
			throw new Error(`"${name}" uses compression method ${method}. Only "stored" and "deflate" are read.`);
		}
	}
	return undefined;
}
