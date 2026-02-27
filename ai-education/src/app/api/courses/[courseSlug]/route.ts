import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  const { courseSlug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              durationMinutes: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const session = await getSession();
  let enrolled = false;
  let progress: { lessonId: string; completed: boolean }[] = [];

  if (session) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.userId, courseId: course.id },
      },
    });
    enrolled = !!enrollment;

    if (enrolled) {
      const lessonIds = course.modules.flatMap((m) =>
        m.lessons.map((l) => l.id)
      );
      const progressRecords = await prisma.progress.findMany({
        where: {
          userId: session.userId,
          lessonId: { in: lessonIds },
        },
        select: { lessonId: true, completed: true },
      });
      progress = progressRecords;
    }
  }

  return NextResponse.json({ course, enrolled, progress });
}
