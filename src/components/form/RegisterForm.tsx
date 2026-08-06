import React from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export const RegisterForm = () => {
  return (
    <form className=" flex flex-col items-center jus gap-6 md:gap-8 w-8/10 max-w-md">
      <div className="w-full flex flex-col gap-2 justify-start items-start text-white">
        <h1 className="text-5xl font-bold text-center ">Register</h1>
        <div className="w-full flex flex-col gap-4 flex-wrap justify-start items-center text-white">
          <Input
            type="text"
            placeholder="Username"
            label="Username"
            id="username"
          />
          <Input type="email" placeholder="Email" label="Email" id="email" />
          <Input type="text" placeholder="Phone" label="Phone" id="Phone" />
          <Input
            type="select"
            placeholder="Select ID Type"
            label="ID Type"
            id="id-type"
          />
          <Input type="date" placeholder="Date of Birth" id="dob" />
          <Input
            type="text"
            placeholder="ID Number"
            label="ID Number"
            id="id-number"
          />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            id="password"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            id="confirm-password"
          />
          <Input
            type="address"
            placeholder="Address"
            label="Address"
            id="address"
          />

          <Button className="w-1/2 transform hover:scale-105 transition duration-300">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
};
