import EditProjectForm from "@/components/projects/edit-project-form"

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  
  return <EditProjectForm projectId={id} />
}