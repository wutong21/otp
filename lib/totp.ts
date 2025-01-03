import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha2";

/**
 * Converts an integer to an Uint8Array.
 * @param {number} num Integer.
 * @returns {Uint8Array} Uint8Array.
 */
const uintDecode = (num: number): Uint8Array => {
  const buf = new ArrayBuffer(8);
  const arr = new Uint8Array(buf);
  let acc = num;
  for (let i = 7; i >= 0; i--) {
    if (acc === 0) break;
    arr[i] = acc & 255;
    acc -= arr[i];
    acc /= 256;
  }
  return arr;
};

export class TOTP {
  private secret: string;
  private algorithm: string;
  private digits: number;
  private period: number;

  private issuer: string;
  private label: string;
  private position: Array<number>;

  constructor({
    secret,
    algorithm = "SHA256",
    digits = 6,
    period = 30,
    position = [],
    label = "OTPAuth",
    issuer = "default test",
  }: {
    secret: string;
    algorithm?: string;
    digits?: number;
    period?: number;
    position?: Array<number>;
    label?: string;
    issuer?: string;
  }) {
    this.secret = secret;
    this.algorithm = algorithm;
    this.digits = digits;
    this.period = period;
    this.position = position;
    this.label = label;
    this.issuer = issuer;
  }
  /**
   * @method 生成动态口令
   * @param timestamp
   * @returns 6位数动态口令
   */
  generate(timestamp: number = Date.now()): string {
    const digest = this.toHmacDigest(timestamp);

    // Calculate OTP based on digest
    const offset = digest[digest.byteLength - 1] & 15;
    const otp =
      (((digest[offset] & 127) << 24) |
        ((digest[offset + 1] & 255) << 16) |
        ((digest[offset + 2] & 255) << 8) |
        (digest[offset + 3] & 255)) %
      Math.pow(10, this.digits);

    // Pad the result with leading zeros if necessary
    return otp.toString().padStart(this.digits, "0");
  }

  /**
   * @method 生成动态口令根据离散数组
   * @param timestamp
   * @param position
   * @returns 6位数动态口令
   */
  generateByPosition(
    timestamp: number = Date.now(),
    position: Array<number> = [0, 7, 14, 19, 23, 31]
  ): string {
    const digest = this.toHmacDigest(timestamp);
    let result: Array<number> = [];
    // position = [0, 7,14,19,23,31]
    // Check specific positions
    for (let i = 0; i < digest.length; i++) {
      if (position.includes(i)) {
        const byte = digest[i];
        const number = byte & 0xff; // Convert to unsigned byte (0-255)
        const onesDigit = number % 10;
        result.push(onesDigit); // Get last digit after multiplication
      }
    }

    return result.join("");
  }

  /**
   * @method 获取HMac二进制数组
   * @param timestamp 时间戳
   * @returns Unit8Array 数组
   */
  toHmacDigest(timestamp: number = Date.now()): Uint8Array {
    const counter = Math.floor(timestamp / 1000 / this.period);
    const digest = hmac(sha256, this.secret, uintDecode(counter));
    return digest;
  }

  /**
   * @method 返回Hex十六进制
   * @param timestamp
   * @returns Hex十六进制
   */
  toHmacHex(timestamp: number = Date.now()): string {
    const digest = this.toHmacDigest(timestamp);
    return Array.from(digest)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  /**
   * Returns a Google Authenticator key URI.
   * @returns {string} URI.
   */
  toString() {
    const e = encodeURIComponent;
    return (
      "otpauth://totp/" +
      `${e(this.issuer)}:${e(this.label)}?issuer=${e(this.issuer)}&` +
      `secret=${e(this.secret)}&` +
      `algorithm=${e(this.algorithm)}&` +
      `digits=${e(this.digits)}&` +
      `period=${e(this.period)}`
    );
  }
}
