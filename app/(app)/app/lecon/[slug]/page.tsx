import { notFound } from "next/navigation";

import { LessonTutorial } from "@/components/lesson/LessonTutorial";
import { getLesson } from "@/lib/lessons/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonTutorial lesson={lesson} />;
}
