import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  // Only SUPER_ADMIN can access this page
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <UsersClient 
      initialUsers={JSON.parse(JSON.stringify(admins))} 
      currentUser={session.user as any}
    />
  );
}
