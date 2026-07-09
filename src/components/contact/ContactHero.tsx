export function ContactHero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm text-brand-100 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            官方联系方式 · 线下对接入口
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            联系我们
          </h1>
          <p className="text-brand-100 text-base md:text-lg max-w-2xl mx-auto">
            连接中国优质清真食品产能与全球穆斯林消费市场，我们随时为您提供专业的咨询与对接服务
          </p>
        </div>
      </div>
    </section>
  );
}
