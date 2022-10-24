import './App.css';
import {Routes, Route, Navigate, Link, Outlet, useParams } from 'react-router-dom'
import Home from './Components/Home/Home';
import Miscellaneous from './Components/TestingComponent/Miscellaneous';
import DashboardDetails from './Components/Dashboard/DashboardDetails';
import Dashboard from './Components/Dashboard/Dashboard';
import Navigation from './Components/Navigation';
import MultilingualHeader from './Components/MultilingualHeader/MultilingualHeader';
import ReduxComponent from './Components/ReduxComponent/reduxComponent';
import Project from './Components/Project/project';
import Typescript from './Components/Typescript/Typescript';
import ApiCalling from './Components/ApiCallingInReact/ApiCalling';
import RuleGeneral from './Components/RuleGeneral';
import FormParent from './Components/FormParent';


const LearnCourses = () => <div>This is learn courses page <Outlet /></div>

const CourseDetailsByID = () => {
  const {courseId} = useParams()
  return (
    <div>
      <h4>URL  params is : {courseId}</h4>
    </div>
  )
}


const Learn = () => {
  return (
    <>
      <div>This is Learn page</div>
      <Link to="/learn/course">Courses</Link>
      <Link to="/learn/test">Test</Link>
      {/* when you want to render some inner routes inside Learn component just after the above nodes use Outlet */}
      <Outlet />
    </>
  )
}

function App() {
  return (
      <div className="App">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/navigation' element={<Navigation />} />
            <Route path='/react-query' element={<MultilingualHeader />} />
            <Route path='testing-component' element={<Miscellaneous />} />
            <Route path='redux' element={<ReduxComponent />} />
            <Route path='/dashboard' element={<Dashboard />} />  {/* this will match with given url with all the query params in it */}
            <Route path='dashboard/:id/:number' element={<DashboardDetails />} />
            <Route path='/learn' element={<Learn />}>
              {/* When nesting needs to be done /learn/course and all data of LearnCourses should come just after Learn and not stand alone */}
              <Route path='course' element={<LearnCourses />}>
                <Route path=':courseId' element= {<CourseDetailsByID />} />
              </Route>
            </Route>
            {/* if we write like this then the content of Learn courses would come stand alone
              <Route path='course' element={<LearnCourses />}/> */}
            <Route path='/learn1' element={<Navigate replace to="/learn" />}/>
            <Route path='/typescript' element={<Typescript />}/>
            <Route path='/api-calling' element={<ApiCalling />}/>
            <Route path='/project' element={<Project />}/>
            <Route path='/form-antd' element={<FormParent />}/>
            <Route path='*' element={<h4>Page not found</h4>}/>
          </Routes>
      </div>
  );
}

export default App;
