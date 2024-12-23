const { TOTP } = require("../dist/TOTP.min.js");

// 创建 TOTP 实例
const totp = new TOTP({
  secret: "Hik@123456789",
  algorithm: "SHA256", // 可选: SHA1（默认）, SHA256, SHA512 等
  digits: 6, // 可选: 生成口令的位数，默认 6
  period: 30, // 可选: 口令更新周期（秒），默认 30
});

// 生成当前时间的 TOTP 口令
const token = totp.generate();

// 生成当前时间的 TOTP 口令 根据离散数组
const token1 = totp.generateByPosition({
  timestamp: Date.now(),
  position: [0, 7, 14, 19, 23, 31],
});

console.log(token);
console.log(token1);
