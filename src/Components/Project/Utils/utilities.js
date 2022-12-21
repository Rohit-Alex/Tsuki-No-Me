import { ImHome } from 'react-icons/im';
import { DownCircleOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Hotjar from '../../../Assests/icons/hotjar.svg'
import { message } from 'antd';

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


function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
        message.success("Copied Successfully");
    } catch (err) {
        message.error("Could not copy ID");
    }

    document.body.removeChild(textArea);
}

const copy = async (text) => {
    // await navigator.clipboard.writeText(ques.question_text);
    if (!navigator.clipboard) {
        // fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        message.success('Copied Successfully')
    }, function (err) {
        message.error('Could not copy ID');
    });
};
