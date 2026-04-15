import { BrowserRouter as Router } from "react-router-dom";


export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Router>
        {children}
    </Router>
  )
}