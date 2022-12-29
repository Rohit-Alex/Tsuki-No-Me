import { Button } from "antd"
import { useState } from "react"

const GlobalFunctions = () => {
    const [lsValue, setLsValue] = useState('')

    const getItemFromLS = key => setLsValue(JSON.parse(localStorage.getItem(key)))
    const setItemInLS = (key, value) => { localStorage.setItem(key, JSON.stringify(value)) }
    const consoleForDebug = value => {
        console.log(value)
    }


    return (
        <>
            {lsValue && <h2>{lsValue}</h2>}
            <Button onClick={() => setItemInLS('enimem', 'lose_yourself')}>Set_Item</Button>
            <Button onClick={() => getItemFromLS('enimem')} >Get_Item</Button>
            <Button onClick={() => consoleForDebug('slim_shady')}>console</Button>
        </>
    )
}

export default GlobalFunctions