"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ProgressBar from "@/components/ProgressBar";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  order: number;
  durationMinutes: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  category: string;
  duration: string;
  modules: Module[];
}

interface ProgressEntry {
  lessonId: string;
  completed: boolean;
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses/${courseSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCourse(data.course);
        setEnrolled(data.enrolled);
        if (data.progress) setProgress(data.progress);
      })
      .catch(() => router.push("/courses"))
      .finally(() => setLoading(false));
  }, [courseSlug, router]);

  async function handleEnroll() {
    if (!user) {
      router.push("/auth/register");
      return;
    }
    if (!course) return;

    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    });

    if (res.ok) {
      setEnrolled(true);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  if (!course) return null;

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const completedLessons = progress.filter((p) => p.completed).length;
  const progressRatio = totalLessons > 0 ? completedLessons / totalLessons : 0;
  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/courses"
          className="text-sm text-indigo-600 hover:text-indigo-700 mb-4 inline-block"
        >
          &larr; Back to courses
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
            {course.difficulty}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {course.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {course.title}
        </h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            {course.modules.length} modules &middot; {totalLessons} lessons
          </span>
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Enrollment / Progress */}
      {enrolled ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Your progress
            </span>
            <span className="text-sm text-gray-500">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <ProgressBar progress={progressRatio} />
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-8 block"
        >
          {user ? "Enroll in this course" : "Sign up to enroll"}
        </button>
      )}

      {/* Modules & Lessons */}
      <div className="space-y-4">
        {course.modules
          .sort((a, b) => a.order - b.order)
          .map((mod) => (
            <div
              key={mod.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Module {mod.order}: {mod.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {mod.lessons.length} lessons
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {mod.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => {
                    const isCompleted = completedIds.has(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                        className="flex items-center px-6 py-3 hover:bg-gray-50 transition"
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                            isCompleted
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isCompleted && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`flex-1 text-sm ${
                            isCompleted ? "text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {lesson.durationMinutes} min
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
