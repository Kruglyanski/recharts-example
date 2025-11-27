export type TData = {
  data: TRawRow[];
  variations: {name: string, id?: number}[];
};

export type TRawRow = {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
};

export type TPoint = {
  x: string;
  dateISO: string;
  variation: string;
  visits: number;
  conversions: number;
  conversionRate: number;
};
