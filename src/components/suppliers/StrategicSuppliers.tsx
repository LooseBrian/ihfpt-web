"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MessageSquare, Calendar, MapPin, TrendingUp, Globe } from "lucide-react";
import { suppliers } from "@/lib/data";

export function StrategicSuppliers() {
  const strategic = suppliers
    .filter((s) => s.tier === "S")
    .sort((a, b) => {
      if (a.storeId && !b.storeId) return -1;
      if (!a.storeId && b.storeId) return 1;
      return 0;
    });

  return (
    <section className="py-10 bg-gradient-to-b from-brand-900 to-brand-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-sm text-gold-300 font-medium">限量席位 · 顶级合作</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">平台战略标杆合作伙伴</h2>
          <p className="text-brand-200 text-sm max-w-xl mx-auto">
            严选头部企业，深度战略合作，代表平台最高供方水准
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategic.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.12] transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-brand-700 font-bold text-xl">{supplier.logo}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold text-xs">
                      S 级战略供应商
                    </Badge>
                    {supplier.isTangyuanhui && (
                      <Badge
                        variant="outline"
                        className="text-xs border-brand-300 text-brand-200"
                      >
                        棠源汇常驻
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold">{supplier.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-200 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.location}
                    </span>
                    <span>成立于 {supplier.foundedYear} 年</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-brand-100 leading-relaxed mb-4">
                {supplier.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {supplier.certs.map((cert) => (
                  <Badge
                    key={cert}
                    className="text-xs bg-white/10 text-white border-white/20"
                  >
                    {cert}
                  </Badge>
                ))}
                {supplier.qualifications?.map((q) => (
                  <Badge
                    key={q}
                    variant="outline"
                    className="text-xs border-brand-300 text-brand-200"
                  >
                    {q}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y border-white/10">
                <div className="text-center">
                  <div className="text-lg font-bold text-gold-400">{supplier.annualCapacity}</div>
                  <div className="text-xs text-brand-300">年产能</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gold-400 flex items-center justify-center gap-1">
                    <Globe className="h-4 w-4" />
                    {supplier.exportCountries}
                  </div>
                  <div className="text-xs text-brand-300">出口覆盖国家</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gold-400 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {supplier.exportVolume}
                  </div>
                  <div className="text-xs text-brand-300">年出口额</div>
                </div>
              </div>

              {supplier.productImages && supplier.productImages.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs text-brand-300 mb-2">主打产品</div>
                  <div className="flex gap-2">
                    {supplier.productImages.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10"
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Link href={`/store/${supplier.storeId || supplier.id}`}>
                  <Button
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 gap-1"
                  >
                    <Store className="h-3.5 w-3.5" />
                    进入品牌店铺
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-semibold gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  立即询盘
                </Button>
                {supplier.isTangyuanhui && (
                  <Button
                    size="sm"
                    className="bg-transparent hover:bg-white/10 text-brand-200 border border-brand-300/50 gap-1"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    预约看样
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
