import React, { useEffect } from "react"
import { getAllProducts } from "./ApiCall";

function ApiCalling() {

    useEffect(() => {
        const res = getAllProducts();
        console.log(res, 'response')
    }, [])


    useEffect(() => {
        const helperFun = async () => {
            try {
                const res = await getAllProducts();
                console.log(res, 'response')
            } catch (err) {
                console.log(err)
            }
        }
        helperFun()

    }, [])


    useEffect(() => {
        getAllProducts().then(res => console.log(res, 'response'))
            .catch(err => console.log(err))
    }, [])

    return (
        <div>ApiCalling</div>
    )
}

export default ApiCalling