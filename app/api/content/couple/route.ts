import { cookies } from "next/headers"
import { Session } from "@/lib/auth"
import { updateCouple } from "@/lib/database"

async function getUserFromCookies() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get?.("session");
  if (!sessionCookie) return null;
  const session: Session = JSON.parse(sessionCookie.value);
  if (new Date(session.expires) < new Date()) {
    return null;
  }
  return session.user;
}
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
  const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Пример: получение пары
    // const couple = await getCoupleById(user.coupleId);
    // if (!couple) {
    //   return NextResponse.json({ error: "Couple not found" }, { status: 404 });
    // }
    // return NextResponse.json(couple);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json();
    const { brideName, groomName, loveStory, proposalStory, bridePhotoUrl, groomPhotoUrl, couplePhotoUrl } = data;

    const updatedCouple = await updateCouple(user.coupleId, {
      brideName,
      groomName,
      loveStory,
      proposalStory,
      bridePhotoUrl,
      groomPhotoUrl,
      couplePhotoUrl,
    });

    const response = NextResponse.json(updatedCouple);
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
