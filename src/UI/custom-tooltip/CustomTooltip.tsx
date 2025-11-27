import { FC, memo } from "react";
import { IChartDataPoint } from "../chart/Chart";

interface IProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartData: IChartDataPoint[];
}

export const CustomTooltip: FC<IProps> = memo(({
  active,
  payload,
  label,
  chartData,
}) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p>{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}%`}
            <br />
            <small>
              Visits:{" "}
              {chartData.find((d) => d.x === label)?.[
                `${entry.dataKey}_visits`
              ] || 0}
              , Conversions:{" "}
              {chartData.find((d) => d.x === label)?.[
                `${entry.dataKey}_conversions`
              ] || 0}
            </small>
          </p>
        ))}
      </div>
    );
  }
  return null;
});
