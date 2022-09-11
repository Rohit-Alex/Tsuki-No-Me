import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { apiCalled, getApiData } from "../../Redux/Actions/GetApiData"

const ReduxComponent = () => {
    const dipatch = useDispatch()
    const { responseData = [] } = useSelector(state => state.apiData)
    useEffect(()=>{
        dipatch(apiCalled())

        console.log("component mounted")
        // axios.get('https://jsonplaceholder.typicode.com/users')
        //     .then(res => {
        //         const users = res.data
        //         console.log(users)
        //     })
        // getApiData()
    }, [])
    return (
        <div>
            Reduc ReduxComponent
        </div>
    )
}

export default ReduxComponent