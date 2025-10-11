"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface ProjectResponse {
  project: {
    id: string;
    title: string;
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    price: number | null;
    images: { url: string; isPrimary: boolean; order: number }[];
    tags: { tag: { id: string; name: string } }[];
  };
}

export default function EditProjectForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    "DRAFT"
  );
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<{ url: string; isPrimary?: boolean }[]>(
    []
  );
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data: ProjectResponse = await res.json();
        const p = data.project;
        setTitle(p.title);
        setDescription(p.description);
        setStatus(p.status);
        setPrice(p.price != null ? String(p.price) : "");
        setImages(
          p.images.map((im) => ({ url: im.url, isPrimary: im.isPrimary }))
        );
        setTags(p.tags.map((t) => t.tag.name));
      } catch (e) {
        console.error(e);
        alert("Could not load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const primaryIndex = useMemo(
    () => images.findIndex((i) => i.isPrimary),
    [images]
  );

  const addImage = () => setImages((prev) => [...prev, { url: "" }]);
  const updateImage = (idx: number, url: string) =>
    setImages((prev) => prev.map((im, i) => (i === idx ? { ...im, url } : im)));
  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));
  const makePrimary = (idx: number) =>
    setImages((prev) => prev.map((im, i) => ({ ...im, isPrimary: i === idx })));

  const addTag = () => {
    const t = newTag.trim();
    if (!t || tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setNewTag("");
  };
  const removeTag = (name: string) =>
    setTags((prev) => prev.filter((t) => t !== name));

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const body = {
        title,
        description,
        status,
        price: price ? Number(price) : null,
        images: images
          .filter((im) => im.url.trim().length > 0)
          .map((im, idx) => ({
            url: im.url.trim(),
            isPrimary: im.isPrimary ?? idx === 0,
          })),
        tags,
      };
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update project");
      router.push("/projects");
    } catch (e) {
      console.error(e);
      alert("Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 text-center">Loading project…</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>

        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select
                  className="w-full border rounded-md h-9 px-3"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <Label>Price (optional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {images.map((im, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder="Image URL"
                  value={im.url}
                  onChange={(e) => updateImage(idx, e.target.value)}
                />
                <Button
                  type="button"
                  variant={idx === primaryIndex ? "default" : "outline"}
                  onClick={() => makePrimary(idx)}
                >
                  {idx === primaryIndex ? "Primary" : "Make primary"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeImage(idx)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="h-4 w-4 mr-2" /> Add image
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {t}
                  <button
                    onClick={() => removeTag(t)}
                    aria-label={`remove ${t}`}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/projects")}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
