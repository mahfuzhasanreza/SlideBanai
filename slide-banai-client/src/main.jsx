import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Home from './components/Home/Home';
import { Toaster } from 'react-hot-toast';




const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'register',
        element: <Register></Register>
      },
      {
        path: 'e-book',
        element: <BookDashboard></BookDashboard>
      },
      {
        path: 'professional-support',
        element: <PrivateRoute><ProfessionalList></ProfessionalList></PrivateRoute>,
      },
      // <LiveMeeting></LiveMeeting>
      {
        path: 'profile',
        element: <PrivateRoute><Profile></Profile></PrivateRoute>
      },
      {
        path: 'forget-password',
        element: <ForgetPassword></ForgetPassword>,
      },
      {
        path: 'books',
        element: <AllBooks></AllBooks>
      },
      {
        path: 'books/:id',
        element: <PrivateRoute><BookDetail></BookDetail></PrivateRoute>,
        loader: () => fetch(`https://SlideBanai.onrender.com/api/v1/ebook`)
      },
      {
        path: 'book-read-listen/:id',
        element: <PrivateRoute><ReadListen></ReadListen></PrivateRoute>,
        loader: () => fetch(`https://SlideBanai.onrender.com/api/v1/ebook`)
      },
      {
        path: 'b1',
        element: <PrivateRoute><B1></B1></PrivateRoute>
      },
      {
        path: 'b2',
        element: <PrivateRoute><B2></B2></PrivateRoute>
      },
      {
        path: 'health-and-nutrition',
        element: <PrivateRoute><HealthDashboard></HealthDashboard></PrivateRoute>,
      },
      {
        path: 'health-and-nutrition/progress/:healthId',
        element: <PrivateRoute><HealthCal></HealthCal></PrivateRoute>,
      },
      {
        path: 'health-and-nutrition/:type/:healthId',
        element: <PrivateRoute><HealthCondition></HealthCondition></PrivateRoute>,
      },
      {
        path: 'health-and-nutrition/goal/:healthId',
        element: <PrivateRoute><SetTheGoal></SetTheGoal></PrivateRoute>,
      },
      {
        path: 'health-and-nutrition/blogs',
        element: <PrivateRoute><Blogs></Blogs></PrivateRoute>,
        loader: () => fetch('/healthBlogData.json')
      },
      {
        path: 'meditation',
        element: <PrivateRoute><Meditation></Meditation></PrivateRoute>,
      },
      {
        path: 'game/tic-tac',
        element: <TicTacGame></TicTacGame>,
      },
      {
        path: 'game/fifteen-puzzle',
        element: <FifteenPuzzle></FifteenPuzzle>,
      },
      {
        path: 'game/SlideBanai-puzzle',
        element: <SlideBanaiPuzzle></SlideBanaiPuzzle>,
      },
      {
        path: 'professional-dashboard',
        element: <PrivateRoute><ProfessionalDashboard></ProfessionalDashboard></PrivateRoute>,
      },
      {
        path: 'contact-us',
        element: <ContactUs></ContactUs>,
      },
      {
        path: 'professional-verify-form',
        element: <PrivateRoute><VerifyForm></VerifyForm></PrivateRoute>,
      },
      {
        path: 'live',
        element: <PrivateRoute><LiveMeeting></LiveMeeting></PrivateRoute>,
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div>
            <RouterProvider router={router} />
          </div>
        </QueryClientProvider>
      </AuthProvider>
      <Toaster />
    </HelmetProvider>
  </StrictMode>
)
