import { useState } from 'react'

import { Link } from 'react-router-dom'
import { useAddSuperHeroData, useAddSuperHeroData1, useAddSuperHeroData2, useAddSuperHeroData3, useGetSuperHeroesData } from '../Hooks/useTodoDetailsQuery'

export const RQSuperHeroesPage = () => {
    const [name, setName] = useState('')
    const [alterEgo, setAlterEgo] = useState('')

    const { isLoading, data, isError, error, refetch } = useGetSuperHeroesData()

    //when used this method then we need to call the super-hereos api again manually by clicking on fetch button
    // const { mutate } = useAddSuperHeroData()

    // when used this then no need to click the fetch button
    // const { mutate } = useAddSuperHeroData1()

    // this method is most efficient as it doesn't make an additional api call of refetching and utilizes the the cached data and appends response from mutation
    const { mutate } = useAddSuperHeroData2()

    // this method is best and known as optimistic updates
    // const { mutate } = useAddSuperHeroData3()




    const handleAddHeroClick = () => {
        const hero = { name, alterEgo }
        mutate(hero)
    }

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }
    return (
        <>
            <h2>React Query Super Heroes Page</h2>
            <div>
                <input
                    type='text'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type='text'
                    value={alterEgo}
                    onChange={e => setAlterEgo(e.target.value)}
                />
                <button onClick={handleAddHeroClick}>Add Hero</button>
            </div>
            <button onClick={refetch}>Fetch heroes</button>
            {data?.data.map(hero => {
                return (
                    <div key={hero.id}>
                        <Link to={`/rq-super-heroes/${hero.id}`}>
                            {hero.id} {hero.name}
                        </Link>
                    </div>
                )
            })}
        </>
    )
}