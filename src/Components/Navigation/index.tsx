import { Button } from "antd"
import { NavLink, useNavigate } from "react-router-dom"

const Navigation = () => {
    const navigate = useNavigate()
    return (
        <>
            <h2>Nav Links & Navigate</h2>
            <div>
                <strong>Navigation using click(navigate method)</strong>
                <Button style={{ marginLeft: '12px' }} onClick={() => { navigate('/dashboard?nickname=alex&trademark=trust', { state: { name: 'Rohit', age: 24 }, }) }}> Query Params with state</Button>
                <Button style={{ marginLeft: '12px' }} className='ml-4' onClick={() => { navigate(`/dashboard/${2}/${9304410487}`) }}>Only params</Button>
                <Button style={{ marginLeft: '12px' }} className='ml-4' onClick={() => { navigate(`/dashboard/${2}/${9304410487}?nickname=alex&trademark=neverBackDown`) }}>Query params & params</Button>
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: 'auto', width: '61%', marginTop: '20px' }}>
                    <strong>Navigation using NavLink</strong>
                    <NavLink to='/dashboard?nickname=alex&trademark=trust' state={{ name: 'Rohit', age: 24 }} style={({ isActive }) => ({ color: isActive ? 'green' : 'blue' })} className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}> Query Params with state</NavLink>
                    <NavLink to={`/dashboard/${2}/${9304410487}`} state={{ name: 'Rohit', age: 24 }} style={({ isActive }) => ({ color: isActive ? 'green' : 'blue' })} className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}> State & params</NavLink>
                    <NavLink to={`/dashboard/${2}/${9304410487}?nickname=alex&trademark=neverBackDown`} state={{ name: 'Rohit', age: 24 }} style={({ isActive }) => ({ color: isActive ? 'green' : 'blue' })} className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}> Query params, Params & State</NavLink>
                </div>
            </div>
        </>
    )
}
export default Navigation

/*
navigate(-1) // history.goBack()
navigate('/about, {replace: true}) // history.replace('/about)
*/