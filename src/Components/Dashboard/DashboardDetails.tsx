import { useLocation, useParams } from "react-router-dom"
import { ILocation } from "../../Constant";

const DashboardDetails = () => {
    const location = useLocation()
    const { id = 7984, number = 7984065620 } = useParams()
    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop as string),
    }) as any;
    const { nickname, trademark } = queryParams; // using this query params get method, we won't be able to give default value while destructuring 
    const { state } = location as ILocation
    const { name = 'Default name', age = 'Default age' } = state || {}
    console.log("Inside Dashboard Details Component -------->>>")
    return (
        <>
            <div>This is the dashboard details </div>
            <div>
                <strong>Data received from location state</strong>
                <br />
                <span> User name: {name}</span>
                <br />
                <span> user age: {age}</span>
            </div>
            <div>
                <strong>Params passed are:</strong>
                <br />
                <span>id: {id}</span>
                <br />
                <span>number: {number}</span>
            </div>
            <div>
                <strong>Query Params:</strong>
                <span>NickName: {nickname || 'Default nickname'}</span>
                <br />
                <span>Trademark: {trademark || 'Default trademark'}</span>
                <br />
            </div>
        </>
    )
}

export default DashboardDetails
