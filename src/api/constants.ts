export const GENERALIZED_RESPONSE = (defaultData = {}, defaultErr = '') => ({
    loading: false,
    fetched: false,
    data: defaultData,
    error: defaultErr
})

const ENVIRONMENT = 'prod'

const BASE_URL_MAPPING = {
    prod: {
        MERCHANT_APP: 'https://merchant-app-api.domain.in/merchant'
    },
    dev: {
        MERCHANT_APP: 'https://merchant-app-api.domain.io/merchant'
    },
    test: {
        MERCHANT_APP: 'https://merchant-app-api.domain.test/merchant'
    }
}

export const BASE_URLS = BASE_URL_MAPPING[ENVIRONMENT]