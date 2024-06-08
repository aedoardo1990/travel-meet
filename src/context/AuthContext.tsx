import { createContext, useContext, useEffect, useState } from 'react'
import { IContextType } from '@/types/index.ts'
import { IUser } from '@/types/index.ts';
import { getCurrentUser } from '@/lib/appwrite/api.ts';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
id: '',
name: '',
username: '',
email: '',
imageUrl: '',
bio: ''
};

// to know if we have a logged in user at all times
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

// to declare our context
const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    // to define the state of our user at the start, which will be equal to the INITIAL USER variable
    // <Iuser> is for TypeScript to know exactly how our user will look like
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    // state for loading, state set to false at the start
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    //state set to false, because at the start they are not logged-in
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthUser = async () => {
        try {
            // we ll try to get to the currently logged in user account
            const currentAccount = await getCurrentUser();
            // if current account exists, we want to set the user with the following info
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                })
                //we set the authenticated status to true
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            // this will check if we are done with loading
            setIsLoading(false);
        }        
    };
    // checkAuthUser has to be called whenever we reload our page -> done with useEffect hook
    useEffect(() => {
        // localStorage.getItem('cookieFallback') === null
        if(
            localStorage.getItem('cookieFallback') === '[]'
        ) navigate('/sign-in')
        //whenever we reload the page we call the function below
        checkAuthUser();
    }, []); 

    //value(s) that we pass to the Provider of the context (AuthContext.Provider) in the return part
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext);