import React from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export const RegisterForm = () => {
  return (
    <form className=" flex flex-col items-center justify-center md:w-8/12">
      <div className="w-full flex flex-col gap-2 justify-start items-start text-white">
        <h1 className="text-5xl font-bold text-center ">Register</h1>
        <div className="w-full flex flex-col gap-4 flex-wrap justify-start items-center text-white">
          <Input
            type="text"
            placeholder="Username"
            label="Username"
          />
          <Input type="email" placeholder="Email" label="Email" />
          <Input type="text" placeholder="Phone" label="Phone"  />
          <Input
            type="select"
            placeholder="Select ID Type"
            label="ID Type"
          />
          <Input type="date" label="Date of Birth" placeholder="Date of Birth" />
          <Input
            type="text"
            placeholder="ID Number"
            label="ID Number"
          />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
          />
          <Input
            type="address"
            placeholder="Address"
            label="Address"
          />

          <Button type="submit" className="mt-10 w-1/2 transform hover:scale-105 transition duration-300">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
};
