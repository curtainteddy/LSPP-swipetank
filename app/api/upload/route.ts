import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// NOTE: We avoid multer because Next.js (App Router) edge/serverless runtimes don't support Node stream middleware directly.
// We'll parse a simple multipart/form-data manually for single file field named 'file'.

export const runtime = "nodejs"; // ensure Node runtime
export const dynamic = "force-dynamic";

async function parseMultipart(
  req: NextRequest
): Promise<{ buffer: Buffer; filename: string; contentType: string } | null> {
  const contentType = req.headers.get("content-type") || "";
  const boundaryMatch = contentType.match(/boundary=(.*)$/);
  if (!boundaryMatch) return null;
  const boundary = boundaryMatch[1];
  const body = Buffer.from(await req.arrayBuffer());
  const parts = body.toString("binary").split(`--${boundary}`);
  for (const part of parts) {
    if (part.includes("Content-Disposition") && part.includes("filename=")) {
      const [rawHeaders, rawData] = part.split("\r\n\r\n");
      if (!rawHeaders || !rawData) continue;
      const disposition =
        rawHeaders
          .split("\r\n")
          .find((l) => l.startsWith("Content-Disposition")) || "";
      const filenameMatch = disposition.match(/filename="(.+?)"/);
      const typeLine =
        rawHeaders.split("\r\n").find((l) => l.startsWith("Content-Type")) ||
        "";
      const ct = typeLine.split(":")[1]?.trim() || "application/octet-stream";
      if (!filenameMatch) continue;
      let fileContentBinary = rawData;
      // remove trailing CRLF and boundary dashes
      if (fileContentBinary.endsWith("\r\n"))
        fileContentBinary = fileContentBinary.slice(0, -2);
      const buffer = Buffer.from(fileContentBinary, "binary");
      return { buffer, filename: filenameMatch[1], contentType: ct };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const filePart = await parseMultipart(req);
    if (!filePart) {
      return new Response(JSON.stringify({ error: "No file received" }), {
        status: 400,
      });
    }
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "projects"
    );
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = filePart.filename.includes(".")
      ? filePart.filename.split(".").pop()
      : "bin";
    const outName = `${randomUUID()}.${ext}`;
    const filePath = path.join(uploadsDir, outName);
    await fs.writeFile(filePath, filePart.buffer);
    const publicUrl = `/uploads/projects/${outName}`;
    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Upload error", e);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}
