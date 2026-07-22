import { SafeImage } from "@/components/shared/SafeImage";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { projects } from "@/lib/data";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="标杆产业项目"
          subtitle="国内外标志性清真产业园区与合作项目，展现平台产业深度与全球布局"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[16/9]">
                <SafeImage
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-900/60 group-hover:bg-brand-900/50 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-1 text-gold-400 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>标杆项目</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-brand-100 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            探索产业生态
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
