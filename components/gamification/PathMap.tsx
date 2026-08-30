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

const DEMO_NODES: PathNode[] = [
  { id: "1", title: "Candidat unique", slug: "naked-single", status: "completed", unitOrder: 1 },
  { id: "2", title: "Candidat caché", slug: "hidden-single", status: "completed", unitOrder: 2 },
  { id: "3", title: "Paire nue", slug: "naked-pair", status: "available", unitOrder: 3 },
  { id: "4", title: "Réduction bloc", slug: "pointing-pair", status: "locked", unitOrder: 4 },
  { id: "5", title: "X Wing", slug: "x-wing", status: "locked", unitOrder: 5 },
];

function NodeIcon({ status }: { status: PathNodeStatus }) {
  if (status === "locked") return <Lock className="size-5 text-muted-foreground" />;
  if (status === "crowned") return <Crown className="size-5 text-amber-300" />;
  if (status === "completed") return <Star className="size-5 fill-white text-white" />;
  return <span className="text-lg font-bold text-white">▶</span>;
}

export function PathMap({ nodes = DEMO_NODES }: { nodes?: PathNode[] }) {
  return (
    <div className="relative mx-auto flex max-w-xs flex-col items-center gap-6 py-4">
      {nodes.map((node, index) => {
        const align = index % 2 === 0 ? "self-center" : index % 4 === 1 ? "self-start ml-8" : "self-end mr-8";
        const href =
          node.status === "locked"
            ? undefined
            : `/app/jouer?technique=${node.slug}`;

        const body = (
          <motion.div
            whileTap={node.status !== "locked" ? { scale: 0.92 } : undefined}
            className={cn(
              "flex size-16 items-center justify-center rounded-full shadow-lg ring-4 ring-white",
              node.status === "locked" && "path-node-locked",
              node.status === "available" && "path-node-available",
              (node.status === "completed" || node.status === "crowned") && "path-node-done",
            )}
          >
            <NodeIcon status={node.status} />
          </motion.div>
        );

        return (
          <div key={node.id} className={cn("flex flex-col items-center gap-2", align)}>
            {href ? <Link href={href}>{body}</Link> : body}
            <p
              className={cn(
                "max-w-[8rem] text-center text-xs font-semibold",
                node.status === "locked" ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {node.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
