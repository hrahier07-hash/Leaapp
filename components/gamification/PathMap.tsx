"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Lock, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type PathNodeStatus = "locked" | "available" | "completed" | "crowned";

export type PathNode = {
  id: string;
  title: string;
  slug: string;
  status: PathNodeStatus;
  unitOrder: number;
};

const LESSONS: PathNode[] = [
  { id: "1", title: "Case évidente", slug: "naked-single", status: "completed", unitOrder: 1 },
  { id: "2", title: "Chiffre caché", slug: "hidden-single", status: "completed", unitOrder: 2 },
  { id: "3", title: "Paire nue", slug: "naked-pair", status: "available", unitOrder: 3 },
  { id: "4", title: "Bloc et ligne", slug: "pointing-pair", status: "locked", unitOrder: 4 },
  { id: "5", title: "Aile en X", slug: "x-wing", status: "locked", unitOrder: 5 },
];

function NodeIcon({ status }: { status: PathNodeStatus }) {
  if (status === "locked") return <Lock className="size-4" />;
  if (status === "crowned") return <Crown className="size-4" />;
  if (status === "completed") return <Star className="size-4 fill-current" />;
  return <span className="text-sm font-bold">▶</span>;
}

export function PathMap({ nodes = LESSONS }: { nodes?: PathNode[] }) {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {nodes.map((node, index) => {
        const offset = index % 2 === 0 ? "translate-x-0" : index % 4 === 1 ? "-translate-x-8" : "translate-x-8";
        const href = node.status === "locked" ? undefined : `/app/lecon/${node.slug}`;

        const circle = (
          <motion.div
            whileTap={node.status !== "locked" ? { scale: 0.94 } : undefined}
            className={cn(
              "flex size-14 items-center justify-center rounded-full shadow-sm",
              node.status === "locked" && "path-node-locked",
              node.status === "available" && "path-node-available",
              (node.status === "completed" || node.status === "crowned") && "path-node-done",
            )}
          >
            <NodeIcon status={node.status} />
          </motion.div>
        );

        return (
          <div key={node.id} className={cn("flex flex-col items-center gap-1.5", offset)}>
            {href ? <Link href={href}>{circle}</Link> : circle}
            <p className="max-w-[9rem] text-center text-xs font-medium">{node.title}</p>
          </div>
        );
      })}
    </div>
  );
}
