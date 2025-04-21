import CartService from "../services/CartService.js";

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
}

export default CartController;
