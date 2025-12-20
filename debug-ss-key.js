// 调试 SS 2022 节点密钥长度

const nodeUrl = 'ss://MjAyMi1ibGFrZTMtYWVzLTEyOC1nY206c1lENERUVmdsY2lzU2VaTmNrbE1sTmtoVXhPdGRxRkt3VW1IbHVSVUJmU2c@hn.otds.nyc.mn:40953#台湾hinet_土豆';

// 提取 Base64 部分
const atIndex = nodeUrl.indexOf('@');
const base64Part = nodeUrl.substring(5, atIndex);

console.log('Base64 部分:', base64Part);
console.log('Base64 长度:', base64Part.length);

// 解码 Base64
const decoded = atob(base64Part);
console.log('\n解码后:', decoded);
console.log('解码后长度:', decoded.length);

// 分离加密方式和密码
const [cipher, password] = decoded.split(':');
console.log('\n加密方式:', cipher);
console.log('密码:', password);
console.log('密码长度 (字符):', password.length);

// 尝试将密码作为 Base64 解码
try {
    const keyBytes = atob(password);
    console.log('\n密钥 (Base64 解码后):', keyBytes);
    console.log('密钥长度 (字节):', keyBytes.length);

    // 显示每个字节的十六进制
    const hexBytes = [];
    for (let i = 0; i < keyBytes.length; i++) {
        hexBytes.push(keyBytes.charCodeAt(i).toString(16).padStart(2, '0'));
    }
    console.log('密钥 (十六进制):', hexBytes.join(' '));
} catch (e) {
    console.error('\n无法将密码作为 Base64 解码:', e.message);
}
