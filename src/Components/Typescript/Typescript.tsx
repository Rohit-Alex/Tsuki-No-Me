import React, { useCallback, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom';
import { COLUMN_DATA } from '../../Constant';

interface IUser {
  name: string; 
  age: number;
  gender: string;
}
interface IStatementNo {
  id?: string;
  number?: string;
}

type IUpdatedStatementNoList = IStatementNo & {
  isDisable?: boolean;
};

type IAddedListDetails = IStatementNo & {
  note?: string;
  referenceId?: string;
};

// The same thing can be done using extends as well but would need interface for that. Extends works with intefaces only.
interface IAddedListDetails2 extends IStatementNo {
  note?: string;
  referenceId?: string;
}

interface IAppProps {
  comments?: Comment[];
  children?: React.ReactNode; 
  functionChildren?: (name: string) => React.ReactNode; 
  style?: React.CSSProperties; 
  onChange?: React.FormEventHandler<HTMLInputElement>; 
}

declare type ISettlement = string | string[] | number

// <---------- GENERICS ---------->

//  e.g. 1
interface IGenericResponse <T extends { success: boolean }>{
  statusCode: number,
  message: string,
  loading: boolean,
  data: T
}

// after extending it means that the apiResponse must be having a key named success of boolean type.

interface IApiResponse {
  animation: string,
  massacre: string[],
  plot: string,
  success: boolean
}

const apiResponse = {
  statusCode: 200,
  message: 'Succefully fetched',
  loading: false,
  data: { animation: 'Demon slayer', massacre: ['AOT', 'Death Note'], plot: 'Naruto', success: true }
}

const finalResponse: IGenericResponse<IApiResponse> = apiResponse
finalResponse.statusCode
finalResponse.data.massacre
finalResponse.data.success
finalResponse.message

//  e.g. 2
function simpleState<T>(initialState: T): [() => T, (v: T) => void] {
  let val: T = initialState;
  return [
    () => val, 
    (v: T) => {
      val =  v
    }
  ]
}

const [st1getter, st1setter] = simpleState(20)
console.log(st1getter)
st1setter(69)
console.log(st1getter)

const [st2getter, st2setter] = simpleState<string | null>(null)
console.log(st2getter)
st2setter('Hello world')
console.log(st2getter)

// <---------- ENUMS ------------->
const ONLINE = 'online'
const OFFLINE = 'offline'

// We can wrap this 2 constants into 1 using enums. Advisable to use const prior to using enums for better efficiency

const enum networkStatus {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

// However, enums are not optimized so its better to use as const

const favAnimeByCategoryOptmized = {
  BEST_ANIMATION: 'Demon Slayer',
  STORY: 'Naruto',
  MASSACRE: 'AOT'
} as const

// This is equivalent to enums declared above but more optimized only difference "as const"

const currentMood = {
  fav: favAnimeByCategoryOptmized.BEST_ANIMATION,
  myStatus: networkStatus.OFFLINE
}

interface dummyObject {
  num1: number;
  string1: string;
  array1: string[];
  object1: {[key: string]: string} //an object with key of type string and value of type string
  boolean1: boolean;
  multipleType: number | undefined
  settlement: ISettlement
}

const messageObject: {[key: string]: {[key: string]: string}} = {
    "SUCCESS": {
    status: ('SUCCESS'),
    message: ('SUCCESS_MSG')
  },
  "MANDATORY FIELDS MISSING":{
    status: ('MANDATORY FIELDS MISSING'),
    message: ('MANDATORY_FIELDS_MSG')
  },
  "FAILED": {
    status: ('FAILED'),
    message: ('FAILED_MSG')
  },
}

const data: ({'STATUS': string} | null)[] = [null, {STATUS: 'status'}]
const exportStatus: {[key: string] : string} = {STATUS: "SUCCESS"}
const description=  messageObject[exportStatus?.STATUS].message

type IKeysVal = "pending" | "resolved" | "rejected";
const obj1: { [key in IKeysVal]: string } = {
  pending: "pending",
  resolved: "resolved",
  rejected: "rejected",
};

const obj = {
  name: 'rohit',
  details: {
    nickname: 'alex'
  }
}
type IDetails  = {
name: string;
details: {nickname: string}
}
const { name, details: { nickname} } : IDetails = obj
interface IObserver {
  current: {
    disconnect: () => void
    observer: (node: HTMLDivElement) => void
  }
}
declare type IAPIDate = {[key: string]: any}[]

const initialValueForInputValue = () => {
  console.log('initialization function running')
  return ''
}

let isMounted = true;




const Typescript: React.FC<IAppProps> = ({comments}: IAppProps) => {
  const [userDetails, setUserDetails] = useState<Partial<IUser>>({})
  // const [inputName, setInputName] = useState<string>('') // initializing like this causes the state to initialize every time
  // const [inputName, setInputName] = useState<string>(initialValueForInputValue()) // This also runs at each re-render but can we used if some slow process or logic is used for its default value
  const [inputName, setInputName] = useState<string>(() => initialValueForInputValue()) // This also runs for 1st time and best way to initialize a state variable. The setupFunction can be a slow process as well. Preffred for slow and complex functions used to initialize default value
  
  const [page, setPage] = useState<number>(1)
  const [requestBody, setRequestBody] = useState<{[key: string]: string | number | string[] | number[]}>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [apiData, setApiData] = useState<IAPIDate>([])

  const observer: any = useRef<HTMLDivElement>()
    const lastElement = useCallback((node: any) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(previndex => previndex + 1);
            }
        });
        if (node) observer.current.observe(node);
    },
        [isLoading]
    );

    const apiCall = async (startIndex: number, pagination = false) => {
      setIsLoading(true)
      try {
        const body = {
          "user_type": 3,
          "stage": ['1', '2', '3'],
          "language_id": 1,
          "filter": requestBody,
          "page_no": startIndex,
        }
        // const data = await someFun(body)
        if (isMounted) {

            // pagination ? setApiData(prev => [...prev, ...data?.content ?? []]) : setApiData(data?.content ?? []) // for method 2
            // setApiData(prev => [...prev, ...data?.content ?? []]) // for method 1

            // if no field is coming then apply pagination as per data you need per page
            // setHasMore(data?.content.length >= 10)
            // setHasMore(data?.hasMore)
        }
        // setPage('sdsd')
      } catch (err) {
        console.log(err)
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }

    const searchFunction = ({key, value}: {key: string, value: string}) => {
      // method 1 using batch updates
      unstable_batchedUpdates(() => {
        setApiData([])
        setPage(1)
        setRequestBody(prev => ({...prev, key: value}))
      })
      // end of method 1

      // method 2 using separate useEffects
      setRequestBody(prev => ({...prev, key: value}))
      // end of method 2
    }

    // method 1 using batch updates and single useEffect
      useEffect(() => {
        apiCall(page)
      }, [page, requestBody])
    // end of method 1

    //method 2 using separate useEffect
      useEffect(() => {
        if (page !== 1) {
          isMounted = true
            apiCall(page, true)  //for pagination a flag is being passed. When true append it or just replace it
        }
        return () => {
          isMounted = false
        }
      }, [page])

      useEffect(() => {
        isMounted = true
        setPage(1);
        apiCall(1, false);
        return () => {
          isMounted = false
        }
      }, [JSON.stringify(requestBody)])
    // end of method 2

  return (
    <div className="App">
      <header className="">
          TypeScript
      </header>
      <input type="text" value={inputName} onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setInputName(e.target.value)}/>
      {COLUMN_DATA.map((e: any, idx: number, arr: any[]) => (
        <div key={idx} ref={idx === arr.length - 1 && hasMore ? lastElement : null}>
          <div>{e!.title}</div>
          <div>{e.icon}</div>
          </div>
      ))}
    </div>
  )
}

export default Typescript

