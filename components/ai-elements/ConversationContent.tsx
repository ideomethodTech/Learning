"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { StickToBottom } from "use-stick-to-bottom";

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => {
  return (
    <StickToBottom.Content
      className={cn("flex flex-col gap-6 p-4", className)}
      {...props}
    />
  );
};
