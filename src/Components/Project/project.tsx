import AppHeader from "./AppHeader/appHeader"
import Sidebar from "./Sidebar/sidebar"
import './project.scss'
const Project = () => {

    return (
        <div className="fixed-wrapper">
            <Sidebar />
            <AppHeader />
        </div>
    )
}
export default Project