// Public-domain poetry. Rotate once per opening; closing never advances the page.
export const bookshelfQuotes = [
  {text:'且将新火试新茶，\n诗酒趁年华。',source:'苏轼 ·《望江南·超然台作》'},
  {text:'长风破浪会有时，\n直挂云帆济沧海。',source:'李白 ·《行路难·其一》'},
  {text:'行到水穷处，\n坐看云起时。',source:'王维 ·《终南别业》'},
  {text:'人间有味是清欢。',source:'苏轼 ·《浣溪沙·细雨斜风作晓寒》'},
  {text:'海内存知己，\n天涯若比邻。',source:'王勃 ·《送杜少府之任蜀州》'},
  {text:'晴空一鹤排云上，\n便引诗情到碧霄。',source:'刘禹锡 ·《秋词·其一》'},
  {text:'青山一道同云雨，\n明月何曾是两乡。',source:'王昌龄 ·《送柴侍御》'},
  {text:'留连戏蝶时时舞，\n自在娇莺恰恰啼。',source:'杜甫 ·《江畔独步寻花·其六》'}
];

export function createQuoteCycle() {
  let index = 0;
  return () => bookshelfQuotes[index++ % bookshelfQuotes.length];
}
