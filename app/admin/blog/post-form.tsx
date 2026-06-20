import type { FormState } from "@/app/actions/content";
import {
  CheckboxField,
  FormGrid,
  TextAreaField,
  TextField,
} from "@/app/admin/form-ui";
import { AdminFormFrame } from "@/app/admin/form-client";
import type { AdminPost } from "@/app/data/blog";

export function PostForm({
  action,
  post,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  post?: AdminPost;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={post ? "Salvează modificările" : "Creează articolul"}
    >
      {post ? <input name="id" type="hidden" defaultValue={post.id} /> : null}
      <FormGrid>
        <TextField
          name="title"
          label="Titlu"
          required
          defaultValue={post?.title}
        />
        <TextField
          name="slug"
          label="Slug"
          defaultValue={post?.slug}
          hint="Lasă gol pentru generare din titlu."
        />
        <TextField
          name="category"
          label="Categorie"
          defaultValue={post?.category}
        />
        <TextField
          name="read_time"
          label="Timp citire"
          defaultValue={post?.read_time}
          placeholder="6 min"
        />
        <TextField
          name="published_at"
          label="Data publicării"
          type="date"
          defaultValue={post?.published_at}
        />
        <TextField
          name="published_label"
          label="Etichetă dată"
          defaultValue={post?.published_label ?? ""}
          hint="Lasă gol pentru generare automată din dată."
        />
        <TextField
          name="sort_order"
          label="Ordine"
          type="number"
          defaultValue={post?.sort_order ?? 0}
        />
        <TextField
          name="image_src"
          label="Imagine (src)"
          defaultValue={post?.image_src ?? ""}
        />
        <TextField
          name="image_alt"
          label="Imagine (alt)"
          defaultValue={post?.image_alt ?? ""}
        />
        <TextAreaField
          name="excerpt"
          label="Rezumat"
          rows={3}
          defaultValue={post?.excerpt}
        />
        <TextAreaField
          name="body"
          label="Conținut (Markdown)"
          rows={8}
          defaultValue={post?.body ?? ""}
        />
        <TextAreaField
          name="tags"
          label="Taguri (un element pe linie)"
          rows={3}
          defaultValue={post?.tags?.join("\n") ?? ""}
        />
        <TextAreaField
          name="sources"
          label="Surse (titlu :: url, una pe linie)"
          rows={3}
          defaultValue={
            post?.sources?.map((s) => `${s.title} :: ${s.url}`).join("\n") ?? ""
          }
          hint="Ex.: Ghid tehnic ANRE :: https://..."
        />
        <div className="flex flex-wrap gap-5 md:col-span-2">
          <CheckboxField
            name="is_published"
            label="Publicat"
            defaultChecked={post ? post.is_published : true}
          />
          <CheckboxField
            name="is_featured"
            label="Articol recomandat (featured)"
            defaultChecked={post?.is_featured ?? false}
          />
        </div>
      </FormGrid>
    </AdminFormFrame>
  );
}
