import PulseLoader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const [time, setTime] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (time === 0) return navigate(Routes.ROOT);
      setTime((prev) => prev - 1);
    }, 1000);
  }, [time]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] text-white">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-6">
          <span className="text-9xl font-extrabold">4</span>
          <PulseLoader classes="mx-12" />
          <span className="text-9xl font-extrabold">4</span>
        </div>

        <h1 className="my-8 text-5xl font-bold">Oooppsie!</h1>

        <p className="my-4 max-w-md text-base text-gray-300">
          The stuff you are looking for doesn't exist or has been moved. Start
          again from home page and you will find it for sure.
        </p>

        <Link to={Routes.ROOT}>
          <Button className="mt-10 p-6 rounded-3xl bg-[#3BD671] text-sm font-bold">
            Go to Homepage
          </Button>
        </Link>
        <p className="my-4 text-gray-500 text-sm">Auto redirect in {time}s</p>

        <PulseLoader classes="mt-6" size={16} />
      </div>
    </div>
  );
}
