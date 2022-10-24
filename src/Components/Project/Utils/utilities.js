import { ImHome } from 'react-icons/im';
import { DownCircleOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Hotjar from '../../../Assests/icons/hotjar.svg'

export const sidebarMenus = [
    {
        title: 'Home',
        id: 'home',
        icon: <ImHome />,
        clickHandler: () => console.log("home")
    },
    {
        title: 'Trending',
        id: 'trending',
        icon: <FontAwesomeIcon icon={Hotjar} />,
        clickHandler: () => console.log("trending")
    },
    {
        title: 'Movies',
        id: 'movies',
        icon: <DownCircleOutlined />,
        clickHandler: () => console.log("movies")
    },
    {
        title: 'Web series',
        id: 'web_series',
        icon: <DownCircleOutlined />,
        clickHandler: () => console.log("web series")
    },
    {
        title: 'Actor',
        id: 'actor',
        icon: <DownCircleOutlined />,
        clickHandler: () => console.log("actor")
    },
    {
        title: '18+',
        id: '18+',
        icon: <DownCircleOutlined />,
        clickHandler: () => console.log("18+")
    },
    {
        title: 'Favourites',
        id: 'favourites',
        icon: <DownCircleOutlined />,
        clickHandler: () => console.log("favourites")
    },
    {
        title: 'Categories',
        id: 'categories',
        icon: <DownCircleOutlined />,
        clickHandler: () => console.log("caregory")
    },
]