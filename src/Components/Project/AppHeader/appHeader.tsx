import './appHeader.scss'
import appLogo from '../../../Assests/icons/appLogo.jpg'

import { useSelector } from 'react-redux';
import { Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
const { Option } = Select;

const AppHeader = () => {
    const { isExpanded } = useSelector((state: any) => state.dashboard)
    const { i18n } = useTranslation();
    return (
        <div className={`app-header-ctn ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="left-part">
                <div className="app-logo-ctn">
                    <img src={appLogo} alt="" />
                </div>
                <div className="user-details">
                    <div className="user-title">Rohit</div>
                    <div className="user-city">Bokaro, Jharkhand</div>
                </div>
            </div>
            <div className="right-part">
                <Select
                    defaultValue="en"
                    style={{ width: 120 }}
                    onChange={value => {
                        i18n.changeLanguage(value)
                    }}
                >
                    <Option value="en">English</Option>
                    <Option value="hi">Hindi</Option>
                    <Option value="cl">Spainish</Option>
                </Select>
                <Button>Logout</Button>
            </div>
        </div>
    )
}
export default AppHeader