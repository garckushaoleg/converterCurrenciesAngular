export interface ExchangeRates {
    usd?: string;
    eur?: string;
}

export interface MultiFetchResponse {
    base: string;
    results: {
        EUR?: number;
        UAH?: number;
        USD?: number;
    },
    updated: string;
    ms: number;
}
