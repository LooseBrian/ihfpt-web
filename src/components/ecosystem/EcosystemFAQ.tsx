"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ecosystemFAQs } from "@/lib/data";

export function EcosystemFAQ() {
  const [openId, setOpenId] = useState<string | null>(ecosystemFAQs[0]?.id || null);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="常见问题"
          subtitle="关于产业生态合作、园区入驻、联盟加入等常见问题解答"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {ecosystemFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? "text-brand-600" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-foreground text-sm">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-13 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-muted-foreground leading-relaxed pl-8">
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
