"use client";

import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  { top: "12%", left: "14%" },
  { top: "22%", left: "52%" },
  { top: "18%", left: "80%" },
  { top: "44%", left: "30%" },
  { top: "52%", left: "64%" },
  { top: "70%", left: "18%" },
  { top: "76%", left: "46%" },
  { top: "72%", left: "82%" },
];

const links = [
  { x1: "14%", y1: "12%", x2: "52%", y2: "22%" },
  { x1: "52%", y1: "22%", x2: "80%", y2: "18%" },
  { x1: "14%", y1: "12%", x2: "30%", y2: "44%" },
  { x1: "30%", y1: "44%", x2: "64%", y2: "52%" },
  { x1: "64%", y1: "52%", x2: "82%", y2: "72%" },
  { x1: "30%", y1: "44%", x2: "18%", y2: "70%" },
  { x1: "18%", y1: "70%", x2: "46%", y2: "76%" },
  { x1: "46%", y1: "76%", x2: "82%", y2: "72%" },
  { x1: "52%", y1: "22%", x2: "64%", y2: "52%" },
];

export function FounderSignalConsole() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="hidden lg:flex flex-col gap-4 mb-8" aria-label="Founder signal console">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-border bg-background p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Founder Signal Console</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Online</div>
        </div>

        <div className="relative border border-border/70 bg-secondary/60 h-52 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {links.map((line, idx) => (
              <line
                key={idx}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#0A0F1C"
                strokeOpacity="0.28"
                strokeWidth="0.6"
              />
            ))}
          </svg>

          {nodes.map((node, idx) => (
            <motion.div
              key={idx}
              className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 bg-primary border border-primary"
              style={{ top: node.top, left: node.left }}
              animate={prefersReducedMotion ? { opacity: 1 } : { scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: prefersReducedMotion ? 0 : Infinity, delay: idx * 0.12 }}
            />
          ))}

          <div className="absolute left-0 right-0 bottom-0 border-t border-border/60 bg-background/80 px-3 py-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>Node Density: 87%</span>
            <span className="text-primary">Pulse Stable</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Matches", value: "214" },
          { label: "Intros", value: "58" },
          { label: "Campuses", value: "31" },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="border border-border bg-background px-3 py-3"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground mb-2">{item.label}</div>
            <div className="font-serif text-2xl leading-none text-foreground">{item.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
