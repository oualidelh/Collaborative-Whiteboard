"use client";
import { Button } from "@/components/ui/button";
import { Eraser, Trash2, Brush, LogOut } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Slider } from "./ui/slider";
import { StylePicker } from "@/components/StylePicker";

interface ToolbarProps {
  selectedTool: "default" | "pen" | "eraser";
  onToolChange: (tool: "pen" | "eraser") => void;
  color: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  HandleClearCanvas: () => void;
  leaveRoom: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onStyleApplied?: (styledImageData: string, styleType: string) => void;
  onLoading?: (isLoading: boolean) => void;
}

export const ToolBar = ({
  selectedTool,
  onToolChange,
  color,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  HandleClearCanvas,
  leaveRoom,
  canvasRef,
  onStyleApplied,
  onLoading,
}: ToolbarProps) => {
  return (
    <div className="animate-slideFadeInLeft relative z-20 flex flex-wrap items-center gap-4 p-3 my-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm">
      <div className="flex items-center gap-2">
        <Tooltip content="Pen Tool (P)">
          <Button
            variant={selectedTool === "pen" ? "default" : "outline"}
            size="icon"
            onClick={() => onToolChange("pen")}
            className="hover-lift w-9 h-9"
          >
            {/* <Pencil className="h-4 w-4" /> */}
            <Brush className="h-4 w-4" />
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

        <Tooltip content="Clear Canvas (X)">
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => HandleClearCanvas()}
            className="hover-lift w-9 h-9"
          >
            <Trash2 className="h-4 w-4" />
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
      <div className="flex items-center gap-4 flex-1 max-w-xs">
        <span className="text-sm text-charcoal-700 whitespace-nowrap">
          Stroke Width
        </span>
        <Slider
          value={[strokeWidth]}
          onValueChange={(value) => onStrokeWidthChange(value[0])}
          min={1}
          max={20}
          step={1}
          className="w-32 hover:cursor-pointer"
        />
      </div>
      <div className="h-6 w-px bg-cream-200 hidden md:block" />
      <Tooltip content="Transform Your Draw Into Styles">
        <StylePicker
          canvasRef={canvasRef}
          onStyleApplied={onStyleApplied}
          onLoading={onLoading}
        />
      </Tooltip>

      <Tooltip content="Leave Room">
        <Button
          variant={"default"}
          size="icon"
          onClick={leaveRoom}
          className=" w-9 h-9"
        >
          <LogOut className="h-4 w-4" />
          {/* <p className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Log-Out
              </p> */}
        </Button>
      </Tooltip>
    </div>
  );
};
