// Sensitive word filtering module
// 敏感词过滤模块 — 用于产品描述、询盘内容、资讯正文等内容审核

// ===== Sensitive word categories =====

export interface SensitiveMatch {
  word: string;
  category: string;
  positions: number[];
}

// ===== Built-in sensitive word library =====
// Note: This is a demonstration library. In production, this should be
// loaded from a database and managed by admin staff.

const sensitiveWords: Record<string, string[]> = {
  // 政治敏感词
  "政治敏感": [
    "反动",
    "颠覆",
    "分裂国家",
    "恐怖主义",
    "极端主义",
  ],
  // 违法违规
  "违法违规": [
    "走私",
    "偷逃税款",
    "行贿",
    "受贿",
    "洗钱",
    "非法集资",
  ],
  // 食品安全违规
  "食品安全违规": [
    "假冒认证",
    "伪造 halal",
    "非清真冒充",
    "掺假",
    "有毒有害",
    "地沟油",
    "瘦肉精",
    "三聚氰胺",
  ],
  // 虚假宣传
  "虚假宣传": [
    "包治百病",
    "神奇疗效",
    "百分百有效",
    "绝对安全",
    "永不过期",
    "国家级特供",
    "专供",
  ],
  // 不当商业行为
  "不当商业行为": [
    "刷单",
    "虚假交易",
    "恶意竞争",
    "商业欺诈",
    "骗取货款",
  ],
  // 其他
  "其他违规": [
    "赌博",
    "色情",
    "毒品",
    "枪支",
    "弹药",
  ],
};

// ===== Flatten for quick lookup =====

const flatWords: { word: string; category: string }[] = [];
for (const [category, words] of Object.entries(sensitiveWords)) {
  for (const word of words) {
    flatWords.push({ word, category });
  }
}

// ===== Public API =====

/**
 * Check text for sensitive words
 * @returns array of matches found, empty if clean
 */
export function checkSensitive(text: string): SensitiveMatch[] {
  if (!text || typeof text !== "string") return [];

  const matches: SensitiveMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const { word, category } of flatWords) {
    const positions: number[] = [];
    let idx = lowerText.indexOf(word.toLowerCase());
    while (idx !== -1) {
      positions.push(idx);
      idx = lowerText.indexOf(word.toLowerCase(), idx + word.length);
    }
    if (positions.length > 0) {
      matches.push({ word, category, positions });
    }
  }

  return matches;
}

/**
 * Check if text contains any sensitive words
 * @returns true if sensitive content detected
 */
export function hasSensitiveContent(text: string): boolean {
  return checkSensitive(text).length > 0;
}

/**
 * Mask sensitive words in text with asterisks
 * @returns { clean: masked text, matches: found matches }
 */
export function maskSensitive(text: string): { clean: string; matches: SensitiveMatch[] } {
  if (!text || typeof text !== "string") return { clean: text || "", matches: [] };

  const matches = checkSensitive(text);
  if (matches.length === 0) return { clean: text, matches: [] };

  let result = text;
  // Sort by position descending so we can replace without affecting indices
  const allPositions: { start: number; end: number; word: string; category: string }[] = [];
  for (const match of matches) {
    for (const pos of match.positions) {
      allPositions.push({
        start: pos,
        end: pos + match.word.length,
        word: match.word,
        category: match.category,
      });
    }
  }
  allPositions.sort((a, b) => b.start - a.start);

  for (const { start, end } of allPositions) {
    const mask = "*".repeat(end - start);
    result = result.slice(0, start) + mask + result.slice(end);
  }

  return { clean: result, matches };
}

/**
 * Get all sensitive word categories (for admin UI)
 */
export function getSensitiveCategories(): string[] {
  return Object.keys(sensitiveWords);
}

/**
 * Get all sensitive words (for admin UI)
 */
export function getAllSensitiveWords(): { word: string; category: string }[] {
  return [...flatWords];
}

/**
 * Get a summary of sensitive word categories and their counts
 */
export function getSensitiveWordSummary(): { category: string; count: number }[] {
  return Object.entries(sensitiveWords).map(([category, words]) => ({
    category,
    count: words.length,
  }));
}

/**
 * Format sensitive match results for display
 */
export function formatSensitiveReport(matches: SensitiveMatch[]): string {
  if (matches.length === 0) return "未检测到敏感内容";
  const lines = matches.map(
    (m) => `[${m.category}] "${m.word}" — 出现 ${m.positions.length} 次`
  );
  return `检测到 ${matches.length} 类敏感词：\n${lines.join("\n")}`;
}
