"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import LessonContent from "@/components/LessonContent";

interface LessonData {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  durationMinutes: number;
  module: {
    title: string;
    order: number;
    course: {
      title: string;
      slug: string;
    };
  };
}

interface NavLesson {
  slug: string;
  title: string;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = use(params);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [prevLesson, setPrevLesson] = useState<NavLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<NavLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses/${courseSlug}/lessons/${lessonSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setLesson(data.lesson);
        setCompleted(data.completed || false);
        setPrevLesson(data.prevLesson || null);
        setNextLesson(data.nextLesson || null);
      })
      .catch(() => router.push(`/courses/${courseSlug}`))
      .finally(() => setLoading(false));
  }, [courseSlug, lessonSlug, router]);

  async function toggleComplete() {
    if (!user || !lesson) return;

    const newCompleted = !completed;
    setCompleted(newCompleted);

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, completed: newCompleted }),
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/courses" className="hover:text-indigo-600">
          Courses
        </Link>
        <span>/</span>
        <Link
          href={`/courses/${courseSlug}`}
          className="hover:text-indigo-600"
        >
          {lesson.module.course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-700">
          Module {lesson.module.order}: {lesson.module.title}
        </span>
      </div>

      {/* Lesson header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {lesson.title}
        </h1>
        <p className="text-sm text-gray-500">
          {lesson.durationMinutes} min read
        </p>
      </div>

      {/* Lesson content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <LessonContent content={lesson.content} />
      </div>

      {/* Mark complete */}
      {user && (
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={toggleComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              completed
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {completed ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Completed
              </>
            ) : (
              "Mark as complete"
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {prevLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            &larr; {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            {nextLesson.title} &rarr;
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Back to course &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
