
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { CampaignStatus } from "@/lib/campaign";

interface DonationFloatingBarProps {
    status: CampaignStatus;
    percentage: number;
    whatsappUrl: string;
}

export function DonationFloatingBar({
    status,
    percentage,
    whatsappUrl,
}: DonationFloatingBarProps) {
    if (status === "finalizada") {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(21,33,41,0.12)] px-4 py-3"
            >
                <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-foreground truncate">
                                Campaña Hermosa Haruén
                            </span>
                            <span className="font-extrabold text-[#ef7225] ml-2">
                                {percentage}%
                            </span>
                        </div>
                        <div
                            className="w-full h-2 bg-muted rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuenow={percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Progreso móvil de la campaña"
                        >
                            <div
                                className="h-full bg-[#ef7225] rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ef7225] hover:bg-[#d8621a] text-white font-bold text-xs shadow-sm transition-transform active:scale-95 flex-shrink-0"
                    >
                        <MessageCircle size={14} />
                        <span>Comprobante</span>
                    </a>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
