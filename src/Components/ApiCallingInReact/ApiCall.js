import axios, { Axios } from "axios";
import { makeHttpRequestWithCancel } from "../../Utilies/utils";

export const getAllProducts = () => {
    /* using returning a promise
    return new Promise((resolve, reject) => {
        axios.get('https://fakestoreapi.com/products')
            .then(res => {
                // dispatch()
                resolve(res)
            })
            .catch(err => reject(err))
    })
    */

    /* Using asynch await 
        let res
    try {
        const data = await axios.get('https://fakestoreapi.com/products')
        res = data
    } catch (err) {
        console.log(err.message)
    } finally {
        return res
    }
    */
}

export const getDetails = async (id) => {
    const options = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/title/get-details',
        params: { tconst: id },
        headers: {
            'X-RapidAPI-Key': '0e32187380msh81bb930f061ede1p10d526jsn6e25bfffc627',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };
    /* one way of calling i.e. returning a promise ---->>>
    return new Promise((resolve, reject) => {
        axios.request(options).then(function (response) {
            details = response.data;
            resolve(details)
        }).catch(function (error) {
            console.error(error);
            resolve([])
        });
    })
    */
    /* 2nd way of calling ---->>>
    const data = await axios.request(options)
    return data.data
 */
}

export const getUpcomingMovieDetails = () => {
    let upcomingMovies = [];
    const options = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/title/get-coming-soon-movies',
        params: { homeCountry: 'US', purchaseCountry: 'US', currentCountry: 'US' },
        headers: {
            'X-RapidAPI-Key': '0e32187380msh81bb930f061ede1p10d526jsn6e25bfffc627',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    axios.request(options).then(async function (response) {
        //   console.log(response.data);
        if (response.data.length) {
            /* One way of calling i.e. using promise.all
            const apiArr = []
            response.data.forEach((movie, idx) => {
                const id = movie?.id.split("/")[2];
                if (idx < 3) apiArr.push(getDetails(id));
                
            })
            const data = await Promise.all(apiArr)
            */

            /* 2nd way of calling using iteration and await
            let counter = 1
            for(const movie of response.data ){
                if (counter > 3) break;
                const id = movie?.id.split("/")[2];
                const movieDetails = await getDetails(id);
                upcomingMovies.push(movieDetails);
                counter++
            }
            */

        }
    }).catch(err => {
        console.error(err);
    });
}

export const getDetailsUsingCancel = (id, setSource) => {
    return new Promise((resolve, reject) => {
        makeHttpRequestWithCancel({
            path: 'https://imdb8.p.rapidapi.com/title/get-details',
            method: "GET",
            setSource:setSource,
            isCancelable:true,
            params: { tconst: id },
            headers: {
                'X-RapidAPI-Key': '0e32187380msh81bb930f061ede1p10d526jsn6e25bfffc627',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        })
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            if(Axios.isCancel(err)){
                reject(err || "Cancelled from api")
            } else
            reject(err?.response?.data?.message || "Something went wrong");
        });
    })
}

/*
While calling getDetailsUsingCancel, we will pass the id and a state setter function which would set the token for the current api call.
Everytime before calling this function, at first we would check if a token exists in that state or not. If it exists then cancel it.

e.g. const getDetails =  () => {
    if (source) source.cancel('Cancelled')
    getDetailsUsingCancel(id, setSource)
            .then(data => {
                
            }).catch(err => {
                
            }).finally(() => {
                
            })
}
*/