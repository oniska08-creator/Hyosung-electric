import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsAdminPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.projectCategory.findMany({
      orderBy: { order: 'asc' }
    })
  ]);

  return (
    <ProjectsClient 
      initialProjects={JSON.parse(JSON.stringify(projects))} 
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
