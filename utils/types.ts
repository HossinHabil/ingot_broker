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