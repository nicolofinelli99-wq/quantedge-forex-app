// Historical backtested performance, provided by the client (5.5 years of data).
// Figures are in "R" — R-multiples, i.e. a multiple of the amount risked on a
// single trade. E.g. "67R in 2025" means the strategy netted 67x the per-trade
// risk unit across that year. This is the standard way prop/retail trading
// strategies report performance independent of account size.
//
// This is plain historical data, not DB-backed — it doesn't change often. If it
// needs to become admin-editable later (like plan pricing), it can move to a
// `backtest_results` table the same way plan_prices did.

export type BacktestStrategyKey = "STRAT_1" | "STRAT_2" | "STRAT_3";

export interface BacktestStrategy {
  key: BacktestStrategyKey;
  name: string;
  yearlyR: { year: number; r: number }[];
  maxDrawdownR: number;
}

export const BACKTEST_STRATEGIES: BacktestStrategy[] = [
  {
    key: "STRAT_1",
    name: "Strategy 1",
    yearlyR: [
      { year: 2021, r: 81 },
      { year: 2022, r: 64 },
      { year: 2023, r: 78 },
      { year: 2024, r: 59 },
      { year: 2025, r: 67 },
    ],
    maxDrawdownR: -9,
  },
  {
    key: "STRAT_2",
    name: "Strategy 2",
    yearlyR: [
      { year: 2021, r: 36 },
      { year: 2022, r: 33 },
      { year: 2023, r: 29 },
      { year: 2024, r: 35 },
      { year: 2025, r: 28 },
    ],
    maxDrawdownR: -3,
  },
  {
    key: "STRAT_3",
    name: "Strategy 3",
    yearlyR: [
      { year: 2021, r: 71 },
      { year: 2022, r: 74 },
      { year: 2023, r: 65 },
      { year: 2024, r: 73 },
      { year: 2025, r: 78 },
    ],
    maxDrawdownR: -6,
  },
];

export function averageR(strategy: BacktestStrategy): number {
  const sum = strategy.yearlyR.reduce((acc, y) => acc + y.r, 0);
  return sum / strategy.yearlyR.length;
}

export const BACKTEST_YEARS = [2021, 2022, 2023, 2024, 2025];
