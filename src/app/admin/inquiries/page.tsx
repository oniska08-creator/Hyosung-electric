import { prisma } from "@/lib/prisma";
import InquiriesClient from "./InquiriesClient";

export default async function InquiriesAdminPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <InquiriesClient initialInquiries={JSON.parse(JSON.stringify(inquiries))} />;
}
