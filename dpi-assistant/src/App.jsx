import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Learning from "./Components/Learning";


const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  }, 
  {
    path:'/learning',
    element:<Learning/>
  },
  
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
