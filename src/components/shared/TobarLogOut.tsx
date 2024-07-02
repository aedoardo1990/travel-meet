import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';


const TopbarLogOut = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess])

    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                
                    {/*code for rounded profile icon view*/}
                   
            </div>

        </section>
    )
}

export default TopbarLogOut
