const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

const blogPosts = [
  {
    slug: 'makhana-superfood-benefits',
    title: '5 Reasons Makhana is the Ultimate Guilt-Free Snack',
    excerpt:
      'From high protein to low calories, discover why fox nuts (phool makhana) have earned their place as one of the healthiest snacks you can reach for.',
    content: `For centuries, the lily ponds of Mithila in Bihar have yielded one of India's best-kept nutritional secrets — makhana, also known as fox nuts or phool makhana. Today, it's finally getting the recognition it deserves as a genuinely healthy snack, and not just a festival-season treat.

Here's why makhana deserves a permanent spot in your pantry.

1. High in Plant Protein. A single serving of roasted makhana packs a meaningful protein punch, making it a smart choice for anyone looking to curb hunger between meals without reaching for processed snacks.

2. Naturally Gluten-Free. Makhana is naturally free of gluten, making it an easy, safe snack for anyone with gluten sensitivities or those simply trying to reduce processed grains in their diet.

3. Low in Calories, High in Satisfaction. Roasted (not fried) makhana delivers a satisfying crunch without the calorie density of fried snacks like chips or namkeen.

4. Rich in Minerals. Makhana is a good source of magnesium, potassium, and calcium — minerals that support everything from muscle function to bone health.

5. An Ayurvedic Tradition. Makhana has been used in Ayurvedic preparations for generations, valued for its cooling properties and ease of digestion.

At NutriTribe, every batch is hand-roasted in small batches by our partner farming communities in Mithila, preserving both the nutrition and the centuries-old tradition behind this remarkable seed.`,
    coverImage: 'https://picsum.photos/seed/blog-makhana-benefits/1200/800',
    tags: ['Health', 'Makhana', 'Nutrition'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-01-15'),
  },
  {
    slug: 'mithila-art-and-the-lily-ponds',
    title: 'Mithila Art, Lily Ponds, and the Story Behind Every Makhana',
    excerpt:
      'Long before it reached your snack bowl, makhana was part of a centuries-old way of life in Mithila — a region as famous for its art as it is for its wetlands.',
    content: `Mithila, the cultural heartland of north Bihar, is best known to the outside world for its vibrant Mithila (Madhubani) art — intricate paintings filled with motifs of nature, deities, and everyday rural life. What's less known is that the same wetlands that inspired generations of Mithila artists are also home to one of India's most labour-intensive harvests: the prickly water lily, or makhana.

Every year, the Mallah community wades into these ponds, often shoulder-deep, to harvest the spiky seed pods by hand. The seeds are then sun-dried, roasted in earthen pots over open flames, and hand-popped — a process passed down through generations, largely unchanged for centuries.

It's this same imagery — the lily, the pond, the rhythm of harvest — that you'll find echoed throughout Mithila art: bold outlines, natural motifs, and a deep connection to the land and water that sustains entire communities.

When NutriTribe sources makhana directly from these communities, we're not just buying a raw ingredient. We're supporting a livelihood and a tradition that's inseparable from the cultural identity of Mithila itself. Every pack carries a small piece of that story — from the lily pond to your palate.`,
    coverImage: 'https://picsum.photos/seed/blog-mithila-art/1200/800',
    tags: ['Heritage', 'Mithila', 'Culture'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-02-10'),
  },
  {
    slug: 'smart-snacking-guide-for-busy-days',
    title: 'A Smart Snacking Guide for Busy Days',
    excerpt:
      "Skipping meals or reaching for whatever's nearby? Here's how to build a snacking routine that actually keeps your energy steady through the day.",
    content: `Busy schedules often mean snacking on autopilot — and that usually means whatever's closest, not necessarily what's best for you. A few small shifts can make a big difference.

Plan ahead, even just a little. Keeping a tin of roasted makhana or a small pouch of trail mix at your desk or in your bag means you're never more than a few seconds away from a snack that won't leave you sluggish an hour later.

Pair protein with crunch. Snacks that combine a protein source with something satisfyingly crunchy tend to keep hunger at bay longer than sugary or purely carb-heavy options.

Watch the 4 PM dip. The mid-afternoon energy slump is real. A small serving of flavoured makhana — try our Peri Peri or Cream & Onion — gives you the crunch and flavour hit without the sugar crash that follows a candy bar or biscuit.

Don't fear flavour. Healthy snacking doesn't have to mean bland. Roasted makhana comes in flavours bold enough to satisfy a craving while staying free of the deep-fried, MSG-heavy seasoning found in typical packaged snacks.

Build a rotation. Keep two or three different snacks on hand so you're not eating the same thing every day — variety helps snacking habits actually stick long-term.

Small, consistent choices — not drastic overhauls — are what make a snacking routine sustainable. Start with what's already in your pantry, and build from there.`,
    coverImage: 'https://picsum.photos/seed/blog-snacking-guide/1200/800',
    tags: ['Wellness', 'Lifestyle', 'Snacking'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-05'),
  },
];

const recipes = [
  {
    slug: 'makhana-kheer',
    title: 'Classic Makhana Kheer',
    description:
      'A creamy, fragrant dessert made by simmering roasted fox nuts in sweetened milk with cardamom and saffron — a festive favourite from Mithila kitchens.',
    coverImage: 'https://picsum.photos/seed/recipe-makhana-kheer/1200/900',
    prepTime: '30 mins',
    servings: '4',
    ingredients: [
      '1 cup NutriTribe Plain Makhana',
      '1 litre full-fat milk',
      '1/2 cup sugar (adjust to taste)',
      '1/4 tsp cardamom powder',
      'A few strands of saffron',
      '2 tbsp ghee',
      '10-12 cashews and almonds, chopped',
    ],
    steps: [
      'Heat ghee in a pan and lightly roast the makhana on low flame for 4-5 minutes until crisp and fragrant. Set aside to cool, then crush half of them coarsely.',
      'In the same pan, lightly roast the chopped cashews and almonds until golden. Set aside.',
      'Bring the milk to a boil in a heavy-bottomed pan, then reduce to a simmer.',
      'Add the crushed and whole makhana to the simmering milk and cook for 12-15 minutes, stirring occasionally, until the milk thickens slightly.',
      'Stir in sugar, cardamom powder, and saffron strands. Simmer for another 5 minutes.',
      'Garnish with the roasted nuts and serve warm or chilled.',
    ],
    relatedSlugs: ['plain-makhana'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-01-20'),
  },
  {
    slug: 'roasted-makhana-trail-mix',
    title: 'Roasted Makhana Trail Mix',
    description:
      'A crunchy, portable mix of roasted makhana, nuts, and seeds — perfect for stashing in your bag for an on-the-go energy boost.',
    coverImage: 'https://picsum.photos/seed/recipe-trail-mix/1200/900',
    prepTime: '10 mins',
    servings: '6',
    ingredients: [
      '1 cup NutriTribe Salt & Pepper Makhana',
      '1/2 cup roasted peanuts',
      '1/2 cup almonds',
      '1/4 cup pumpkin seeds',
      '1/4 cup sunflower seeds',
      '1/4 cup raisins',
      'A pinch of chaat masala (optional)',
    ],
    steps: [
      'In a large bowl, combine the makhana, peanuts, almonds, pumpkin seeds, and sunflower seeds.',
      'Toss in the raisins for a touch of natural sweetness.',
      'Sprinkle a pinch of chaat masala over the mix and toss well to coat evenly.',
      'Store in an airtight container — stays fresh and crunchy for up to 2 weeks.',
      'Portion into small pouches for grab-and-go snacking.',
    ],
    relatedSlugs: ['salt-pepper-makhana', 'premium-cookies'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-02-01'),
  },
  {
    slug: 'makhana-lotus-seed-curry',
    title: 'Makhana Curry (Lotus Seed Curry)',
    description:
      'A rich, restaurant-style curry where roasted fox nuts simmer in a creamy tomato-onion gravy — a wholesome main course with a satisfying bite.',
    coverImage: 'https://picsum.photos/seed/recipe-makhana-curry/1200/900',
    prepTime: '40 mins',
    servings: '4',
    ingredients: [
      '1.5 cups NutriTribe Plain Makhana',
      '2 tbsp ghee or oil',
      '1 large onion, finely chopped',
      '2 tomatoes, pureed',
      '1 tbsp ginger-garlic paste',
      '1/4 cup cashew paste',
      '1/2 cup curd (yogurt)',
      '1 tsp red chilli powder',
      '1/2 tsp turmeric',
      '1 tsp garam masala',
      'Salt to taste',
      'Fresh coriander, chopped',
    ],
    steps: [
      'Dry roast the makhana in a pan for 4-5 minutes until crisp, then set aside.',
      'Heat ghee in a pan and sauté the chopped onion until golden brown.',
      'Add ginger-garlic paste and cook for a minute until fragrant.',
      'Stir in the tomato puree, chilli powder, and turmeric. Cook until the mixture thickens and oil separates.',
      'Lower the heat and whisk in the curd and cashew paste, stirring continuously to avoid curdling.',
      'Add the roasted makhana and a splash of water to reach your desired consistency. Simmer for 8-10 minutes.',
      'Finish with garam masala and fresh coriander. Serve hot with roti or rice.',
    ],
    relatedSlugs: ['plain-makhana', 'salt-pepper-makhana'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-02-18'),
  },
  {
    slug: 'peri-peri-makhana-smoothie-bowl',
    title: 'Peri Peri Makhana Crunch Smoothie Bowl',
    description:
      'A naturally sweet mango-banana smoothie bowl topped with the bold heat of Peri Peri Makhana for an unexpected sweet-and-spicy crunch.',
    coverImage: 'https://picsum.photos/seed/recipe-smoothie-bowl/1200/900',
    prepTime: '10 mins',
    servings: '2',
    ingredients: [
      '1 cup frozen mango chunks',
      '1 ripe banana',
      '1/2 cup Greek yogurt',
      '1/4 cup milk (or plant-based milk)',
      '1 tbsp honey',
      '1/2 cup NutriTribe Peri Peri Makhana, for topping',
      'Fresh berries and chia seeds, for topping',
    ],
    steps: [
      'Blend the frozen mango, banana, yogurt, milk, and honey until thick and smooth.',
      'Pour into bowls.',
      'Top generously with Peri Peri Makhana for a spicy crunch, followed by fresh berries and chia seeds.',
      'Serve immediately for the best contrast between cold smoothie and crisp makhana.',
    ],
    relatedSlugs: ['peri-peri-makhana'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-02'),
  },
  {
    slug: 'spiced-makhana-snack-mix',
    title: 'Spiced Evening Snack Mix',
    description:
      'A quick, no-cook snack mix combining two of our roasted makhana flavours with crunchy cookies — perfect for movie nights or unexpected guests.',
    coverImage: 'https://picsum.photos/seed/recipe-snack-mix/1200/900',
    prepTime: '5 mins',
    servings: '4',
    ingredients: [
      '1/2 cup NutriTribe Cream & Onion Makhana',
      '1/2 cup NutriTribe Tangy Cheese Makhana',
      '4-5 NutriTribe Premium Cookies, broken into pieces',
      '2 tbsp roasted chana (optional)',
      'A handful of curry leaves, fried crisp (optional)',
    ],
    steps: [
      'In a large mixing bowl, combine both makhana flavours.',
      'Add the broken cookie pieces and roasted chana, if using.',
      'Toss in the crisp fried curry leaves for an aromatic finish.',
      'Mix gently to combine without crushing the makhana, and serve immediately in small bowls.',
    ],
    relatedSlugs: ['cream-onion-makhana', 'tangy-cheese-makhana', 'premium-cookies'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-10'),
  },
];

async function main() {
  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`Seeded ${blogPosts.length} blog posts.`);

  for (const recipe of recipes) {
    await db.recipe.upsert({
      where: { slug: recipe.slug },
      update: recipe,
      create: recipe,
    });
  }
  console.log(`Seeded ${recipes.length} recipes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
