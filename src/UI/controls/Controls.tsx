import React, { memo, useCallback, useMemo } from "react";
import styles from "./Controls.module.css";
import {
  ChevronDown,
  Download,
  SunMoon,
  RotateCw,
  Plus,
  Minus,
  Sun,
} from "lucide-react";
import { EAggregation, ELineStyle } from "../../types/enums";

export interface ControlsProps {
  variations: string[];
  selected: string[];
  onToggleVariation: (name: string) => void;
  aggregation: EAggregation;
  onAggregationChange: (a: EAggregation) => void;
  lineStyle: ELineStyle;
  onLineStyleChange: (s: ELineStyle) => void;
  dark: boolean;
  onToggleTheme: () => void;
  onExportPNG: () => void;
  onResetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

interface ZoomButtonConfig {
  key: string;
  handler: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  className: string;
}

interface SmallButtonConfig {
  key: string;
  handler: () => void;
  icon: React.ReactNode;
}

export const Controls: React.FC<ControlsProps> = memo(
  ({
    variations,
    selected,
    onToggleVariation,
    aggregation,
    onAggregationChange,
    lineStyle,
    onLineStyleChange,
    dark,
    onToggleTheme,
    onExportPNG,
    onResetZoom,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
  }) => {

    const variationsLabel =
      selected.length === variations.length
        ? "All variations selected"
        : `${selected.length} selected`;

    const aggregationLabel = aggregation === EAggregation.Day ? "Day" : "Week";

    const lineStyleLabel = `Line style: ${lineStyle}`;


    const handleDayClick = useCallback(
      () => onAggregationChange(EAggregation.Day),
      [onAggregationChange]
    );

    const handleWeekClick = useCallback(
      () => onAggregationChange(EAggregation.Week),
      [onAggregationChange]
    );

    const handleLine = useCallback(
      () => onLineStyleChange(ELineStyle.Line),
      [onLineStyleChange]
    );

    const handleSmooth = useCallback(
      () => onLineStyleChange(ELineStyle.Smooth),
      [onLineStyleChange]
    );

    const handleArea = useCallback(
      () => onLineStyleChange(ELineStyle.Area),
      [onLineStyleChange]
    );

    const handleVariationToggle = useCallback(
      (v: string) => () => onToggleVariation(v),
      [onToggleVariation]
    );


    const zoomButtons: ZoomButtonConfig[] = useMemo(
      () => [
        {
          key: "zoomOut",
          handler: zoomOut,
          disabled: !canZoomOut,
          icon: <Minus size={16} />,
          className: styles.splitedLeftButton,
        },
        {
          key: "zoomIn",
          handler: zoomIn,
          disabled: !canZoomIn,
          icon: <Plus size={16} />,
          className: styles.splitedRightButton,
        },
      ],
      [zoomIn, zoomOut, canZoomIn, canZoomOut]
    );

    const smallButtons: SmallButtonConfig[] = useMemo(
      () => [
        {
          key: "resetZoom",
          handler: onResetZoom,
          icon: <RotateCw size={16} />,
        },
        {
          key: "exportPNG",
          handler: onExportPNG,
          icon: <Download size={16} />,
        },
        {
          key: "toggleTheme",
          handler: onToggleTheme,
          icon: dark ? <Sun size={16} /> : <SunMoon size={16} />,
        },
      ],
      [onResetZoom, onExportPNG, onToggleTheme, dark]
    );

    // ---------- RENDER ----------
    return (
      <div className={styles.wrapper}>
        <div className={styles.leftControls}>
          {/* Variations dropdown */}
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton}>
              {variationsLabel}
              <span className={styles.arrow}>
                <ChevronDown size={16} />
              </span>
            </button>
            <div className={styles.menu}>
              {variations.map((v) => (
                <label key={v} className={styles.item}>
                  <input
                    type="checkbox"
                    checked={selected.includes(v)}
                    onChange={handleVariationToggle(v)}
                  />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Aggregation dropdown */}
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton}>
              {aggregationLabel}
              <span className={styles.arrow}>
                <ChevronDown size={16} />
              </span>
            </button>
            <div className={styles.menu}>
              <div className={styles.item} onClick={handleDayClick}>
                Day
              </div>
              <div className={styles.item} onClick={handleWeekClick}>
                Week
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightControls}>
          {/* Line style dropdown */}
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton}>
              {lineStyleLabel}
              <span className={styles.arrow}>
                <ChevronDown size={16} />
              </span>
            </button>
            <div className={styles.menu}>
              <div className={styles.item} onClick={handleLine}>
                Line
              </div>
              <div className={styles.item} onClick={handleSmooth}>
                Smooth
              </div>
              <div className={styles.item} onClick={handleArea}>
                Area
              </div>
            </div>
          </div>

          {/* zoom buttons */}
          <div>
            {zoomButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={btn.handler}
                disabled={btn.disabled}
                className={btn.className}
              >
                {btn.icon}
              </button>
            ))}
          </div>

          {/* other buttons */}
          {smallButtons.map((btn) => (
            <button
              key={btn.key}
              className={styles.smallButton}
              onClick={btn.handler}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>
    );
  }
);
