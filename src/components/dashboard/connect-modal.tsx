"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { ConnectionInsert } from "@/types/database";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  onSuccess: () => void;
}

const connectSchema = z.object({
  message: z.string().trim().min(12, "Write at least 12 characters.").max(140, "Keep it under 140 characters."),
});

export function ConnectModal({ isOpen, onClose, receiverId, receiverName, onSuccess }: ConnectModalProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    const parsed = connectSchema.safeParse({ message });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please provide a better intro.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired. Please sign in again.");
      setLoading(false);
      return;
    }

    if (user.id === receiverId) {
      setError("You cannot send a request to yourself.");
      setLoading(false);
      return;
    }

    const payload: ConnectionInsert = {
      sender_id: user.id,
      receiver_id: receiverId,
      message: parsed.data.message,
      status: "PENDING",
    };

    const { error: insertError } = await supabase.from("connections").insert(payload);

    if (insertError) {
      setError("Request could not be sent. You may already have a pending request.");
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
    setMessage("");
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-6"
          >
            <div className="bg-secondary border border-border p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary/20 pointer-events-none" />

              <h2 className="font-serif text-3xl mb-2">Connect with {receiverName}</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-8 pb-4 border-b border-border/50">
                Founders respond best to high-signal intros.
              </p>

              <div className="space-y-6">
                {error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 font-mono text-sm">[Error] {error}</div>}

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-foreground font-bold">The Connection Brief (140 chars)</label>
                  <textarea
                    autoFocus
                    required
                    maxLength={140}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly explain why your theses align..."
                    className="input min-h-[100px] bg-background text-sm focus:border-primary transition-colors"
                  />
                  <div className="flex justify-end">
                    <span className="font-mono text-[9px] text-muted-foreground">{message.length}/140</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={onClose} className="flex-1 font-mono text-xs uppercase tracking-widest py-3 border border-border hover:bg-muted/50 transition-colors">
                    [ Cancel ]
                  </button>
                  <button
                    disabled={loading || !message.trim()}
                    onClick={handleConnect}
                    className="flex-[2] bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest py-3 border border-primary hover:bg-background hover:text-primary transition-all disabled:opacity-50"
                  >
                    {loading ? "Sending Signal..." : "Broadcast Request"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
