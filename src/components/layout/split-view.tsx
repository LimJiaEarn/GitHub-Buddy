"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SplitViewProps {
  leftPane: React.ReactNode;
  centerPane?: React.ReactNode;
  rightPane?: React.ReactNode;
  leftPaneWidth?: number;
  centerPaneWidth?: number;
  minLeftPaneWidth?: number;
  maxLeftPaneWidth?: number;
  minCenterPaneWidth?: number;
  maxCenterPaneWidth?: number;
  className?: string;
}

export function SplitView({
  leftPane,
  centerPane,
  rightPane,
  leftPaneWidth = 15,
  centerPaneWidth = 50,
  minLeftPaneWidth = 15,
  maxLeftPaneWidth = 35,
  minCenterPaneWidth = 30,
  maxCenterPaneWidth = 60,
  className,
}: SplitViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [dimensions, setDimensions] = useState({
    leftWidth: leftPaneWidth,
    centerWidth: centerPaneWidth,
    rightWidth: 100 - leftPaneWidth - centerPaneWidth,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingLeft && !isResizingRight) return;
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isResizingLeft) {
        const leftWidthPercent =
          ((e.clientX - containerRect.left) / containerWidth) * 100;

        // Apply constraints
        const newLeftWidth = Math.max(
          minLeftPaneWidth,
          Math.min(maxLeftPaneWidth, leftWidthPercent)
        );

        // Adjust the center width to maintain the right pane width
        const rightWidth = dimensions.rightWidth;
        const newCenterWidth = 100 - newLeftWidth - rightWidth;

        setDimensions({
          leftWidth: newLeftWidth,
          centerWidth: newCenterWidth,
          rightWidth: rightWidth,
        });
      } else if (isResizingRight) {
        const centerRightEdgePercent =
          ((e.clientX - containerRect.left) / containerWidth) * 100;
        const newRightWidth = 100 - centerRightEdgePercent;

        // Calculate new center width based on the right edge position
        const newCenterWidth = 100 - dimensions.leftWidth - newRightWidth;

        // Apply constraints
        if (
          newCenterWidth >= minCenterPaneWidth &&
          newCenterWidth <= maxCenterPaneWidth
        ) {
          setDimensions({
            leftWidth: dimensions.leftWidth,
            centerWidth: newCenterWidth,
            rightWidth: newRightWidth,
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizingLeft,
    isResizingRight,
    dimensions,
    minLeftPaneWidth,
    maxLeftPaneWidth,
    minCenterPaneWidth,
    maxCenterPaneWidth,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full overflow-hidden", className)}
    >
      {/* Left pane */}
      <div
        className="h-full overflow-auto"
        style={{ width: `${dimensions.leftWidth}%` }}
      >
        {leftPane}
      </div>

      {/* Left resizer */}
      <div
        className="h-full w-1 bg-border hover:bg-primary/50 hover:w-1 cursor-col-resize"
        onMouseDown={() => setIsResizingLeft(true)}
      />

      {/* Center pane */}
      <div
        className="h-full overflow-x-auto"
        style={{ width: `${dimensions.centerWidth}%` }}
      >
        {centerPane}
      </div>

      {/* Right resizer */}
      <div
        className="h-full w-1 bg-border hover:bg-primary/50 hover:w-1 cursor-col-resize"
        onMouseDown={() => setIsResizingRight(true)}
      />

      {/* Right pane */}
      <div className="h-full" style={{ width: `${dimensions.rightWidth}%` }}>
        {rightPane}
      </div>
    </div>
  );
}
