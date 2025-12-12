"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import {
  PromptInputActionAddAttachments,
  usePromptInputController,
  usePromptInputAttachments,
} from "./prompt-input";
import { PaperclipIcon, ImageIcon, MicIcon, PlusIcon, CornerDownLeftIcon, Loader2Icon } from "lucide-react";

type Props = {
  isLoading?: boolean;
  onSubmit?: () => void;
  children?: React.ReactNode;
};

export default function PromptInputToolbar({ isLoading, onSubmit }: Props) {
  const controller = usePromptInputController();
  const attachments = usePromptInputAttachments();

  return (
    <div className="flex items-center justify-between px-2 py-2 border-t bg-background">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        {/* Add button (dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <PlusIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <PromptInputActionAddAttachments />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* File upload button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => attachments.openFileDialog()}
        >
          <PaperclipIcon className="size-5" />
        </Button>

        {/* Add Image direct */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => attachments.openFileDialog()}
        >
          <ImageIcon className="size-5" />
        </Button>

        {/* Mic */}
        <Button type="button" variant="ghost" size="icon" className="rounded-xl">
          <MicIcon className="size-5" />
        </Button>
      </div>

      {/* RIGHT SECTION */}
      <div>
        <Button
          type="submit"
          disabled={isLoading || controller.textInput.value.trim() === ""}
          onClick={onSubmit}
          className="rounded-xl px-3"
        >
          {isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <CornerDownLeftIcon className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
