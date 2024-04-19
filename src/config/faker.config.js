import { Faker, en } from "@faker-js/faker"

export const customFaker = new Faker({ locale: [en] })

const { commerce, image, database, string } = customFaker

export const generateProduct = () => {
    return {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        price: parseFloat(commerce.price()),
        category: commerce.department(),
        stock: parseInt(string.numeric(2)),
        image: image.url(),
        code: string.alphanumeric(10),
        description: commerce.productDescription()
    }
};