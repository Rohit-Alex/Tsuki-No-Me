import { Select, Tooltip } from "antd"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"
// import { useBasicInfoContext } from "../BasicInfo.js/BasicInfo";
import DropdownList from "../TestingComponent/Dropdown";
import Widget from "../TestingComponent/widget2";
type IUserDetails = {
  firstName: string
  lastName: string
  city: string
  country: string
  state: string
  gender: string
}

const Home = () => {
  const [userDetails, setUserDetails] = useState<IUserDetails>({} as IUserDetails)
  // const { updateCurrentLang } = useBasicInfoContext()

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', margin: 'auto', width: '60%'}}>
        <Link to="/navigation">Navigation</Link>
        <Link to="/react-query">React Query</Link>
        <Link to="/redux">Redux</Link>
        <Link to="/testing-component">Testing Component</Link>
        <Link to="/general">General</Link>
        <Link to="/project">Project</Link>
        <Link to="/typescript">Typescript</Link>
        <Link to="/api-calling">ApiCalls</Link>
        <Link to="/form-antd">FORM</Link>
        <Link to="/styled-comp">Styled components</Link>
        <DropdownList />
      </div>

    </>
  )
}

export default Home