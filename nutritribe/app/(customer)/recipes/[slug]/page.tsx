import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import RecipeBodyClient from './RecipeBodyClient';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = await db.recipe.findUnique({ where: { slug: params.slug } });
  if (!recipe) return {};

  return {
    title: `${recipe.title} | NutriTribe Recipes`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [{ url: recipe.coverImage }],
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const recipe = await db.recipe.findUnique({ where: { slug: params.slug } });
  if (!recipe || recipe.status !== 'PUBLISHED') return notFound();

  const relatedProducts = await db.product.findMany({
    where: { slug: { in: recipe.relatedSlugs }, status: 'PUBLISHED' },
  }).catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.coverImage,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step) => ({ '@type': 'HowToStep', text: step })),
    recipeYield: recipe.servings,
    totalTime: recipe.prepTime,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecipeBodyClient recipe={recipe} relatedProducts={relatedProducts} />
    </>
  );
}
