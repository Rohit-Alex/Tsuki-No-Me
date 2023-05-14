const COMMON_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
}

const DEFAULT_INTERCEPTOR_CONFIG = {
    defaultLoader: true,
    defaultError: true,
    handleRetry: false,
    useMetaData: false,
    hasFormData: false,
    fullResponse: false
}

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