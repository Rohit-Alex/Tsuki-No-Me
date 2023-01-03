1> const pathArray = [] // [[{id: 123, name: 'CBSE'}, {id: 341, name: 'class3'}]]
        boardLevelData.forEach(async (e) => {
            const parentElement = e.syllabus_details[0].syllabus_id
            const childElement = e.syllabus_details.slice(-1)[0].syllabus_id
            let fullPath = []
            try {
                fullPath = await syllabusParentDetails(parentElement, childElement, 'all', 'V001')
            } catch (err) {
                window.GlobalFunctions.consoleLog("Error from syllabusParentDetails", err);
            }
            const eachPath = fullPath.map(e => ({id: e.syllabusId, name: e.syllabusName}))
            pathArray.push(eachPath)
        })
        
        
        const pathArray = [] // [[{id: 123, name: 'CBSE'}, {id: 341, name: 'class3'}]]
        let promises = boardLevelData.map(async (e) => {
            return new Promise((resolve=>{
                const parentElement = e.syllabus_details[0].syllabus_id
                const childElement = e.syllabus_details.slice(-1)[0].syllabus_id
                syllabusParentDetails(parentElement, childElement, 'all', 'V001').then((res)=>{
                    resolve(res)
                }).catch(err=>{
                    resolve([])
                })
            }))
        })
        let pathArrays = await Promise.all(promises);
        pathArrays.map((fullPath)=>{
            const eachPath = fullPath.map(e => ({ id: e.syllabusId, name: e.syllabusName }))
            pathArray.push(eachPath)
        })
        
        
2> const setUpFinalAssessmentDat = async (assessmentData) => {
    if (assessmentData) {
      await Promise.all(assessmentData.map(async (assess) => {
        const res = await formSyllabusData(assess?.syllabus_id)
        let groupResponse = []
        try {
          const data = await getGroupDetailById(assess?.group_id)
          groupResponse = data
        } catch (err) {
          console.log(err, 'error from group name by id API')
        }
        assess.subjects = res
        assess.groupName = groupResponse?.[0]?.group_name
        return assess;
      }))
    }
    return assessmentData
  }
  
3> await Promise.all([contentDetailsByContentIds(contentList), SyllabusParentDetail(syllabusID, version)].map(p => p.catch(e => e)))
 
 
4> const newResult = allChilds?.child_list?.map(async item => {
      console.log("user name :", item?.username)
      dispatch(isApiCall())
      let result1 = await getSecondaryDetApiCall(
        item?.child_uuid,
        item?.username
      );
      if (result1?.school && result1?.learning_profiles) {
        return { ...result1, tempProfileData: [...result1?.school, ...result1?.learning_profiles], child_uuid: item?.child_uuid }
      }
      else if (result1?.school) {
        return { ...result1, tempProfileData: result1?.school, child_uuid: item?.child_uuid }
      }
      else if (result1?.learning_profiles) {
        return { ...result1, tempProfileData: result1?.learning_profiles, child_uuid: item?.child_uuid }
      }
    });
    const childData = await Promise.all(newResult);