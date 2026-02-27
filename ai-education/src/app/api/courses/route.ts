import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const result = courses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnail: course.thumbnail,
    difficulty: course.difficulty,
    category: course.category,
    duration: course.duration,
    moduleCount: course.modules.length,
    lessonCount: course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    ),
    enrollmentCount: course._count.enrollments,
  }));

  return NextResponse.json({ courses: result });
}
