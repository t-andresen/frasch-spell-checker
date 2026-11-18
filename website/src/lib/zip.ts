/**
 * Reads one file from a zip archive, for example `description.xml` from a
 * LibreOffice extension (`.oxt`).
 *
 * It understands what LibreOffice and common zip tools write: files that are
 * stored as they are or compressed with "deflate". It does not handle
 * encrypted archives or archives above 4 GB. It reports them as errors.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
import { inflateRawSync } from 'node:zlib';

const endOfDirectorySignature = 0x06054b50;
const directoryEntrySignature = 0x02014b50;
const localHeaderSignature = 0x04034b50;
const endOfDirectorySize = 22;
/** The end record can be followed by a comment of up to this many bytes. */
const maxCommentSize = 0xffff;

function findEndOfDirectory(archive: Buffer): number {
	const earliest = Math.max(0, archive.length - endOfDirectorySize - maxCommentSize);
	for (let offset = archive.length - endOfDirectorySize; offset >= earliest; offset--) {
		if (archive.readUInt32LE(offset) === endOfDirectorySignature) {
			return offset;
		}
	}
	throw new Error('The file is not a zip archive.');
}

/**
 * Returns the content of the file `name` in the archive, or `undefined` when
 * the archive has no file of that name. Throws when the archive is damaged or
 * uses a feature this reader does not handle.
 */
export function readZipEntry(archive: Buffer, name: string): Buffer | undefined {
	if (archive.length < endOfDirectorySize) {
		throw new Error('The file is not a zip archive.');
	}
	const end = findEndOfDirectory(archive);
	const entryCount = archive.readUInt16LE(end + 10);
	let offset = archive.readUInt32LE(end + 16);

	for (let index = 0; index < entryCount; index++) {
		if (offset + 46 > archive.length || archive.readUInt32LE(offset) !== directoryEntrySignature) {
			throw new Error('The zip archive is damaged: its list of files cannot be read.');
		}
		const flags = archive.readUInt16LE(offset + 8);
		const method = archive.readUInt16LE(offset + 10);
		const compressedSize = archive.readUInt32LE(offset + 20);
		const size = archive.readUInt32LE(offset + 24);
		const nameLength = archive.readUInt16LE(offset + 28);
		const extraLength = archive.readUInt16LE(offset + 30);
		const commentLength = archive.readUInt16LE(offset + 32);
		const localOffset = archive.readUInt32LE(offset + 42);
		const entryName = archive.toString('utf8', offset + 46, offset + 46 + nameLength);
		offset += 46 + nameLength + extraLength + commentLength;

		if (entryName !== name) {
			continue;
		}
		if ((flags & 1) !== 0) {
			throw new Error(`"${name}" in the zip archive is encrypted.`);
		}
		if (compressedSize === 0xffffffff || size === 0xffffffff || localOffset === 0xffffffff) {
			throw new Error(`"${name}" in the zip archive uses the zip64 format, which this reader does not handle.`);
		}
		if (localOffset + 30 > archive.length || archive.readUInt32LE(localOffset) !== localHeaderSignature) {
			throw new Error(`The zip archive is damaged: "${name}" cannot be found at its place.`);
		}
		const dataStart = localOffset + 30 + archive.readUInt16LE(localOffset + 26) + archive.readUInt16LE(localOffset + 28);
		const data = archive.subarray(dataStart, dataStart + compressedSize);

		let content: Buffer;
		switch (method) {
			case 0:
				content = Buffer.from(data);
				break;
			case 8:
				content = inflateRawSync(data);
				break;
			default:
				throw new Error(`"${name}" in the zip archive uses compression method ${method}, which this reader does not handle.`);
		}
		if (content.length !== size) {
			throw new Error(`The zip archive is damaged: "${name}" has a different size than its list of files says.`);
		}
		return content;
	}
	return undefined;
}
