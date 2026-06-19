import { Metadata } from 'next';
import { db } from '@/lib/db';
import RecipeGridClient from './RecipeGridClient';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Makhana Recipes | Healthy Snacks & Treats with Fox Nuts',
  description:
    'Easy, healthy recipes using NutriTribe makhana — from kheer and curry to trail mix and smoothie bowls.',
};

export default async function RecipesPage() {
  const recipes = await db.recipe.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  });

  return <RecipeGridClient recipes={recipes} />;
}
