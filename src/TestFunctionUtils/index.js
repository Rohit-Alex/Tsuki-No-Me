import { EntityService, handleAuthentication } from "Utilies/utils"

export async function testFn() {
    const entityService = new EntityService()
    const data = await entityService.entities()
    if (data) {
        if (data === 'FAILED') return 'FAILED'
        return data
    } else {
        return 'API FAILED'
    }
}


export const checkIsAuthenticated = (status) => {
    const res = handleAuthentication(status)
    return res;
}
