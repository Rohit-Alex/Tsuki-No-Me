import { ArrowLeftOutlined } from '@ant-design/icons';
import './sidebar.scss'
import { sidebarMenus } from '../Utils/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { changeSidebarState } from '../../../Redux/Actions/Dashboard';
const Sidebar = () => {
    const dipatch = useDispatch()
    const { isExpanded } = useSelector((state: any) => state.dashboard)
    
    const expandOrCollapseHandler = () => {
        dipatch(changeSidebarState(!isExpanded))
    }

    return (
        <div className={`sidebar-ctn ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {isExpanded ? <>
                <div className="header-ctn">
                    <h2 className='sidebar-title'>Moviebuzz</h2>
                    <div className='collapse-left-icon' onClick={expandOrCollapseHandler}><ArrowLeftOutlined /></div>
                </div>
                <div className='sidebar-menus'>
                    {sidebarMenus.map(e => (
                        <div className='sidebar-menu' onClick={e.clickHandler}>
                            <div className='menu-icon'>{e.icon}</div>
                            <div className='menu-title'>{e.title}</div>
                        </div>
                    ))}

                </div>
            </> :
                <>
                    <div className="header-ctn">
                        <div className='collapse-left-icon' onClick={expandOrCollapseHandler}><ArrowLeftOutlined rotate={180} /></div>
                    </div>
                    <div className='sidebar-menus'>
                        {sidebarMenus.map(e => (
                            <div className='sidebar-menu' onClick={e.clickHandler}>
                                <div className='menu-icon'>{e.icon}</div>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default Sidebar