searchQuestion(body)
            .then(data => {
                if (pagination) {
                    setQuestionData((prev) => [...prev, ...(data?.questionData ?? [])])
                    setQuestionCountTotal(prev => Number(prev) + Number(data?.questionData.length ?? 0))
                }
                else {
                    setQuestionData(data?.questionData ?? []);
                    setQuestionCountTotal(data?.questionData.length ?? 0)
                }
                setHasMore(data?.questionData?.length >= 20);
            }).catch(err => {
                window.GlobalFunctions.consoleLog('Error from search question', err)
                if (get(err, "response.status", "") === 401 || get(err, "response.status", "") === 503) {
                    getRefreshToken(() => getQuestionsList(startIndex));
                }
                setHasMore(false);
            }).finally(() => {
                setIsLoadingQuestionData(false);
            })

        getQuestionCount(body)
            .then(data => {
                if (pagination) setQuestionCountTotal(prev => Number(prev) + Number(data?.total_count ?? 0))
                else setQuestionCountTotal(data?.total_count ?? 0);
            }).catch(err => {
                window.GlobalFunctions.consoleLog('Error from get question count', err)
            }).finally(() => {
                setQuesCountLoading(false)
            })
            
            
            // using Promise.all
            
                // let responses = await Promise.all([searchQuestion(body), getQuestionCount(body)].map((p) => p.catch((e) => e)))
                // if (responses[0].status) {
                //     if (pagination) {
                //         setQuestionData((prev) => [...prev, ...(responses[0]?.questionData ?? [])])
                //     }
                //     else {
                //         setQuestionData(responses[0]?.questionData ?? []);
                //     }
                //     setHasMore(responses[0]?.questionData?.length >= 20);
                // } else {
                //     window.GlobalFunctions.consoleLog('Error from get question count', responses[0]?.message)
                // }
                // if ('total_count' in responses[1]) {
                //     if (pagination) setQuestionCountTotal(prev => Number(prev) + Number(responses[1]?.total_count ?? 0))
                //     else setQuestionCountTotal(responses[1]?.total_count ?? 0);
                // } else {
                //     window.GlobalFunctions.consoleLog('Error from get question count', responses[1]?.message)
                // }
                // setIsLoadingQuestionData(false)
                // setQuesCountLoading(false)
                
                        // try {
        //     const data = await searchQuestion(body);
        //     if (pagination) {
        //         setQuestionData((prev) => [...prev, ...(data?.questionData ?? [])])
        //     }
        //     else {
        //         setQuestionData(data?.questionData ?? []);
        //     }
        //     setHasMore(data?.questionData?.length >= 20);
        // } catch (err) {
        //     window.GlobalFunctions.consoleLog('Error from search question', err)
        //     if (get(err, "response.status", "") === 401 || get(err, "response.status", "") === 503) {
        //         getRefreshToken(() => getQuestionsList(startIndex));
        //     }
        //     setHasMore(false);
        // } finally {
        //     setIsLoadingQuestionData(false);
        // }

        //     try {
        //         const data = await getQuestionCount(body)
        //         if (pagination) setQuestionCountTotal(prev => Number(prev) + Number(data?.total_count ?? 0))
        //         else setQuestionCountTotal(data?.total_count ?? 0);
        //     } catch (err) {
        //         window.GlobalFunctions.consoleLog('Error from get question count', err)
        //     } finally {
        //         setQuesCountLoading(false)
        //     }