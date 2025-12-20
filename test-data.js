/**
 * 测试节点数据 - 包含所有支持的协议
 * 用于测试 MiSub 的各项功能
 */

// Shadowsocks 节点
export const SS_NODES = [
    'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@hk1.example.com:8388#🇭🇰 香港 SS 01',
    'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@sg1.example.com:8388#🇸🇬 新加坡 SS 01',
    'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@us1.example.com:8388#🇺🇸 美国 SS 01'
];

// Shadowsocks 2022 节点
export const SS2022_NODES = [
    'ss://MjAyMi1ibGFrZTMtYWVzLTEyOC1nY206cGFzc3dvcmQ=@jp1.example.com:8388#🇯🇵 日本 SS2022 01',
    'ss://MjAyMi1ibGFrZTMtYWVzLTI1Ni1nY206cGFzc3dvcmQ=@tw1.example.com:8388#🇹🇼 台湾 SS2022 01'
];

// VMess 节点
export const VMESS_NODES = [
    'vmess://eyJ2IjoiMiIsInBzIjoi8J+HrPCfh6cg6Iux5Zu9IFZNZXNzIDAxIiwiYWRkIjoidWsxLmV4YW1wbGUuY29tIiwicG9ydCI6IjQ0MyIsImlkIjoiYjhlNGU5YTAtZTc2Zi00ZGE0LWI3YTAtZjE2YjI0NzI5YzY0IiwiYWlkIjoiMCIsIm5ldCI6IndzIiwidHlwZSI6Im5vbmUiLCJob3N0IjoidWsxLmV4YW1wbGUuY29tIiwicGF0aCI6Ii92bWVzcyIsInRscyI6InRscyJ9',
    'vmess://eyJ2IjoiMiIsInBzIjoi8J+HqPCfh7Mg5Lit5Zu9IFZNZXNzIDAxIiwiYWRkIjoiY24xLmV4YW1wbGUuY29tIiwicG9ydCI6IjQ0MyIsImlkIjoiYjhlNGU5YTAtZTc2Zi00ZGE0LWI3YTAtZjE2YjI0NzI5YzY0IiwiYWlkIjoiMCIsIm5ldCI6IndzIiwidHlwZSI6Im5vbmUiLCJob3N0IjoiY24xLmV4YW1wbGUuY29tIiwicGF0aCI6Ii92bWVzcyIsInRscyI6InRscyJ9'
];

// VLESS 节点
export const VLESS_NODES = [
    'vless://b8e4e9a0-e76f-4da4-b7a0-f16b24729c64@de1.example.com:443?encryption=none&security=tls&type=ws&host=de1.example.com&path=/vless#🇩🇪 德国 VLESS 01',
    'vless://b8e4e9a0-e76f-4da4-b7a0-f16b24729c64@fr1.example.com:443?encryption=none&security=tls&type=ws&host=fr1.example.com&path=/vless#🇫🇷 法国 VLESS 01'
];

// Trojan 节点
export const TROJAN_NODES = [
    'trojan://password123@ca1.example.com:443?sni=ca1.example.com&type=ws&path=/trojan#🇨🇦 加拿大 Trojan 01',
    'trojan://password123@au1.example.com:443?sni=au1.example.com&type=ws&path=/trojan#🇦🇺 澳大利亚 Trojan 01'
];

// Hysteria2 节点
export const HYSTERIA2_NODES = [
    'hysteria2://password@kr1.example.com:443?sni=kr1.example.com#🇰🇷 韩国 Hysteria2 01',
    'hysteria2://password@ru1.example.com:443?sni=ru1.example.com#🇷🇺 俄罗斯 Hysteria2 01'
];

// Snell 节点 (新增协议)
export const SNELL_NODES = [
    'snell://your-psk-key@nl1.example.com:44046?version=4&obfs=http&obfs-host=www.bing.com#🇳🇱 荷兰 Snell 01',
    'snell://your-psk-key@ch1.example.com:44046?version=4&obfs=tls&obfs-host=www.google.com#🇨🇭 瑞士 Snell 01'
];

// NaiveProxy 节点 (新增协议)
export const NAIVE_NODES = [
    'naive+https://user:pass@se1.example.com:443?padding=false#🇸🇪 瑞典 NaiveProxy 01',
    'naive+https://user:pass@no1.example.com:443?padding=true#🇳🇴 挪威 NaiveProxy 01'
];

// 测试订阅链接
export const TEST_SUBSCRIPTIONS = [
    'https://example.com/sub/hk-premium',
    'https://example.com/sub/global-mix',
    'https://example.com/sub/asia-only'
];

// 所有测试节点
export const ALL_TEST_NODES = [
    ...SS_NODES,
    ...SS2022_NODES,
    ...VMESS_NODES,
    ...VLESS_NODES,
    ...TROJAN_NODES,
    ...HYSTERIA2_NODES,
    ...SNELL_NODES,
    ...NAIVE_NODES
];

// 批量导入文本 (用于测试批量导入功能)
export const BULK_IMPORT_TEXT = ALL_TEST_NODES.join('\n');

console.log('📦 测试数据已准备');
console.log('节点总数:', ALL_TEST_NODES.length);
console.log('协议类型:', {
    'SS': SS_NODES.length,
    'SS2022': SS2022_NODES.length,
    'VMess': VMESS_NODES.length,
    'VLESS': VLESS_NODES.length,
    'Trojan': TROJAN_NODES.length,
    'Hysteria2': HYSTERIA2_NODES.length,
    'Snell': SNELL_NODES.length,
    'NaiveProxy': NAIVE_NODES.length
});
