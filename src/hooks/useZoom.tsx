import { useCallback, useMemo, useState } from "react";
import { TPoint } from "../types/interfaces";

interface ZoomRange {
  startIndex: number;
  endIndex: number;
}

export function useZoom(points: TPoint[]) {
  //zoom diapason
  const [zoomRange, setZoomRange] = useState<ZoomRange | null>(null);

  const datesArray = useMemo(() => {
    return points.map((p) => p.dateISO);
  }, [points]);

  const canZoomIn = useMemo(() => {
    if (!zoomRange || datesArray.length === 0) return true;
    const current = zoomRange.endIndex - zoomRange.startIndex;
    return current > 15;
  }, [zoomRange, datesArray.length]);

  const canZoomOut = useMemo(() => {
    const total = datesArray.length;
    if (total === 0) return false;
    if (!zoomRange) return false;

    const current = zoomRange.endIndex - zoomRange.startIndex;
    return current < total * 0.9;
  }, [zoomRange, datesArray.length]);

  const chartData = useMemo(() => {
    if (!zoomRange || datesArray.length === 0) return points;

    const { startIndex, endIndex } = zoomRange;
    const visible = datesArray.slice(startIndex, endIndex + 1);
    return points.filter((p) => visible.includes(p.x));
  }, [points, zoomRange, datesArray]);

  const zoomIn = useCallback(() => {
    if (datesArray.length === 0) return;

    setZoomRange((prev) => {
      const total = datesArray.length;

      if (!prev) {
        const initial = Math.max(15, Math.floor(total * 0.7));
        const startIndex = Math.max(0, total - initial);
        return { startIndex, endIndex: total - 1 };
      }

      const size = prev.endIndex - prev.startIndex;
      if (size <= 15) return prev;

      const shrink = Math.max(2, Math.floor(size * 0.1));
      return {
        startIndex: prev.startIndex + shrink,
        endIndex: prev.endIndex - shrink,
      };
    });
  }, [datesArray.length]);

  const zoomOut = useCallback(() => {
    if (datesArray.length === 0 || !canZoomOut) return;

    setZoomRange((prev) => {
      const total = datesArray.length;

      if (!prev) {
        const initial = Math.max(15, Math.floor(total * 0.8));
        const startIndex = Math.max(0, total - initial);
        return { startIndex, endIndex: total - 1 };
      }

      const size = prev.endIndex - prev.startIndex;
      const expand = Math.max(2, Math.floor(size * 0.1));
      let newStart = Math.max(0, prev.startIndex - expand);
      let newEnd = Math.min(total - 1, prev.endIndex + expand);

      if (newEnd - newStart >= total * 0.9) return null;

      return { startIndex: newStart, endIndex: newEnd };
    });
  }, [datesArray.length, canZoomOut]);

  const resetZoom = useCallback(() => {
    setZoomRange(null);
  }, []);

  return {
    zoomRange,
    chartData,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomRange,
  };
}
