// Transcribed from the nine images selected by the user; attributions follow those images.
export const bookshelfQuotes = [
  {
    "text": "要永远年轻，\n永远热情，\n永远不听话；\n要大笑，要做梦，\n要与众不同，\n人生是一场伟大的冒险。",
    "source": "弗雷德里克·巴克曼 ·《外婆的道歉信》"
  },
  {
    "text": "祝你今天愉快，\n你明天的愉快\n留着我明天再祝。",
    "source": "王小波 ·《爱你就像爱生命》"
  },
  {
    "text": "愿你生命中\n有足够多的云翳，\n来造成一个美丽的黄昏。",
    "source": "冰心 ·《谈生命》"
  },
  {
    "text": "我们好运多多，\n杏子饺子葡萄酒，\n我们身体健康，\n祝愿人人都有一个好月亮。",
    "source": "维马丁 ·《夏夜》"
  },
  {
    "text": "愿你在这原始的中心\n安宁而幸福地居住",
    "source": "海子 ·《春天》"
  },
  {
    "text": "苍天和大地，\n是两面巨大的合十的手掌。\n我们在其中，都被祝福。",
    "source": "梁书正 ·《群山祈祷》"
  },
  {
    "text": "从今把定春风笑，\n且作人间长寿仙。",
    "source": "李鼐 ·《鹧鸪天·种得门阑五福全》"
  },
  {
    "text": "愿君千万岁，\n无岁不逢春。",
    "source": "李远 ·《剪彩》"
  },
  {
    "text": "祝我的眼睛笑眯，\n只看向真正的生活\n与真正的我。",
    "source": "焦野绿 ·《我笃信会有人喜欢我的奇形怪状》"
  }
];

export function createQuoteCycle() {
  let index = 0;
  return () => bookshelfQuotes[index++ % bookshelfQuotes.length];
}
