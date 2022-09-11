import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { fetchMethod } from '../../Utilies/utils';
import { useQueryCustomHook } from '../Hooks/useQueryCustomHook';
/*
    1> refetchOnMount => when true the query is fetched or a network call is made every time the component mounts irrespective of stale or not
    2> refetchOnWindowFocus => when enabled, whenever the window size changes query gets fired
    3> enabled => when true it's similar to componentDidMount
    4> caching => by default it caches the data as per key and when trying to get the same query it returns the same cached data
                In background it re-runs the query and checks if any uupdate was performed in db or not. If any update did take place, then the data is upadted in our UI as well. 
                This means api is fired and data is fetched and if any changes did occur it will get updated. For a while previous data will be shown then the latest data will get shown.
                If no data changes are there then you will see the cached data.
            staleTime => Suppose the api data for an endpoint doesn't change quite often and the cached data is being returned
                        However, the api is being fired and it's getting fetched. But this isn't required(Network call returning same data)
                        We can allow user to see stale data for certain time and then only also make a network call and check if the data got changed or not

    isLoading => associated with data content
    refetch => if we want to fire the query manually(Get request)
    isFetching => associated with whether query is being fired or not (even in background) => consider this for caching
    cacheTime => By default it caches the data as per key for 5 minutes. If caching time is over then the query is garbage collected
    select => it receives data and returns the modified data
    keepPreviousData => while switching between pagination, it keeps the previous data save till next data is fetched
    refetchInterval => time interval after which the query gets refired of its own. Specified in ms. Default value -> false
                        The query is only fetched when the window or tab is in focus
                    refetchIntervalInBackground => To re-run the query after every given interval even though the tab isn't in focus then use
*/
const ReactQueryTodo = () => {
    const getPhotos = async () => {
        const { data } = await fetchMethod('https://jsonplaceholder.typicode.com/photos')
        return data
    }

    const { data, error, refetch, isError } = useQueryCustomHook()

    // const {data: photosData, isLoading: photosLoading } = useQuery(['photos'], getPhotos, {refetchOnWindowFocus: false})
    // if (isLoading) {
    //     return <h2>Loading...</h2>
    // }
    if (isError) {
        return <div>Error: {(error as any).message}</div>
    }
    return (
        <>
            <div>
                <Button onClick={() => refetch()}>Click to trigger API call</Button>
            {(data ?? []).map((e: any) => (
                <div key={e.id}>
                    <Link to={`/todoDetails/${e.id}`}>
                        {e.title}
                    </Link>
                </div>
            ))}
            </div>
        </>
    )
}

export default ReactQueryTodo