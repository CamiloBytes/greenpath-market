import React from 'react'
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const LoginForm = () => {
  return (
    <form 
        className=" flex flex-col items-center jus gap-6 md:gap-8 w-8/10 max-w-md"
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
            id="email"
        />
        <Input 
            type="password"
            placeholder="Password"
            label="Password"
            id="password"
        />
        <Button className="w-1/2 transform hover:scale-105 transition duration-300" >
            sign in
        </Button>
    </form>
  )
}
