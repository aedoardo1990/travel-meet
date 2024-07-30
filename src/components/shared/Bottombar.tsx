import { bottombarLinks } from '@/constants';
import { Link, useLocation } from 'react-router-dom';

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${isActive && 'bg-gray-200 rounded-[10px]'
            } flex-center flex-col gap-1 p-2 transition`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && 'scale-110'}`}
            />
            <p className='tiny-medium text-dark-3'>{link.label}</p>
          </Link>
        )
      })}
    </section>
  )
}

export default Bottombar