import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Learning from "./Components/Learning";
import Methodology from "./Components/Methodology";


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
    path:'/methodology',
    element:<Methodology/>
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
