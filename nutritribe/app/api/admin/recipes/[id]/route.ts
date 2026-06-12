import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PostStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipe = await db.recipe.findUnique({ where: { id: params.id } });
    if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { slug, title, description, coverImage, prepTime, servings, ingredients, steps, relatedSlugs, status } = body;

    const existing = await db.recipe.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Prisma.RecipeUpdateInput = {};
    if (slug !== undefined) data.slug = slug;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (prepTime !== undefined) data.prepTime = prepTime;
    if (servings !== undefined) data.servings = servings;
    if (ingredients !== undefined) data.ingredients = Array.isArray(ingredients) ? ingredients : [];
    if (steps !== undefined) data.steps = Array.isArray(steps) ? steps : [];
    if (relatedSlugs !== undefined) data.relatedSlugs = Array.isArray(relatedSlugs) ? relatedSlugs : [];

    if (status !== undefined) {
      if (!Object.values(PostStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
      if (status === 'PUBLISHED' && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
      if (status === 'DRAFT') {
        data.publishedAt = null;
      }
    }

    const recipe = await db.recipe.update({ where: { id: params.id }, data });
    return NextResponse.json(recipe);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A recipe with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.recipe.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
