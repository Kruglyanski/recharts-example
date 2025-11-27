import { useEffect, useMemo, useState } from "react";
import { aggregateByDay, aggregateByWeek } from "../utils/aggregate";
import { EAggregation } from "../types/enums";
import { TData, TRawRow } from "../types/interfaces";

export function useChartData(aggregation: EAggregation) {
  const [raw, setRaw] = useState<TRawRow[]>([]);
  const [allVars, setAllVars] = useState<string[]>([]);
  const [visibleVars, setVisibleVars] = useState<string[]>([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data.json")
      .then((r) => r.json())
      .then((d: TData) => {
        setRaw(d.data);

        const vars = d.variations.map((v) => v.name).sort();
        setAllVars(vars);
        setVisibleVars(vars.slice(0, Math.min(2, vars.length)));
      })
      .catch(console.error);
  }, []);

  const points = useMemo(() => {
    return aggregation === EAggregation.Day
      ? aggregateByDay(raw)
      : aggregateByWeek(raw);
  }, [raw, aggregation]);

  const yDomain = useMemo<[number, number] | undefined>(() => {
    const filtered = points.filter((p) => visibleVars.includes(p.variation));
    if (!filtered.length) return;

    const vals = filtered.map((p) => p.conversionRate);
    const min = Math.floor(Math.min(...vals) - 1);
    const max = Math.ceil(Math.max(...vals) + 1);
    return [Math.max(0, min), max];
  }, [points, visibleVars]);

  const onToggleVariation = (v: string) => {
    setVisibleVars((prev) => {
      const next = (() => {
        const set = new Set(prev);
        set.has(v) ? set.delete(v) : set.add(v);
        return [...set];
      })();
      if (next.length === 0) return prev;
      return next;
    });
  };

  return {
    raw,
    allVars,
    visibleVars,
    setVisibleVars,
    onToggleVariation,
    points,
    yDomain,
  };
}
