"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { serviceFAQs } from "@/lib/data";

export function ServiceFAQ() {
  const [openId, setOpenId] = useState<string | null>(serviceFAQs[0]?.id ?? null);

  return (
    <section className="py-14 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="常见问题"
          subtitle="关于服务中心的常见疑问解答，如未覆盖您的问题，欢迎在线咨询"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {serviceFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <HelpCircle
                    className={`h-5 w-5 shrink-0 ${
                      isOpen ? "text-brand-600" : "text-muted-foreground"
                    }`}
                  />
                  <span className="flex-1 text-sm font-medium text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pl-12">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
