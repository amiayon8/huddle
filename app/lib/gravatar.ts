function rotateLeft(value: number, shift: number): number {
  return (value << shift) | (value >>> (32 - shift));
}

function addUnsigned(x: number, y: number): number {
  const lowWord = (x & 0xffff) + (y & 0xffff);
  const highWord = (x >> 16) + (y >> 16) + (lowWord >> 16);
  return (highWord << 16) | (lowWord & 0xffff);
}

function executeRoundF(
  x: number,
  y: number,
  z: number,
  w: number,
  data: number,
  shift: number,
  ac: number,
): number {
  const result = addUnsigned(x, (y & z) | (~y & w));
  const sum = addUnsigned(addUnsigned(result, data), ac);
  return addUnsigned(rotateLeft(sum, shift), y);
}

function executeRoundG(
  x: number,
  y: number,
  z: number,
  w: number,
  data: number,
  shift: number,
  ac: number,
): number {
  const result = addUnsigned(x, (y & w) | (z & ~w));
  const sum = addUnsigned(addUnsigned(result, data), ac);
  return addUnsigned(rotateLeft(sum, shift), y);
}

function executeRoundH(
  x: number,
  y: number,
  z: number,
  w: number,
  data: number,
  shift: number,
  ac: number,
): number {
  const result = addUnsigned(x, y ^ z ^ w);
  const sum = addUnsigned(addUnsigned(result, data), ac);
  return addUnsigned(rotateLeft(sum, shift), y);
}

function executeRoundI(
  x: number,
  y: number,
  z: number,
  w: number,
  data: number,
  shift: number,
  ac: number,
): number {
  const result = addUnsigned(x, z ^ (y | ~w));
  const sum = addUnsigned(addUnsigned(result, data), ac);
  return addUnsigned(rotateLeft(sum, shift), y);
}

function convertStringToWordArray(input: string): number[] {
  const wordCount = ((input.length + 8) >> 6) + 1;
  const words: number[] = new Array(wordCount * 16).fill(0);

  for (let index = 0; index < input.length; index++) {
    words[index >> 2] |= (input.charCodeAt(index) & 0xff) << ((index % 4) * 8);
  }

  words[input.length >> 2] |= 0x80 << ((input.length % 4) * 8);
  words[wordCount * 16 - 2] = input.length * 8;
  return words;
}

function convertWordToHex(value: number): string {
  let hexString = "";
  for (let shift = 0; shift <= 3; shift++) {
    const byte = (value >>> (shift * 8)) & 0xff;
    const hex = byte.toString(16);
    hexString += hex.length === 1 ? "0" + hex : hex;
  }
  return hexString;
}

export function computeMd5Hash(input: string): string {
  const words = convertStringToWordArray(input);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let offset = 0; offset < words.length; offset += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;

    a = executeRoundF(a, b, c, d, words[offset + 0], 7, 0xd76aa478);
    d = executeRoundF(d, a, b, c, words[offset + 1], 12, 0xe8c7b756);
    c = executeRoundF(c, d, a, b, words[offset + 2], 17, 0x242070db);
    b = executeRoundF(b, c, d, a, words[offset + 3], 22, 0xc1bdceee);
    a = executeRoundF(a, b, c, d, words[offset + 4], 7, 0xf57c0faf);
    d = executeRoundF(d, a, b, c, words[offset + 5], 12, 0x4787c62a);
    c = executeRoundF(c, d, a, b, words[offset + 6], 17, 0xa8304613);
    b = executeRoundF(b, c, d, a, words[offset + 7], 22, 0xfd469501);
    a = executeRoundF(a, b, c, d, words[offset + 8], 7, 0x698098d8);
    d = executeRoundF(d, a, b, c, words[offset + 9], 12, 0x8b44f7af);
    c = executeRoundF(c, d, a, b, words[offset + 10], 17, 0xffff5bb1);
    b = executeRoundF(b, c, d, a, words[offset + 11], 22, 0x895cd7be);
    a = executeRoundF(a, b, c, d, words[offset + 12], 7, 0x6b901122);
    d = executeRoundF(d, a, b, c, words[offset + 13], 12, 0xfd987193);
    c = executeRoundF(c, d, a, b, words[offset + 14], 17, 0xa679438e);
    b = executeRoundF(b, c, d, a, words[offset + 15], 22, 0x49b40821);

    a = executeRoundG(a, b, c, d, words[offset + 1], 5, 0xf61e2562);
    d = executeRoundG(d, a, b, c, words[offset + 6], 9, 0xc040b340);
    c = executeRoundG(c, d, a, b, words[offset + 11], 14, 0x265e5a51);
    b = executeRoundG(b, c, d, a, words[offset + 0], 20, 0xe9b6c7aa);
    a = executeRoundG(a, b, c, d, words[offset + 5], 5, 0xd62f105d);
    d = executeRoundG(d, a, b, c, words[offset + 10], 9, 0x02441453);
    c = executeRoundG(c, d, a, b, words[offset + 15], 14, 0xd8a1e681);
    b = executeRoundG(b, c, d, a, words[offset + 4], 20, 0xe7d3fbc8);
    a = executeRoundG(a, b, c, d, words[offset + 9], 5, 0x21e1cde6);
    d = executeRoundG(d, a, b, c, words[offset + 14], 9, 0xc33707d6);
    c = executeRoundG(c, d, a, b, words[offset + 3], 14, 0xf4d50d87);
    b = executeRoundG(b, c, d, a, words[offset + 8], 20, 0x455a14ed);
    a = executeRoundG(a, b, c, d, words[offset + 13], 5, 0xa9e3e905);
    d = executeRoundG(d, a, b, c, words[offset + 2], 9, 0xfcefa3f8);
    c = executeRoundG(c, d, a, b, words[offset + 7], 14, 0x676f02d9);
    b = executeRoundG(b, c, d, a, words[offset + 12], 20, 0x8d2a4c8a);

    a = executeRoundH(a, b, c, d, words[offset + 5], 4, 0xfffa3942);
    d = executeRoundH(d, a, b, c, words[offset + 8], 11, 0x8771f681);
    c = executeRoundH(c, d, a, b, words[offset + 11], 16, 0x6d9d6122);
    b = executeRoundH(b, c, d, a, words[offset + 14], 23, 0xfde5380c);
    a = executeRoundH(a, b, c, d, words[offset + 1], 4, 0xa4beea44);
    d = executeRoundH(d, a, b, c, words[offset + 4], 11, 0x4bdecfa9);
    c = executeRoundH(c, d, a, b, words[offset + 7], 16, 0xf6bb4b60);
    b = executeRoundH(b, c, d, a, words[offset + 10], 23, 0xbebfbc70);
    a = executeRoundH(a, b, c, d, words[offset + 13], 4, 0x289b7ec6);
    d = executeRoundH(d, a, b, c, words[offset + 0], 11, 0xeaa127fa);
    c = executeRoundH(c, d, a, b, words[offset + 3], 16, 0xd4ef3085);
    b = executeRoundH(b, c, d, a, words[offset + 6], 23, 0x04881d05);
    a = executeRoundH(a, b, c, d, words[offset + 9], 4, 0xd9d4d039);
    d = executeRoundH(d, a, b, c, words[offset + 12], 11, 0xe6db99e5);
    c = executeRoundH(c, d, a, b, words[offset + 15], 16, 0x1fa27cf8);
    b = executeRoundH(b, c, d, a, words[offset + 2], 23, 0xc4ac5665);

    a = executeRoundI(a, b, c, d, words[offset + 0], 6, 0xf4292244);
    d = executeRoundI(d, a, b, c, words[offset + 7], 10, 0x432aff97);
    c = executeRoundI(c, d, a, b, words[offset + 14], 15, 0xab9423a7);
    b = executeRoundI(b, c, d, a, words[offset + 5], 21, 0xfc93a039);
    a = executeRoundI(a, b, c, d, words[offset + 12], 6, 0x655b59c3);
    d = executeRoundI(d, a, b, c, words[offset + 3], 10, 0x8f0ccc92);
    c = executeRoundI(c, d, a, b, words[offset + 10], 15, 0xffeff47d);
    b = executeRoundI(b, c, d, a, words[offset + 1], 21, 0x85845dd1);
    a = executeRoundI(a, b, c, d, words[offset + 8], 6, 0x6fa87e4f);
    d = executeRoundI(d, a, b, c, words[offset + 15], 10, 0xfe2ce6e0);
    c = executeRoundI(c, d, a, b, words[offset + 6], 15, 0xa3014314);
    b = executeRoundI(b, c, d, a, words[offset + 13], 21, 0x4e0811a1);
    a = executeRoundI(a, b, c, d, words[offset + 4], 6, 0xf7537e82);
    d = executeRoundI(d, a, b, c, words[offset + 11], 10, 0xbd3af235);
    c = executeRoundI(c, d, a, b, words[offset + 2], 15, 0x2ad7d2bb);
    b = executeRoundI(b, c, d, a, words[offset + 9], 21, 0xeb86d391);

    a = addUnsigned(a, oldA);
    b = addUnsigned(b, oldB);
    c = addUnsigned(c, oldC);
    d = addUnsigned(d, oldD);
  }

  return (
    convertWordToHex(a) +
    convertWordToHex(b) +
    convertWordToHex(c) +
    convertWordToHex(d)
  );
}

export function getGravatarUrl(
  identifier?: string | null,
  size: number = 80,
  defaultType: "identicon" | "mp" | "retro" | "robohash" = "identicon",
): string {
  const normalized = (identifier || "").trim().toLowerCase();

  if (
    normalized.startsWith("https://www.gravatar.com/avatar/") ||
    normalized.startsWith("https://gravatar.com/avatar/")
  ) {
    const url = new URL(normalized);
    url.searchParams.set("s", size.toString());
    url.searchParams.set("d", defaultType);
    return url.toString();
  }

  const hash = normalized
    ? computeMd5Hash(normalized)
    : "00000000000000000000000000000000";

  return `https://www.gravatar.com/avatar/${hash}?d=${defaultType}&s=${size}`;
}

export function getUserAvatarUrl(
  profile?: {
    email?: string | null;
    avatar?: string | null;
    handle?: string | null;
    id?: string | null;
    name?: string | null;
  } | null,
  size: number = 80,
): string {
  if (!profile) {
    return getGravatarUrl("anonymous", size);
  }

  if (profile.email && profile.email.includes("@")) {
    return getGravatarUrl(profile.email, size);
  }

  if (
    profile.avatar &&
    (profile.avatar.startsWith("https://www.gravatar.com/avatar/") ||
      profile.avatar.startsWith("https://gravatar.com/avatar/"))
  ) {
    return getGravatarUrl(profile.avatar, size);
  }

  const fallbackIdentifier =
    profile.handle || profile.id || profile.name || "user";
  return getGravatarUrl(fallbackIdentifier, size);
}
