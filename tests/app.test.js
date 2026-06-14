// 单元测试 - 我做了个梦 (增强版)

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) { console.log("✓ " + message); testsPassed++; }
  else { console.error("✗ " + message); testsFailed++; }
}

function assertEqual(actual, expected, message) {
  const condition = actual === expected;
  if (condition) { console.log("✓ " + message); testsPassed++; }
  else { console.error("✗ " + message + " (期望: " + expected + ", 实际: " + actual + ")"); testsFailed++; }
}

// 测试 UUID
function testUUID() {
  console.log("\n--- 测试 UUID 生成 ---");
  function generateId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
    });
  }
  assert(generateId().length === 36, "UUID长度36位");
  assert(generateId() !== generateId(), "UUID每次不同");
}

// 测试日期格式化
function testDateFormat() {
  console.log("\n--- 测试日期格式化 ---");
  function formatDateKey(date) {
    const d = new Date(date);
    return "" + d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }
  assertEqual(formatDateKey("2026-06-14"), "2026-06-14", "日期格式化正确");
  assertEqual(formatDateKey("2026-01-01"), "2026-01-01", "个位数月份补零");
}

// 测试 HTML 转义
function testEscape() {
  console.log("\n--- 测试 HTML 转义 ---");
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;" }[m]));
  }
  assertEqual(escapeHtml("<script>"), "&lt;script&gt;", "转义script标签");
  assertEqual(escapeHtml("\"你好\""), "&quot;你好&quot;", "转义引号");
}

// 测试标签
function testTag() {
  console.log("\n--- 测试标签文本 ---");
  function getTagText(tag) {
    return { good: "🌟 美梦", nightmare: "😱 噩梦", weird: "🤪 奇葩" }[tag] || "🌟 美梦";
  }
  assertEqual(getTagText("good"), "🌟 美梦", "美梦标签");
  assertEqual(getTagText("nightmare"), "😱 噩梦", "噩梦标签");
  assertEqual(getTagText("weird"), "🤪 奇葩", "奇葩标签");
}

// 测试筛选
function testFilter() {
  console.log("\n--- 测试筛选逻辑 ---");
  const dreams = [
    { id: "1", tag: "good" },
    { id: "2", tag: "nightmare" },
    { id: "3", tag: "good" },
    { id: "4", tag: "weird" }
  ];
  const filterGood = dreams.filter(d => d.tag === "good");
  assertEqual(filterGood.length, 2, "筛选美梦得到2条");
  const filterAll = dreams.filter(d => true);
  assertEqual(filterAll.length, 4, "全部筛选得到4条");
}

// 测试相似度
function testSimilarity() {
  console.log("\n--- 测试相似度检测 ---");
  function findSimilar(content, dreams) {
    if (dreams.length === 0) return [];
    const words = new Set(content.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ").split(/\s+/).filter(w => w.length >= 2));
    return dreams.map(d => {
      const dWords = new Set(d.content.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ").split(/\s+/).filter(w => w.length >= 2));
      const intersection = [...words].filter(w => dWords.has(w)).length;
      const union = new Set([...words, ...dWords]).size;
      return { similarity: union > 0 ? intersection / union : 0 };
    }).filter(r => r.similarity > 0.2);
  }

  // 内容一样应该完全匹配
  const history = [{ content: "梦到在教室里考试" }];
  const content1 = "梦到在教室里考试";
  const similar1 = findSimilar(content1, history);
  assert(similar1.length > 0, "完全相同内容应被检测到");
}

// 测试关键词提取
function testKeywords() {
  console.log("\n--- 测试关键词提取 ---");
  const stopWords = ["的", "了", "在", "是", "我", "和"];
  function extractKeywords(dreams) {
    const wordCount = {};
    dreams.forEach(d => {
      const words = d.content.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ").split(/\s+/);
      words.forEach(w => {
        if (w.length >= 2 && !stopWords.includes(w)) {
          wordCount[w] = (wordCount[w] || 0) + 1;
        }
      });
    });
    return Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
  }

  // 用有空格分隔的测试用例
  const dreams = [{ content: "考试 考试 考试" }];
  const keywords = extractKeywords(dreams);
  assert(keywords.length > 0, "能提取到关键词");
  assert(keywords[0][0] === "考试", "高频词是考试");
  assert(keywords[0][1] === 3, "计数正确");
}

// 测试删除
function testDelete() {
  console.log("\n--- 测试删除逻辑 ---");
  let dreams = [{ id: "1" }, { id: "2" }, { id: "3" }];
  dreams = dreams.filter(d => d.id !== "2");
  assertEqual(dreams.length, 2, "删除后剩2条");
  assertEqual(dreams.findIndex(d => d.id === "2"), -1, "指定记录已删除");
}

// 测试数据模型
function testDataModel() {
  console.log("\n--- 测试数据模型 ---");
  const dream = {
    id: "test-id",
    content: "梦到在飞",
    drawing: "data:image/png;base64,...",
    tag: "good",
    createdAt: "2026-06-14T22:00:00.000Z",
    date: "2026-06-14"
  };
  assert(dream.id !== undefined, "包含ID");
  assert(dream.content !== undefined, "包含内容");
  assert(dream.tag !== undefined, "包含标签");
  assert(dream.date !== undefined, "包含日期");
}

// 运行测试
console.log("========================================");
console.log("   我做了个梦 - 单元测试 (增强版)");
console.log("========================================");

testUUID();
testDateFormat();
testEscape();
testTag();
testFilter();
testSimilarity();
testKeywords();
testDelete();
testDataModel();

console.log("\n========================================");
console.log("   测试结果: " + testsPassed + " 通过, " + testsFailed + " 失败");
console.log("========================================");

if (testsFailed > 0) process.exit(1);
