import BottombarLogOut from "@/components/shared/BottombarLogOut";
import LeftSidebarLogOut from "@/components/shared/LeftSidebarLogOut";
import TopbarLogOut from "@/components/shared/TobarLogOut";
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
      <TopbarLogOut />
      <LeftSidebarLogOut />
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