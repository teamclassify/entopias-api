import prisma from "../config/prisma.js";

class CartService {
  constructor() {}

  /**
   * Get a cart
   * @param {*} userId
   * @returns { cart }
   */
  async getCart(userId) {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        cartProducts: {
          include: {
            variety: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  }

  /**
   * Create a cart
   * @param {*} data { userId }
   * @returns { cart }
   */
  async createCart(data) {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: data.userId,
      },
    });

    if (cart) {
      return cart;
    }

    return await prisma.cart.create({
      data: {
        userId: data.userId,
      },
    });
  }

  /**
   * Add a product to the cart
   * @param {*} data { userId, varietyId, quantity }
   * @returns { cartProduct }
   */
  async addProductToCart(data) {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: data.userId,
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const product = await prisma.variety.findFirst({
      where: {
        id: data.varietyId,
      },
    });

    if (!product || product.stock < data.quantity) {
      throw new Error("Product not found or not enough stock");
    }

    const cartProduct = await prisma.cartProduct.findFirst({
      where: {
        cartId: cart.id,
        varietyId: data.varietyId,
      },
    });

    if (cartProduct) {
      return await prisma.cartProduct.update({
        where: { id: cartProduct.id },
        data: { quantity: cartProduct.quantity + data.quantity },
      });
    }

    return await prisma.cartProduct.create({
      data: {
        cartId: cart.id,
        varietyId: data.varietyId,
        quantity: data.quantity,
      },
    });
  }

  async removeProductFromCart(data) {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: data.userId,
      },
    });
  }
}

export default CartService;
