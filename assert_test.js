// 使用遺留模式
const assert = require('assert');

// 生成 AssertionError 物件
const { message } = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual'
});

// 驗證錯誤資訊輸出
try {
    // 驗證兩個數值是否相等
    assert.strictEqual(1, 2); // false，會丟出 AssertionError
} catch (err) {
    // 驗證錯誤是否為 AssertionError 類型
    assert(err instanceof assert.AssertionError);

    // 驗證錯誤訊息是否符合預期
    assert.strictEqual(err.message, message); // true
    console.log("AssertionError caught successfully:", err.message);
}
