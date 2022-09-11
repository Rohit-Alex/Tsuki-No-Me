import { Fragment } from 'react'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'

const fetchColors = ({ pageParam = 1 }) => {
    return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`)
}

export const InfiniteQueriesPage = () => {
    const {
        isLoading,
        isError,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage
    } = useInfiniteQuery(['colors'], fetchColors, {
        getNextPageParam: (lastPage, pages) => {
            // lastPage => response that we get from last api which got hit
            // pages -> an array of object-> where each object holds data received from each api call.// here is the logic for next page, whether we should call next api or not (HasMore)
            if (pages.length < 4) {
                // this simply means we are incresing the current page
                return pages.length + 1
            } else {
                // when we have reached the last page and no more data to show
                return undefined
            }
        }
    })

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }

    return (
        <>
            <div>
                {data?.pages.map((group, i) => {
                    return (
                        <Fragment key={i}>
                            {group.data.map(color => (
                                <h2 key={color.id}>
                                    {color.id} {color.label}
                                </h2>
                            ))}
                        </Fragment>
                    )
                })}
            </div>
            <div>
                <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
                    Load more
                </button>
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
        </>
    )
}