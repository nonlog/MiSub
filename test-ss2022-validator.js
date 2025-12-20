/**
 * SS 2022 节点验证工具测试
 */

import { validateSS2022Node, fixSS2022Node, validateNodeList } from './functions/modules/utils/ss2022-validator.js';

// 测试用例
const testCases = [
    {
        name: '问题节点 - aes-128 使用了 32 字节密钥',
        url: 'ss://MjAyMi1ibGFrZTMtYWVzLTEyOC1nY206c1lENERUVmdsY2lzU2VaTmNrbE1sTmtoVXhPdGRxRkt3VW1IbHVSVUJmU2c@hn.otds.nyc.mn:40953#台湾hinet_土豆',
        expectedValid: false,
        expectedSuggestedCipher: '2022-blake3-aes-256-gcm'
    },
    {
        name: '正确节点 - aes-256 使用 32 字节密钥',
        url: 'ss://MjAyMi1ibGFrZTMtYWVzLTI1Ni1nY206c1lENERUVmdsY2lzU2VaTmNrbE1sTmtoVXhPdGRxRkt3VW1IbHVSVUJmU2c@hn.otds.nyc.mn:40953#台湾hinet_土豆',
        expectedValid: true
    },
    {
        name: '传统 SS 节点 - aes-256-gcm',
        url: 'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQxMjM@example.com:8388#测试节点',
        expectedValid: true
    }
];

console.log('=== SS 2022 节点验证测试 ===\n');

testCases.forEach((testCase, index) => {
    console.log(`测试 ${index + 1}: ${testCase.name}`);
    console.log(`URL: ${testCase.url.substring(0, 50)}...`);

    // 验证节点
    const validation = validateSS2022Node(testCase.url);
    console.log('验证结果:', validation);

    // 检查验证结果是否符合预期
    if (validation.valid === testCase.expectedValid) {
        console.log('✅ 验证结果符合预期');
    } else {
        console.log('❌ 验证结果不符合预期');
    }

    // 如果节点无效,尝试修复
    if (!validation.valid) {
        console.log('\n尝试自动修复...');
        const fixResult = fixSS2022Node(testCase.url);
        console.log('修复结果:', fixResult);

        if (fixResult.fixed) {
            console.log('✅ 修复成功!');
            console.log('修复后的 URL:', fixResult.fixedUrl.substring(0, 80) + '...');

            // 验证修复后的节点
            const revalidation = validateSS2022Node(fixResult.fixedUrl);
            if (revalidation.valid) {
                console.log('✅ 修复后的节点验证通过');
            } else {
                console.log('❌ 修复后的节点仍然无效');
            }
        }
    }

    console.log('\n' + '='.repeat(60) + '\n');
});

// 批量验证测试
console.log('=== 批量验证测试 ===\n');
const batchResult = validateNodeList(testCases.map(tc => tc.url));
console.log('批量验证结果:', batchResult);
console.log('\n总计:', batchResult.total);
console.log('有效:', batchResult.valid);
console.log('无效:', batchResult.invalid);
console.log('警告:', batchResult.warnings);

if (batchResult.invalidNodes.length > 0) {
    console.log('\n无效节点详情:');
    batchResult.invalidNodes.forEach(node => {
        console.log(`  - 索引 ${node.index}:`, node.details);
    });
}
