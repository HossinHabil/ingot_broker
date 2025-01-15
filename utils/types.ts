export interface ApiResponse {
  name: string;
  stock: string;
  money: string;
  stockPrec: string;
  moneyPrec: string;
  makerFee: string;
  takerFee: string;
  minAmount: string;
  minTotal: string;
  tradesEnabled: boolean;
  type: string;
  isCollateral: boolean;
  maxTotal: string;
}

export type SymbolType = "sell" | "buy";

export interface Trade {
  id: number;
  time: number;
  price: string;
  amount: string;
  type: SymbolType;
}

export interface ResultData {
  method: string;
  params: [name: string, trades: Trade[]];
  id: number;
}
