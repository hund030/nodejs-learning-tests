const getProductId = (category: { [key: string]: string }): Promise<string> => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => resolve(category.id), 1000)
    })
}

const capitalizeId = (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => resolve(id.toUpperCase()), 700)
    })
}

const getProducts = () => {
    return [
        { id: 'product1' },
        { id: 'product2' },
        { id: 'product3' },
        { id: 'product4' },
    ]
}

const capitalizeProductsIds = async () => {
    const products = getProducts()

    for (let product of products) {
        const productId = await getProductId(product);
        console.log(productId);

        const capitalizedId = await capitalizeId(productId);
        console.log(capitalizedId);
    }

    console.log(products);
}

const capitalizeProductsIdsParallel = async () => {
    const products = getProducts()

    await Promise.all(
        products.map(async (product) => {
            const productId = await getProductId(product);
            console.log(productId);

            const capitalizedId = await capitalizeId(productId)
            console.log(capitalizedId);
        })
    )

    console.log(products);
}

// capitalizeProductsIds()
capitalizeProductsIdsParallel()
