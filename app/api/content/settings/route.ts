import { cookies } from "next/headers"
import { Session } from "@/lib/auth"
import { updateSettings } from "@/lib/database"

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
    // Пример: получение настроек
    // const settings = await getSettingsByCoupleId(user.coupleId);
    // if (!settings) {
    //   return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    // }
    // return NextResponse.json(settings);
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
    const {
      siteTitle,
      welcomeMessage,
      primaryColor,
      secondaryColor,
      countdownEnabled,
      rsvpEnabled,
      rsvpDeadline,
      galleryEnabled,
    } = data;

    const updatedSettings = await updateSettings(user.coupleId, {
      siteTitle,
      welcomeMessage,
      primaryColor,
      secondaryColor,
      countdownEnabled,
      rsvpEnabled,
      rsvpDeadline,
      galleryEnabled,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
