import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Session, User } from "@/lib/auth"
import { getEventsByCoupleId, updateEvent } from "@/lib/database"

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
    // Пример: получение событий
    // const events = await getEventsByCoupleId(user.coupleId);
    // if (!events) {
    //   return NextResponse.json({ error: "Events not found" }, { status: 404 });
    // }
    // return NextResponse.json(events);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { events } = data;

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "Events must be an array" }, { status: 400 });
    }

    const updatedEvents = [];
    for (const event of events) {
      const updated = await updateEvent(event.id, {
        eventName: event.eventName,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        additionalInfo: event.additionalInfo,
      });
      updatedEvents.push(updated);
    }

    return NextResponse.json(updatedEvents);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
