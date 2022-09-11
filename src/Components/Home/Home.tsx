import { Select } from "antd"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"
import { useBasicInfoContext } from "../BasicInfo.js/BasicInfo";
import MultilingualHeader from "../MultilingualHeader/MultilingualHeader"
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
  const { updateCurrentLang } = useBasicInfoContext()

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', margin: 'auto', width: '60%'}}>
        <Link to="/navigation">Navigation</Link>
        <Link to="/react-query">React Query</Link>
        <Link to="/redux">Redux</Link>
        <Link to="/testing-component">Testing Component</Link>
        <Link to="/general">General</Link>
        <Link to="/project">Project</Link>

      </div>
      
    </>
  )
}

export default Home