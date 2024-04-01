import { responses } from "@/app/lib/api/response";
import { AsyncParser } from "@json2csv/node";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
  let csv: string = "";

  const { json, fields, fileName } = data;

  const fallbackFileName = fileName.replace(/[^A-Za-z0-9_.-]/g, "_");
  const encodedFileName = encodeURIComponent(fileName)
    .replace(/['()]/g, (match) => "%" + match.charCodeAt(0).toString(16))
    .replace(/\*/g, "%2A");

  const parser = new AsyncParser({
    fields,
  });

  try {
    csv = await parser.parse(json).promise();
  } catch (err) {
    console.log({ err });
    throw new Error("Failed to convert to CSV");
  }

  const headers = new Headers();
  headers.set("Content-Type", "text/csv;charset=utf-8;");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${fallbackFileName}"; filename*=UTF-8''${encodedFileName}`
  );

  return NextResponse.json(
    {
      fileResponse: csv,
    },
    {
      headers,
    }
  );
}
