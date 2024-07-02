import { NavLink, useLocation } from 'react-router-dom';
import { sidebarLinksLogOut } from '@/constants';
import { INavLink } from '@/types';


const LeftSidebarLogOut = () => {
  const { pathname } = useLocation();

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <ul className='flex flex-col gap-6'>
          {sidebarLinksLogOut.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label}
                className={`leftsidebar-link group ${isActive && 'bg-primary-500'
                  }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className=
                    {`group-hover:invert-white ${isActive && 'invert-white'
                      }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}

        </ul>
      </div>

    </nav>
  )
}

export default LeftSidebarLogOut