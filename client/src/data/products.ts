export type ProductCategory = 'eyeglasses' | 'sunglasses' | 'lenses';
export type ProductGender = 'men' | 'women' | 'unisex';
export type FrameShape =
  | 'round'
  | 'square'
  | 'rectangle'
  | 'aviator'
  | 'cat-eye'
  | 'wayfarer'
  | 'oversized'
  | 'wraparound'
  | 'rimless';
export type FrameSize = 'small' | 'medium' | 'large';
export type FrameMaterial = 'acetate' | 'metal' | 'plastic';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  gender: ProductGender;
  frameShape?: FrameShape;
  frameSize?: FrameSize;
  frameMaterial?: FrameMaterial;
  image: string;
  images: string[];
  description: string;
  brand: string;
  colors: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  trending: boolean;
}

const frameShapes: FrameShape[] = [
  'round',
  'square',
  'rectangle',
  'aviator',
  'cat-eye',
  'wayfarer',
  'oversized',
  'wraparound',
  'rimless'
];

const frameSizes: FrameSize[] = ['small', 'medium', 'large'];
const frameMaterials: FrameMaterial[] = ['acetate', 'metal', 'plastic'];
const genders: ProductGender[] = ['men', 'women', 'unisex'];

const categoryImageQuery: Record<ProductCategory, string> = {
  eyeglasses: 'eyeglasses,frames,eyewear',
  sunglasses: 'sunglasses,sunwear,eyewear',
  lenses: 'contact-lens,vision,eyes'
};

const shapeTitleMap: Record<FrameShape, string> = {
  round: 'Round',
  square: 'Square',
  rectangle: 'Rectangle',
  aviator: 'Aviator',
  'cat-eye': 'Cat-Eye',
  wayfarer: 'Wayfarer',
  oversized: 'Oversized',
  wraparound: 'Wraparound',
  rimless: 'Rimless'
};

const genderTitleMap: Record<ProductGender, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex'
};

function buildPrice(base: number, index: number) {
  const price = base + (index % 9) * 180;
  const originalPrice = price + 800 + (index % 5) * 120;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return { price, originalPrice, discount };
}

function colorSetForMaterial(material: FrameMaterial): string[] {
  if (material === 'acetate') return ['Black', 'Tortoise', 'Brown'];
  if (material === 'metal') return ['Black', 'Silver', 'Gunmetal'];
  return ['Black', 'Blue', 'Transparent'];
}

function buildUniqueImageSet(category: ProductCategory, index: number): string[] {
  const query = categoryImageQuery[category].replace(/,/g, '-');
  const base = index * 3 + 1;
  return [
    `https://picsum.photos/seed/${query}-${base}/800/800`,
    `https://picsum.photos/seed/${query}-${base + 1}/800/800`,
    `https://picsum.photos/seed/${query}-${base + 2}/800/800`
  ];
}

const eyewearProducts: Product[] = [];
let idCounter = 1;
let comboIndex = 0;

for (const category of ['eyeglasses', 'sunglasses'] as const) {
  for (const frameShape of frameShapes) {
    for (const frameSize of frameSizes) {
      for (const frameMaterial of frameMaterials) {
        for (const gender of genders) {
          const imageSet = buildUniqueImageSet(category, comboIndex);
          const primaryImage = imageSet[0];
          const secondaryImage = imageSet[1];
          const brand = category === 'eyeglasses' ? 'Technoii Frames' : 'Technoii Sun';
          const base = category === 'eyeglasses' ? 2399 : 3199;
          const { price, originalPrice, discount } = buildPrice(base, comboIndex);

          eyewearProducts.push({
            id: String(idCounter++),
            name: `${shapeTitleMap[frameShape]} ${category === 'eyeglasses' ? 'Frame' : 'Sunglasses'} ${frameSize.toUpperCase()}`,
            price,
            originalPrice,
            discount,
            category,
            gender,
            frameShape,
            frameSize,
            frameMaterial,
            image: primaryImage,
            images: imageSet,
            description: `${shapeTitleMap[frameShape]} ${category} with ${frameMaterial} build and ${frameSize} size for ${gender} users.`,
            brand,
            colors: colorSetForMaterial(frameMaterial),
            inStock: comboIndex % 11 !== 0,
            rating: Number((4.1 + (comboIndex % 8) * 0.1).toFixed(1)),
            reviews: 60 + comboIndex * 7,
            trending: comboIndex % 4 === 0 || comboIndex % 9 === 0
          });

          comboIndex += 1;
        }
      }
    }
  }
}

const lensNames = [
  'Daily Comfort Lens',
  'Monthly Clear Lens',
  'Hydra Soft Lens',
  'Toric Precision Lens',
  'Color Glow Lens',
  'LongWear Plus Lens',
  'Screen Shield Lens',
  'Night Comfort Lens',
  'FreshAir Lens',
  'AllDay Lens'
];

const lensProducts: Product[] = [];
for (const lensName of lensNames) {
  for (const gender of genders) {
    const idx = comboIndex++;
    const imageSet = buildUniqueImageSet('lenses', idx);
    const primaryImage = imageSet[0];
    const secondaryImage = imageSet[1];
    const { price, originalPrice, discount } = buildPrice(899, idx);

    lensProducts.push({
      id: String(idCounter++),
      name: `${lensName} - ${genderTitleMap[gender]}`,
      price,
      originalPrice,
      discount,
      category: 'lenses',
      gender,
      image: primaryImage,
      images: imageSet,
      description: `${lensName} for ${gender} wearers with breathable all-day comfort.`,
      brand: 'Technoii Vision',
      colors: ['Clear'],
      inStock: idx % 10 !== 0,
      rating: Number((4.2 + (idx % 7) * 0.1).toFixed(1)),
      reviews: 80 + idx * 5,
      trending: idx % 5 === 0
    });
  }
}

const eyeglassesProducts = eyewearProducts.filter((product) => product.category === 'eyeglasses').slice(0, 40);
const sunglassesProducts = eyewearProducts.filter((product) => product.category === 'sunglasses').slice(0, 40);
const selectedLensProducts = lensProducts.slice(0, 20);

export const products: Product[] = [
  ...eyeglassesProducts,
  ...sunglassesProducts,
  ...selectedLensProducts
];
