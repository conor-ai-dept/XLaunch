import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }
) {
  const { courseSlug, lessonSlug } = await params;

  // Find the course
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        include: {
          lessons: {
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

  // Find the lesson across all modules
  let lesson = null;
  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.slug === lessonSlug);
    if (found) {
      lesson = {
        ...found,
        module: {
          title: mod.title,
          order: mod.order,
          course: {
            title: course.title,
            slug: course.slug,
          },
        },
      };
      break;
    }
  }

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Build flat list for prev/next navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ slug: l.slug, title: l.title, id: l.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson =
    currentIndex > 0
      ? { slug: allLessons[currentIndex - 1].slug, title: allLessons[currentIndex - 1].title }
      : null;
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? { slug: allLessons[currentIndex + 1].slug, title: allLessons[currentIndex + 1].title }
      : null;

  // Check completion status
  let completed = false;
  const session = await getSession();
  if (session) {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: { userId: session.userId, lessonId: lesson.id },
      },
    });
    completed = progress?.completed ?? false;
  }

  return NextResponse.json({
    lesson,
    completed,
    prevLesson,
    nextLesson,
  });
}
