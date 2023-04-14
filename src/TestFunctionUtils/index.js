import { EntityService } from "Utilies/utils"

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


