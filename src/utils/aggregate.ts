import { parseISO, startOfWeek, format } from 'date-fns';
import { TPoint, TRawRow } from '../types/interfaces';

export function computeConversionRate(conversions: number, visits: number) {
  if (!visits) return 0;
  return (conversions / visits) * 100;
}

export function aggregateByDay(rows: TRawRow[]): TPoint[] {
  const points: TPoint[] = [];
  rows.forEach((row) => {
    Object.keys(row.visits).forEach((variation) => {
      const visits = row.visits[variation] || 0;
      const conversions = row.conversions[variation] || 0;
      
      points.push({
        x: format(parseISO(row.date), 'yyyy-MM-dd'),
        dateISO: row.date,
        variation,
        visits,
        conversions,
        conversionRate: computeConversionRate(conversions, visits)
      });
    });
  });
  console.log(points);
  return points.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}

export function aggregateByWeek(rows: TRawRow[]): TPoint[] {
  const map = new Map<string, { 
    visits: number; 
    conversions: number; 
    dateISO: string; 
    variation: string;
  }>();

  rows.forEach((row) => {
    const d = parseISO(row.date);
    const weekStart = startOfWeek(d, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    Object.keys(row.visits).forEach((variation) => {
      const fullKey = `${variation}_${weekKey}`;
      const visits = row.visits[variation] || 0;
      const conversions = row.conversions[variation] || 0;
      
      const prev = map.get(fullKey);
      if (prev) {
        prev.visits += visits;
        prev.conversions += conversions;
      } else {
        map.set(fullKey, { 
          visits, 
          conversions, 
          dateISO: weekKey,
          variation
        });
      }
    });
  });

  const points: TPoint[] = [];
  
  for (const [, val] of map) {
    points.push({
      x: val.dateISO,
      dateISO: val.dateISO,
      variation: val.variation,
      visits: val.visits,
      conversions: val.conversions,
      conversionRate: computeConversionRate(val.conversions, val.visits)
    });
  }

  return points.sort((a, b) => a.x.localeCompare(b.x));
}