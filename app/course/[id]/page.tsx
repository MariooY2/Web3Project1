import courses from "@/content/courses"; // Import your courses data
import Hero from "@/components/course/Hero";
import Curriculum from "@/components/course/Curriculum";
import Keypoints from "@/components/course/Keypoints";
interface Params {
  params: {
    id: string;
  };
}

function Page({ params }: Params) {
  const id = params.id;

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return (
      <div className="text-7xl min-h-screen flex justify-center items-center">
        Course not found
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-4">
      <Hero course={course} />
      <Keypoints course={course} />
      <Curriculum locked={true} />
    </div>
  );
}

export default Page;
