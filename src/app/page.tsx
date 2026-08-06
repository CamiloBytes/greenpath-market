
import { LoginForm } from "../components/form/LoginForm";
import { RegisterForm } from "../components/form/RegisterForm";

export default function Home() {
  return (
    <>
      <main className="min-h-screen px-10 py-8 grid grid-cols-1 md:grid-cols-2 items-center gap-8 bg-[#07110C]">
        <div className="flex items-center justify-center">
          <RegisterForm />
        </div>

        <div className="flex items-center justify-center">
          <p className="text-center text-sm text-gray-500">
            © 2023 GreenPath. All rights reserved.
          </p>
        </div>
      </main>
    </>
  );
}
