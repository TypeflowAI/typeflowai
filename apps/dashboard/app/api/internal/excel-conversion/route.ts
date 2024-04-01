import { responses } from "@/app/lib/api/response";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as xlsx from "xlsx";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) {
    return responses.unauthorizedResponse();
  }

  const data = await request.json();

  const { json, fields, fileName } = data;

  const fallbackFileName = fileName.replace(/[^A-Za-z0-9_.-]/g, "_");
  const encodedFileName = encodeURIComponent(fileName)
    .replace(/['()]/g, (match) => "%" + match.charCodeAt(0).toString(16))
    .replace(/\*/g, "%2A");

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(json, { header: fields });
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const base64String = buffer.toString("base64");

  const headers = new Headers();

  headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${fallbackFileName}"; filename*=UTF-8''${encodedFileName}`
  );

  return NextResponse.json(
    {
      fileResponse: base64String,
    },
    {
      headers,
    }
  );
}
