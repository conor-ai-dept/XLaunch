import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json(
      { error: "courseId is required" },
      { status: 400 }
    );
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.userId, courseId },
    },
  });

  if (existing) {
    return NextResponse.json({ enrollment: existing });
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: session.userId, courseId },
  });

  return NextResponse.json({ enrollment }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: { select: { id: true } },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const progressCounts = await prisma.progress.groupBy({
    by: ["lessonId"],
    where: {
      userId: session.userId,
      completed: true,
    },
  });

  const completedLessonIds = new Set(progressCounts.map((p) => p.lessonId));

  const result = enrollments.map((e) => {
    const totalLessons = e.course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    );
    const completedLessons = e.course.modules.reduce(
      (acc, m) =>
        acc + m.lessons.filter((l) => completedLessonIds.has(l.id)).length,
      0
    );

    return {
      id: e.id,
      enrolledAt: e.enrolledAt,
      course: {
        id: e.course.id,
        title: e.course.title,
        slug: e.course.slug,
        description: e.course.description,
        thumbnail: e.course.thumbnail,
        difficulty: e.course.difficulty,
        category: e.course.category,
      },
      totalLessons,
      completedLessons,
      progress: totalLessons > 0 ? completedLessons / totalLessons : 0,
    };
  });

  return NextResponse.json({ enrollments: result });
}
