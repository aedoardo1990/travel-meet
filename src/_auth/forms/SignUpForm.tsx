import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useToast } from "@/components/ui/use-toast"
import { Link, useNavigate } from "react-router-dom"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignUpValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignUpForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    // create a new user
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({ title: "Sign up failed. Please try again." })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: "Sign up failed. Please try again." })
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      //to navigate to the Homepage, else if failed toast message
      navigate('/')
    } else {
      return toast({ title: "Sign up failed. Please try again." })
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="assets\images\logo-travelmeet-669640ccbfd6d.webp" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular">To use TravelMeet please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningIn || isUserLoading? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : "Sign Up"}
          </Button>

          <p className="text-small-regular text-black text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-sky-400 text-small-semibold ml-1">Log in</Link>
          </p>

          <p className="text-small-regular text-black text-center mt-2">
            Do you want to explore TravelMeet?
            <Link to="/explore" className="text-sky-400 text-small-semibold ml-1">Explore</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm