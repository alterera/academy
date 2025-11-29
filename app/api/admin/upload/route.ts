/**
 * POST /api/admin/upload
 * Upload image to ImageKit
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Unauthorized"),
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, "No file provided"),
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/courses/featured-images",
      useUniqueFileName: true,
    });

    return NextResponse.json({
      ok: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to upload image"),
      { status: 500 }
    );
  }
}

