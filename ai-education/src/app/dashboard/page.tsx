"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ProgressBar from "@/components/ProgressBar";

interface EnrolledCourse {
  id: string;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    difficulty: string;
    category: string;
  };
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => setEnrollments(data.enrollments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-4" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalCompleted = enrollments.reduce(
    (acc, e) => acc + e.completedLessons,
    0
  );
  const totalLessons = enrollments.reduce((acc, e) => acc + e.totalLessons, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-600">
          Track your learning progress and continue where you left off.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Enrolled Courses</p>
          <p className="text-2xl font-bold text-gray-900">
            {enrollments.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Lessons Completed</p>
          <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalLessons > 0
              ? Math.round((totalCompleted / totalLessons) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        My Courses
      </h2>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">
            You haven&apos;t enrolled in any courses yet.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <Link
              key={enrollment.id}
              href={`/courses/${enrollment.course.slug}`}
            >
              <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                    {enrollment.course.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {enrollment.course.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {enrollment.completedLessons}/{enrollment.totalLessons}{" "}
                  lessons completed
                </p>
                <ProgressBar progress={enrollment.progress} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
