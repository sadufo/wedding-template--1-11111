import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Session, User } from "@/lib/auth"
import { getRSVPsByCoupleId, createRSVP } from "@/lib/database"

async function getUserFromCookies(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get?.("session");
  if (!sessionCookie) return null;
  const session: Session = JSON.parse(sessionCookie.value);
  if (new Date(session.expires) < new Date()) {
    return null;
  }
  return session.user;
}

export async function GET() {
  try {
  const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rsvps = await getRSVPsByCoupleId(user.coupleId);
    return NextResponse.json(rsvps);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { guestName, guestEmail, guestPhone, attendanceStatus, numberOfGuests, dietaryRestrictions, message } = data

    if (!guestName || !attendanceStatus) {
      return NextResponse.json({ error: "Guest name and attendance status are required" }, { status: 400 })
    }

    // For public RSVP submissions, we use coupleId = 1 (in production, this would be dynamic)
    const newRSVP = await createRSVP({
      coupleId: 1,
      guestName,
      guestEmail,
      guestPhone,
      attendanceStatus,
      numberOfGuests: numberOfGuests || 1,
      dietaryRestrictions,
      message,
    })

    return NextResponse.json(newRSVP, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
