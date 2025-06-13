"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BoxProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

const Box = ({ children, className, animate = false }: BoxProps) => {
  const classes = cn(
    "flex items-center justify-between w-full",
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={classes}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default Box;