import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { jsonActionFailed } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = formData.get("key") as string | null;

    if (!file || !key) {
      return jsonActionFailed("file and key are required");
    }

    const allowedKeys = ["signature", "profile"];
    if (!allowedKeys.includes(key)) {
      return jsonActionFailed("Invalid key");
    }

    const ext = path.extname(file.name).toLowerCase() || ".jpg"; // default jpg
    const timestamp = Date.now();
    const randomCode = crypto.randomBytes(4).toString("hex");
    const filename = `${key}_${timestamp}_${randomCode}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", key);
    await mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);

    // Convert File ke Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 👉 Compress pakai sharp
    let compressed: Buffer;
    if (ext === ".png") {
      compressed = await sharp(buffer)
        .resize({ width: 1080, withoutEnlargement: true }) // resize max width 1080px
        .png({ quality: 80, compressionLevel: 9 }) // PNG compress
        .toBuffer();
    } else {
      compressed = await sharp(buffer)
        .resize({ width: 1080, withoutEnlargement: true })
        .jpeg({ quality: 80 }) // JPEG compress
        .toBuffer();
    }

    // Simpan hasil compress
    await writeFile(filepath, compressed);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const fileUrl = `${baseUrl}/uploads/${key}/${filename}`;

    return Response.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload failed", error);
    return jsonActionFailed("Failed to upload file", 500);
  }
}
