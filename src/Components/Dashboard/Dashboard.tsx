import { useLocation } from 'react-router-dom'
import { ILocation } from '../../Constant';
const Dashboard = () => {
    const location = useLocation()
    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop as string),
    }) as any;

    // const { state: { name, age } = {} } = location as ILocation 
    // when location.state comes "null" then state won't be assigned {}. Default values are only assigned when it comes as "undefined"
    const { state } = location as ILocation
    const { name = 'Default name', age = 'Default age'} = state || {}
    const { nickname, trademark } = queryParams; // using this query params get method, we won't be able to give default value while destructuring 
    console.log("Inside Dashboard Component -------->>>")

    return (
        <>
            <div>This is the dashboard</div>
            <div>
                <strong>Data received from location state</strong>
                <br />
                <span> User name: {name}</span>
                <br />
                <span> user age: {age}</span>
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

export default Dashboard