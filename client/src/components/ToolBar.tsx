import { Button } from "@/components/ui/button";
import { Pencil, Eraser } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface ToolbarProps {
  selectedTool: "pen" | "eraser";
  onToolChange: (tool: "pen" | "eraser") => void;
  color: string;
  onColorChange: (color: string) => void;
}

export const ToolBar = ({
  selectedTool,
  onToolChange,
  color,
  onColorChange,
}: ToolbarProps) => {
  return (
    <div className="animate-slideFadeInLeft flex flex-wrap items-center gap-4 p-3 my-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm">
      <div className="flex items-center gap-2">
        <Tooltip content="Pen Tool (P)">
          <Button
            variant={selectedTool === "pen" ? "default" : "outline"}
            size="icon"
            onClick={() => onToolChange("pen")}
            className="hover-lift w-9 h-9"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Eraser Tool (E)">
          <Button
            variant={selectedTool === "eraser" ? "default" : "outline"}
            size="icon"
            onClick={() => onToolChange("eraser")}
            className="hover-lift w-9 h-9"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>

      <div className="h-6 w-px bg-cream-200" />

      <div className="flex items-center gap-2">
        <Tooltip content="Choose Color">
          <div className="relative">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-9 h-9 rounded cursor-pointer opacity-0 absolute inset-0"
            />
            <div
              className="w-9 h-9 rounded border-2 border-white/50 shadow-sm"
              style={{ backgroundColor: color }}
            />
          </div>
        </Tooltip>
      </div>

      <div className="h-6 w-px bg-cream-200" />

      <div className="h-6 w-px bg-cream-200 hidden md:block" />
    </div>
  );
};
