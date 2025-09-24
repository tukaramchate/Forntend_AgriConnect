const products = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    price: 4.99,
    originalPrice: 6.99,
    category: 'Vegetables',
    farmer: 'John Doe',
    location: 'California',
    description: 'Fresh, organic tomatoes grown with care in sunny California.',
    longDescription:
      'These premium organic tomatoes are grown using sustainable farming practices in the fertile valleys of California. Hand-picked at peak ripeness, they offer exceptional flavor and nutrition. Our tomatoes are free from harmful pesticides and chemicals, making them a healthy choice for your family. With their vibrant red color and juicy texture, they are perfect for fresh salads, homemade sauces, or simply enjoying as a healthy snack.',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop&auto=format',
    ],
    inStock: true,
    stockCount: 25,
    rating: 4.8,
    reviews: 127,
    organic: true,
    locallyGrown: true,
    nutritionFacts: {
      calories: 18,
      protein: 0.9,
      carbohydrates: 3.9,
      fiber: 1.2,
      vitaminC: 14,
    },
  },
  {
    id: 2,
    name: 'Organic Carrots',
    price: 3.49,
    originalPrice: 4.99,
    category: 'Vegetables',
    farmer: 'Jane Smith',
    location: 'Oregon',
    description:
      'Sweet, crunchy organic carrots perfect for snacking and cooking.',
    images: [
      'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&h=600&fit=crop&auto=format',
    ],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    organic: true,
    locallyGrown: true,
  },
];

export default products;
