import React from 'react'
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

export const LoginForm = () => {
  return (
    <form 
        className=" flex flex-col items-center justify-center gap-6 md:gap-8 w-8/12"
    >
        <div className="w-full flex flex-col gap-2 justify-start items-start text-white">
        <h1
        className="text-5xl font-bold text-center "
        >
            Login
        </h1>
            </div>

        <Input 
            type="email"
            placeholder="Email"
            label="Email"
        />
        <Input 
            type="password"
            placeholder="Password"
            label="Password"
        />
        <Button type="submit" className="mt-10 w-1/2 transform hover:scale-105 transition duration-300" >
            sign in
        </Button>
    </form>
  )
}
