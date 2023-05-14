export interface IGENERALIZED_API_RESPONSE <T>{
    loading: boolean;
    fetched: boolean;
    data: T;
    error: {
        message: string;
    }
}

export const GENERALIZED_RESPONSE = {
    loading: '',
    fetched: '',
    data: {},
    error: {}
}