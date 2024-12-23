# TOTP (Time-based One-time Password) JavaScript Library

这是一个用于生成和验证基于时间的一次性密码（TOTP）的 JavaScript 库。

## 安装

你可以通过 npm 安装这个库：

```bash
npm install @wutong/otp
```

## 使用

首先，你需要在你的 HTML 文件中引入这个库：

```html
<script src="dist/totp.min.js"></script>
```

然后，你可以在你的 JavaScript 代码中使用它：

```javascript
const { TOTP } = require("../dist/TOTP.min.js");

// 创建 TOTP 实例
const totp = new TOTP({
  secret: "YOUR_SECRET",
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
```

## 贡献

如果你发现了 bug 或者有任何建议，欢迎在 GitHub 上提出 issue 或者提交 pull request。
