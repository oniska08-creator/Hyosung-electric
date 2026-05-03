import { prisma } from "@/lib/prisma";
import AboutClient from "./AboutClient";

export default async function AboutAdminPage() {
  const [history, about] = await Promise.all([
    prisma.history.findMany({
      orderBy: { order: 'desc' }
    }),
    prisma.about.findUnique({
      where: { id: "singleton" }
    })
  ]);

  return (
    <AboutClient 
      initialHistory={JSON.parse(JSON.stringify(history))} 
      initialAbout={JSON.parse(JSON.stringify(about))} 
    />
  );
}
