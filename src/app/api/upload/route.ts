import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create public/uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(sanitizeName) || ".jpg";
    const baseName = path.basename(sanitizeName, ext);
    const filename = `${Date.now()}-${baseName.substring(0, 15)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      message: "Image uploaded and stored on server successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "File upload failed" }, { status: 500 });
  }
}
