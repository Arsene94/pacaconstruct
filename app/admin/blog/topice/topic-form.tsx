import type { FormState } from "@/app/actions/content";
import { FormGrid, TextAreaField, TextField } from "@/app/admin/form-ui";
import { AdminFormFrame } from "@/app/admin/form-client";
import type { BlogTopic } from "@/app/data/blog-ai";

export function TopicForm({
  action,
  topic,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  topic?: BlogTopic;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={topic ? "Salvează modificările" : "Creează topicul"}
    >
      {topic ? <input name="id" type="hidden" defaultValue={topic.id} /> : null}
      <FormGrid>
        <TextField name="title" label="Titlu" required defaultValue={topic?.title} full />
        <TextField name="category" label="Categorie" defaultValue={topic?.category} />
        <TextField
          name="score"
          label="Scor / prioritate (0-100)"
          type="number"
          defaultValue={topic?.score ?? 50}
        />
        <TextAreaField
          name="angle"
          label="Unghi / abordare"
          rows={3}
          defaultValue={topic?.angle}
          hint="Cum tratăm subiectul: pentru cine, ce întrebare rezolvă."
        />
        <TextAreaField
          name="rationale"
          label="De ce e relevant"
          rows={2}
          defaultValue={topic?.rationale}
        />
        <TextAreaField
          name="signals"
          label="Semnale (un element pe linie)"
          rows={4}
          defaultValue={topic?.signals?.join("\n")}
          hint="Întrebări/cereri reale care motivează topicul."
        />
      </FormGrid>
    </AdminFormFrame>
  );
}
