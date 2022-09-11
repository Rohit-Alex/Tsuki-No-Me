import { useQuery } from "@tanstack/react-query"
import axios from "axios"
const fetchUserByEmail = (email) => {
    return axios.get(`http://localhost:4000/users/${email}`)
}

const fetchCourseByChannelId = (channelId) => {
    return axios.get(`http://localhost:4000/channels/${channelId}`)
}

const DependentQueryPage = ({email}) => {
    const { data: user} = useQuery(['user', email], () => fetchUserByEmail(email))
    const channelId = user?.data.channelId

    // below query gets fired up only when we have got the result from above query
    const { data: channelDetails } = useQuery(['courses', channelId], () => fetchCourseByChannelId(channelId), {
        enabled: !!channelId
    })

    return (
        <div>
            Dependent Query Page
            {channelDetails?.data && channelDetails?.data.courses.join(', ')}
        </div>
    )
}

export default DependentQueryPage