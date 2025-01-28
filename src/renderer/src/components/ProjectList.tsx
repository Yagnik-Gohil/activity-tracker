const projects = [
  {
    id: 1,
    name: 'Marketing',
    tasks: ['Website design', 'Content strategy', 'Social media']
  },
  {
    id: 2,
    name: 'Product Design',
    tasks: ['UI/UX Research', 'Wireframing', 'Prototyping']
  },
  {
    id: 3,
    name: 'Development',
    tasks: ['Frontend', 'Backend', 'Testing']
  }
]

export function ProjectList(): JSX.Element {
  return (
    <div className="overflow-y-auto h-full scrollbar-thin">
      <div className="space-y-1 p-2">
        {projects.map((project) => (
          <button
            key={project.id}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            {project.name}
          </button>
        ))}
      </div>
    </div>
  )
}
