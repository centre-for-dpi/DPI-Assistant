import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Learning from "./Components/Learning";
import Dpi_deployment from "./Components/Dpi_deployment";
import Case_study from "./Components/Case_study";

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  }, 
  {
    path:'/learning',
    element:<Learning/>
  },
  {
    path:'/dpi-deployment',
    element:<Dpi_deployment/>
  },
  {
    path:'/case-study',
    element:<Case_study/>
  }
])

export default function App() {
  return (
      <>
        <div>
      <RouterProvider router={appRouter}/>
        </div>
      </>
  )
}
