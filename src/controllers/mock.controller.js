import { generateProduct } from "../config/faker.config.js";

export const generateMockProducts = (req, res) => {
  const numberOfProducts = 50;
  const mockProducts = [];

  for (let i = 0; i < numberOfProducts; i++) {
      mockProducts.push(generateProduct());
  }

  res.json(mockProducts);
};
