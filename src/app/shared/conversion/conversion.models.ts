export interface Currencies {
    currency: string;
    value: string;
}

export interface Option {
    value: string;
    selected: boolean;
    direction: string;
}

export interface ConversionsForm {
    from?: Currencies;
    to?: Currencies;
}

export interface ConversionsResponse {
    base: string;
    amount: number;
    result: ResultOfConversionsResponse;
    ms: number;
}

export interface ResultOfConversionsResponse {
    USD?: number;
    UAH?: number;
    EUR?: number;
    rate: number;
}