"use client";
import Loader from "@/components/Loader/Loading";
import LoginForm from "@/components/LoginForm";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && data?.session && data?.user) {
      router.replace("/");
    }
  }, [isPending, data, router]);

  if (isPending || (data?.session && data?.user)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Page;
