export default function Breadcrumbs() {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        <li className="pr-4">
          <a href="#">Buy</a>
        </li>
        <li className="px-4">
          <a href="#">My Courses</a>
        </li>
        <li className="px-4">
          <a href="#">Manage Courses</a>
        </li>
      </ol>
    </nav>
  );
}
