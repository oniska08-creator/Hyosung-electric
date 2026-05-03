"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadBase64Image, uploadFile } from "@/lib/storage";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- Admin Management Actions ---
export async function createAdminUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
      throw new Error("최고 관리자만 관리자를 추가할 수 있습니다.");
    }

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    const hashedPassword = await hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role,
      },
    });

    revalidatePath("/admin/users");
    return admin;
  } catch (error: any) {
    console.error("Create Admin Error:", error);
    throw new Error(error.message || "관리자 등록 중 서버 오류가 발생했습니다.");
  }
}

export async function deleteAdminUser(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
      throw new Error("최고 관리자만 관리자를 삭제할 수 있습니다.");
    }

    // Prevent deleting self
    if ((session?.user as any)?.id === id) {
      throw new Error("자기 자신을 삭제할 수 없습니다.");
    }

    await prisma.admin.delete({ where: { id } });
    revalidatePath("/admin/users");
  } catch (error: any) {
    console.error("Delete Admin Error:", error);
    throw new Error(error.message || "관리자 삭제 중 서버 오류가 발생했습니다.");
  }
}

export async function updateAdminUser(id: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
      throw new Error("최고 관리자만 관리자 정보를 수정할 수 있습니다.");
    }

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    const updateData: any = {
      username,
      name,
      role,
    };

    if (password && password.trim() !== "") {
      updateData.password = await hash(password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/users");
    return admin;
  } catch (error: any) {
    console.error("Update Admin Error:", error);
    throw new Error(error.message || "관리자 수정 중 서버 오류가 발생했습니다.");
  }
}

// --- Product Actions ---
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const spec = formData.get("spec") as string;
    const price = formData.get("price") as string;
    const isPublic = formData.get("isPublic") === "on" || formData.get("isPublic") === "true";
    const images = formData.getAll("images") as File[];
    
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        if (file && file.size > 0) {
          return await uploadFile(file, "products");
        }
        return null;
      });
      const urls = await Promise.all(uploadPromises);
      imageUrls = urls.filter((url) => url !== null) as string[];
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        spec,
        price: parseInt(price) || 0,
        isPublic,
        imageUrls,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return product;
  } catch (error: any) {
    console.error("Create Product Error:", error);
    throw new Error(error.message || "제품 등록 중 서버 오류가 발생했습니다.");
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const spec = formData.get("spec") as string;
    const price = formData.get("price") as string;
    const isPublic = formData.get("isPublic") === "on" || formData.get("isPublic") === "true";
    const images = formData.getAll("images") as File[];
    const existingImageUrls = formData.getAll("existingImageUrls") as string[];
    
    const updateData: any = {
      name,
      description,
      category,
      spec,
      price: parseInt(price) || 0,
      isPublic,
    };

    let newImageUrls = [...(existingImageUrls || [])];
    
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        if (file && file.size > 0) {
          return await uploadFile(file, "products");
        }
        return null;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      newImageUrls = [...newImageUrls, ...uploadedUrls.filter(url => url !== null)];
    }
    
    updateData.imageUrls = newImageUrls;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return product;
  } catch (error: any) {
    console.error("Update Product Error:", error);
    throw new Error(error.message || "제품 수정 중 서버 오류가 발생했습니다.");
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    throw new Error(error.message || "제품 삭제 중 서버 오류가 발생했습니다.");
  }
}

// --- Project (Portfolio) Actions ---
export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const capacity = formData.get("capacity") as string;
    const location = formData.get("location") as string;
    const tagsString = formData.get("tagsString") as string;
    const completedAt = formData.get("completedAt") as string;
    const images = formData.getAll("images") as File[];
    
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
    
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        if (file && file.size > 0) {
          return await uploadFile(file, "projects");
        }
        return null;
      });
      const urls = await Promise.all(uploadPromises);
      imageUrls = urls.filter(url => url !== null) as string[];
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        capacity,
        location,
        tags,
        completedAt: completedAt ? new Date(completedAt) : null,
        imageUrls,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/portfolio");
    return project;
  } catch (error: any) {
    console.error("Create Project Error:", error);
    throw new Error(error.message || "실적 등록 중 서버 오류가 발생했습니다.");
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const capacity = formData.get("capacity") as string;
    const location = formData.get("location") as string;
    const tagsString = formData.get("tagsString") as string;
    const completedAt = formData.get("completedAt") as string;
    const images = formData.getAll("images") as File[];
    const existingImageUrls = formData.getAll("existingImageUrls") as string[];
    
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
    
    const updateData: any = {
      title,
      description,
      capacity,
      location,
      tags,
      completedAt: completedAt ? new Date(completedAt) : null,
    };

    let newImageUrls = [...(existingImageUrls || [])];

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        if (file && file.size > 0) {
          return await uploadFile(file, "projects");
        }
        return null;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      newImageUrls = [...newImageUrls, ...uploadedUrls.filter(url => url !== null)];
    }

    updateData.imageUrls = newImageUrls;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${id}`);
    return project;
  } catch (error: any) {
    console.error("Update Project Error:", error);
    throw new Error(error.message || "실적 수정 중 서버 오류가 발생했습니다.");
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/portfolio");
  } catch (error: any) {
    console.error("Delete Project Error:", error);
    throw new Error(error.message || "실적 삭제 중 서버 오류가 발생했습니다.");
  }
}

// --- History (About) Actions ---
export async function createHistory(data: any) {
  try {
    const history = await prisma.history.create({
      data: {
        year: data.year,
        month: data.month,
        title: data.title,
        content: data.content,
        order: parseInt(data.order) || 0,
      },
    });
    revalidatePath("/admin/about");
    revalidatePath("/about");
    return history;
  } catch (error: any) {
    console.error("Create History Error:", error);
    throw new Error("연혁 등록 중 서버 오류가 발생했습니다.");
  }
}

export async function updateHistory(id: string, data: any) {
  try {
    const history = await prisma.history.update({
      where: { id },
      data: {
        year: data.year,
        month: data.month,
        title: data.title,
        content: data.content,
        order: parseInt(data.order) || 0,
      },
    });
    revalidatePath("/admin/about");
    revalidatePath("/about");
    return history;
  } catch (error: any) {
    console.error("Update History Error:", error);
    throw new Error("연혁 수정 중 서버 오류가 발생했습니다.");
  }
}

export async function deleteHistory(id: string) {
  try {
    await prisma.history.delete({ where: { id } });
    revalidatePath("/admin/about");
    revalidatePath("/about");
  } catch (error: any) {
    console.error("Delete History Error:", error);
    throw new Error("연혁 삭제 중 서버 오류가 발생했습니다.");
  }
}
// --- Category Actions ---
export async function createProductCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const category = await prisma.productCategory.create({
      data: { name, order },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error: any) {
    console.error("Create Product Category Error:", error);
    throw new Error("카테고리 등록 중 서버 오류가 발생했습니다.");
  }
}

export async function updateProductCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const category = await prisma.productCategory.update({
      where: { id },
      data: { name, order },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error: any) {
    console.error("Update Product Category Error:", error);
    throw new Error("카테고리 수정 중 서버 오류가 발생했습니다.");
  }
}

export async function deleteProductCategory(id: string) {
  try {
    await prisma.productCategory.delete({ where: { id } });
    revalidatePath("/admin/categories");
  } catch (error: any) {
    console.error("Delete Product Category Error:", error);
    throw new Error("카테고리 삭제 중 서버 오류가 발생했습니다.");
  }
}

export async function createProjectCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const category = await prisma.projectCategory.create({
      data: { name, order },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error: any) {
    console.error("Create Project Category Error:", error);
    throw new Error("카테고리 등록 중 서버 오류가 발생했습니다.");
  }
}

export async function updateProjectCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const category = await prisma.projectCategory.update({
      where: { id },
      data: { name, order },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error: any) {
    console.error("Update Project Category Error:", error);
    throw new Error("카테고리 수정 중 서버 오류가 발생했습니다.");
  }
}

export async function deleteProjectCategory(id: string) {
  try {
    await prisma.projectCategory.delete({ where: { id } });
    revalidatePath("/admin/categories");
  } catch (error: any) {
    console.error("Delete Project Category Error:", error);
    throw new Error("카테고리 삭제 중 서버 오류가 발생했습니다.");
  }
}

// --- About (Company Info) Actions ---
export async function updateAbout(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const philosophy = formData.get("philosophy") as string;
    const vision = formData.get("vision") as string;
    const mainImageFile = formData.get("mainImage") as File;
    const existingMainImage = formData.get("existingMainImage") as string;

    let mainImage = existingMainImage;

    if (mainImageFile && mainImageFile.size > 0) {
      const uploadedUrl = await uploadFile(mainImageFile, "about");
      if (uploadedUrl) {
        mainImage = uploadedUrl;
      }
    }

    const about = await prisma.about.upsert({
      where: { id: "singleton" },
      update: {
        title,
        subtitle,
        philosophy,
        vision,
        mainImage,
      },
      create: {
        id: "singleton",
        title,
        subtitle,
        philosophy,
        vision,
        mainImage,
      },
    });

    revalidatePath("/admin/about");
    revalidatePath("/about");
    return about;
  } catch (error: any) {
    console.error("Update About Error:", error);
    throw new Error("기업 정보 수정 중 서버 오류가 발생했습니다.");
  }
}

// --- Inquiry Actions ---
export async function createInquiry(data: { name: string, phone: string, location: string, message: string, email?: string, company?: string }) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        location: data.location,
        content: data.message,
        email: data.email || null,
        company: data.company || null,
      },
    });
    revalidatePath("/admin/inquiries");
    return inquiry;
  } catch (error: any) {
    console.error("Create Inquiry Error:", error);
    throw new Error("문의 접수 중 서버 오류가 발생했습니다.");
  }
}

export async function markInquiryRead(id: string) {
  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/inquiries");
    return inquiry;
  } catch (error: any) {
    console.error("Mark Inquiry Read Error:", error);
    throw new Error("문의 읽음 표시 중 오류가 발생했습니다.");
  }
}

export async function deleteInquiry(id: string) {
  try {
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin/inquiries");
  } catch (error: any) {
    console.error("Delete Inquiry Error:", error);
    throw new Error("문의 삭제 중 오류가 발생했습니다.");
  }
}
