import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, completed } = await request.json();
  if (!lessonId) {
    return NextResponse.json(
      { error: "lessonId is required" },
      { status: 400 }
    );
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: { userId: session.userId, lessonId },
    },
    update: {
      completed: completed ?? true,
      completedAt: completed !== false ? new Date() : null,
    },
    create: {
      userId: session.userId,
      lessonId,
      completed: completed ?? true,
      completedAt: completed !== false ? new Date() : null,
    },
  });

  return NextResponse.json({ progress });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = request.nextUrl.searchParams.get("courseId");

  if (courseId) {
    const lessons = await prisma.lesson.findMany({
      where: {
        module: { courseId },
      },
      select: { id: true },
    });

    const lessonIds = lessons.map((l) => l.id);

    const progress = await prisma.progress.findMany({
      where: {
        userId: session.userId,
        lessonId: { in: lessonIds },
      },
    });

    return NextResponse.json({ progress });
  }

  const progress = await prisma.progress.findMany({
    where: { userId: session.userId, completed: true },
    select: { lessonId: true, completedAt: true },
  });

  return NextResponse.json({ progress });
}
