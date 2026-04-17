import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  tag?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Panel({ title, tag, right, className, children }: PanelProps) {
  return (
    <section className={cn("panel flex flex-col", className)}>
      <header className="panel-header">
        <div className="flex items-center gap-2">
          {tag && (
            <span className="text-term-green text-[10px] tracking-[0.25em]">
              [{tag}]
            </span>
          )}
          <span>{title}</span>
        </div>
        <div className="text-term-dim text-[10px]">{right}</div>
      </header>
      <div className="panel-body flex-1 overflow-hidden">{children}</div>
    </section>
  );
}
