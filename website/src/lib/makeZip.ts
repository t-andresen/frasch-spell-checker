/**
 * Writes a small zip archive in memory, the way zip tools do. Only the tests
 * use it, to build LibreOffice files with a chosen `description.xml`.
 */
import { crc32, deflateRawSync } from 'node:zlib';

export type ZipEntry = { name: string; content: string; method?: 0 | 8; flags?: number };

export function makeZip(entries: readonly ZipEntry[]): Buffer {
	const locals: Buffer[] = [];
	const directory: Buffer[] = [];
	let offset = 0;

	for (const { name, content, method = 8, flags = 0 } of entries) {
		const data = Buffer.from(content, 'utf8');
		const stored = method === 8 ? deflateRawSync(data) : data;
		const nameBytes = Buffer.from(name, 'utf8');

		const local = Buffer.alloc(30);
		local.writeUInt32LE(0x04034b50, 0);
		local.writeUInt16LE(20, 4);
		local.writeUInt16LE(flags, 6);
		local.writeUInt16LE(method, 8);
		local.writeUInt32LE(crc32(data), 14);
		local.writeUInt32LE(stored.length, 18);
		local.writeUInt32LE(data.length, 22);
		local.writeUInt16LE(nameBytes.length, 26);
		locals.push(local, nameBytes, stored);

		const header = Buffer.alloc(46);
		header.writeUInt32LE(0x02014b50, 0);
		header.writeUInt16LE(20, 4);
		header.writeUInt16LE(20, 6);
		header.writeUInt16LE(flags, 8);
		header.writeUInt16LE(method, 10);
		header.writeUInt32LE(crc32(data), 16);
		header.writeUInt32LE(stored.length, 20);
		header.writeUInt32LE(data.length, 24);
		header.writeUInt16LE(nameBytes.length, 28);
		header.writeUInt32LE(offset, 42);
		directory.push(header, nameBytes);

		offset += local.length + nameBytes.length + stored.length;
	}

	const directoryBytes = Buffer.concat(directory);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(entries.length, 8);
	end.writeUInt16LE(entries.length, 10);
	end.writeUInt32LE(directoryBytes.length, 12);
	end.writeUInt32LE(offset, 16);
	return Buffer.concat([...locals, directoryBytes, end]);
}
