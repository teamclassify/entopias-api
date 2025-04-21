import CartService from "../services/CartService.js";
import ResponseDataBuilder from "../models/ResponseData.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req, res, next) => {
    const id = req.id;

    const cart = await this.cartService.getCart(id);

    const data = new ResponseDataBuilder()
      .setData(cart)
      .setStatus(200)
      .setMsg("Cart found")
      .build();

    res.status(data.status).json(data);
  };

  addProductToCart = async (req, res, next) => {
    const id = req.id;
    const { varietyId, quantity } = req.body;

    try {
      const cart = await this.cartService.addProductToCart({
        userId: id,
        varietyId,
        quantity,
      });

      const data = new ResponseDataBuilder()
        .setData(cart)
        .setStatus(200)
        .setMsg("Product added to cart")
        .build();

      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  };

  removeProductFromCart = async (req, res, next) => {
    const id = req.id;
    const { varietyId } = req.body;

    try {
      const cart = await this.cartService.removeProductFromCart({
        userId: id,
        varietyId,
      });

      const data = new ResponseDataBuilder()
        .setData(cart)
        .setStatus(200)
        .setMsg("Product removed from cart")
        .build();

      res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
