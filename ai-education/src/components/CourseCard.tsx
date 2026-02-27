import Link from "next/link";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: string;
  lessonCount: number;
  enrollmentCount: number;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function CourseCard({
  slug,
  title,
  description,
  difficulty,
  category,
  duration,
  lessonCount,
  enrollmentCount,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              difficultyColors[difficulty] || "bg-gray-100 text-gray-700"
            }`}
          >
            {difficulty}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span>{lessonCount} lessons</span>
            <span>{duration}</span>
          </div>
          <span>{enrollmentCount} enrolled</span>
        </div>
      </div>
    </Link>
  );
}
