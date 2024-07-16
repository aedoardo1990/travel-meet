import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useToast } from "@/components/ui/use-toast"
import { Link, useNavigate } from "react-router-dom"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignInValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignInForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  // Query
  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: "Sign in failed. Please try again." })
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

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-gray-400">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular">Welcome back! Please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} placeholder="Email" />
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
                <FormControl>
                  <Input type="password" className="shad-input" {...field} placeholder="Password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLoading? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : "Log in"}
          </Button>

          <hr className="mt-5"/>

          <p className="text-small-regular text-black text-center mt-2">
            Don't have an account?
            <Link to="/sign-up" className="text-sky-400 font-semibold ml-1">Sign up</Link>
          </p>

          <p className="font-semibold text-gray-500 text-center mt-1"> OR </p>

          <p className="text-small-regular text-black text-center mt-2">
            <Link to="/explore" className="text-sky-400 font-semibold ml-1">Explore</Link> TravelMeet <i className="fa-solid fa-earth-americas"></i>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignInForm