import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, Clock, Upload } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const qualifications = [
  {
    type: "营业执照",
    issuer: "山东省市场监督管理局",
    certNo: "91370700MA3XXXXX",
    issueDate: "2022-03-15",
    expiryDate: "2032-03-14",
    status: "valid",
    statusText: "有效",
  },
  {
    type: "SC 认证（食品生产许可）",
    issuer: "山东省食品药品监督管理局",
    certNo: "SC1073707XXXXX",
    issueDate: "2023-06-20",
    expiryDate: "2028-06-19",
    status: "valid",
    statusText: "有效",
  },
  {
    type: "HALAL 证书（JAKIM）",
    issuer: "JAKIM · 马来西亚伊斯兰发展局",
    certNo: "HALAL-JAKIM-2025-0812",
    issueDate: "2025-01-10",
    expiryDate: "2026-09-08",
    status: "expiring",
    statusText: "即将到期",
  },
  {
    type: "出口食品备案",
    issuer: "中华人民共和国海关总署",
    certNo: "CQ-3707-2024-XXXX",
    issueDate: "2024-05-12",
    expiryDate: "2027-05-11",
    status: "valid",
    statusText: "有效",
  },
  {
    type: "MUI HALAL 认证",
    issuer: "MUI · 印度尼西亚乌里玛委员会",
    certNo: "HALAL-MUI-2025-0345",
    issueDate: "2025-03-22",
    expiryDate: "2026-07-20",
    status: "expiring",
    statusText: "即将到期",
  },
];

const statusConfig = {
  valid: { icon: CheckCircle2, color: "text-brand-600 bg-brand-50", border: "border-brand-200" },
  expiring: { icon: AlertTriangle, color: "text-gold-600 bg-gold-50", border: "border-gold-300" },
  expired: { icon: Clock, color: "text-red-600 bg-red-50", border: "border-red-200" },
};

export function SupplierQualifications() {
  return (
    <section id="qualifications" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="资质档案库"
          subtitle="企业资质与产品证书统一归档 — 到期自动预警，支持在线核验"
        />

        <div className="max-w-4xl mx-auto">
          {/* Upload button */}
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg font-medium text-sm hover:bg-brand-700 transition-colors">
              <Upload className="h-4 w-4" />
              上传新资质
            </button>
          </div>

          <div className="space-y-3">
            {qualifications.map((cert, idx) => {
              const status = statusConfig[cert.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 rounded-xl border p-5 ${status.border} ${
                    cert.status === "expiring" ? "bg-gold-50/30" : "bg-white"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${status.color}`}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-brand-900 text-sm">{cert.type}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cert.statusText}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        证书编号: <span className="font-mono text-foreground">{cert.certNo}</span>
                      </div>
                      <div>发证机构: {cert.issuer}</div>
                      <div>发证日期: {cert.issueDate}</div>
                      <div className={cert.status === "expiring" ? "text-gold-700 font-semibold" : ""}>
                        到期日期: {cert.expiryDate}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {cert.status === "expiring" ? (
                      <button className="px-3 py-1.5 text-xs bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 transition-colors whitespace-nowrap">
                        续期
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-brand-600 hover:border-brand-300 transition-colors whitespace-nowrap">
                        查看
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning banner */}
          <div className="mt-6 bg-gold-50 rounded-xl p-4 flex items-start gap-3 border border-gold-200">
            <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
            <p className="text-sm text-gold-800 leading-relaxed">
              <strong>到期自动预警：</strong>
              2 项资质证书将在 90 天内到期。请及时办理续期手续，避免影响产品上架与询盘接收。
              平台将在证书到期前 60 天、30 天、7 天分别发送提醒通知。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
