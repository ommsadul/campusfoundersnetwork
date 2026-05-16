"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Profile } from "@/types/database";

interface FounderCardProps {
  founder: Profile;
  onConnect: () => void;
  index: number;
}

export function FounderCard({ founder, onConnect, index }: FounderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border p-6 flex flex-col hover:border-primary transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-muted-foreground/30 select-none">
        ID_{founder.id.substring(0, 4).toUpperCase()}
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-serif text-3xl text-foreground leading-none group-hover:text-primary transition-colors">
            {founder.first_name} {founder.last_name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
            {founder.location || "Remote"}
          </p>
        </div>
        <span className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 border ${
          founder.is_technical
            ? "border-primary/20 text-primary bg-primary/5"
            : "border-accent/20 text-accent bg-accent/5"
        }`}>
          {founder.is_technical ? "TECH" : "BIZ"}
        </span>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 border-b border-border/30 block pb-1 mb-2">Thesis_Statement</span>
          <p className="text-sm font-medium leading-relaxed italic line-clamp-3">
            &ldquo;{founder.idea_description || "Exploring the frontier of university innovation..."}&rdquo;
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(founder.startup_areas || []).map((area: string) => (
            <span key={area} className="text-[9px] font-mono lowercase border border-border/50 px-2 py-0.5 text-muted-foreground group-hover:border-primary/30 transition-colors">
              #{area.replace(/\s+/g, "")}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Link
          href={`/profile/${founder.id}`}
          className="flex-1 font-mono text-[10px] uppercase tracking-widest text-center py-3 border border-border hover:bg-secondary transition-colors"
        >
          [ Full_Profile ]
        </Link>
        <button
          onClick={onConnect}
          className="flex-1 bg-primary text-primary-foreground font-mono font-bold text-[10px] uppercase tracking-widest py-3 border border-primary hover:bg-background hover:text-primary transition-all"
        >
          Connect
        </button>
      </div>
    </motion.div>
  );
}
