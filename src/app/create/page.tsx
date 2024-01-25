import React from "react";
import { getServerAuthSession } from "~/server/auth";
import CreatePost from "./create";
import Link from "next/link";

export default async function page() {
  const session = await getServerAuthSession();

  if (session) return <CreatePost />;
  else
    return (
      <h1 className="py-20 text-center text-2xl font-medium">
        Please
        <Link
          href={"/api/auth/signin"}
          className="underline underline-offset-2"
        >
          login
        </Link>
        in order to perform this action
      </h1>
    );
}
