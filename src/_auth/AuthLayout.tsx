import BottombarLogOut from "@/components/shared/BottombarLogOut";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
    {isAuthenticated ? (
      <Navigate to="/" />
    ):(
      <>
      <div className='w-full md:flex'>
      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>
      <BottombarLogOut />
    </div>
      </>
    )}
    </>
  )
}

export default AuthLayout