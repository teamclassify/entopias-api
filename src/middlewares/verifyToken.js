import auth from "../config/firebase.js";
import ResponseDataBuilder from "../models/ResponseData.js";
import UserService from "../services/UserService.js";

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  const userService = new UserService();

  if (!token || !token.split(" ")[1]) {
    const response = new ResponseDataBuilder()
      .setStatus(401)
      .setError("invalid token")
      .setMsg("unauthorized")
      .build();

    return res.status(401).json(response);
  }

  token = token.split(" ")[1];

  auth
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      req.id = uid;

      if (req.user) {
        return next();
      } else {
        req.user = await userService.findOne(uid);
      }

      next();
    })
    .catch(() => {
      const response = new ResponseDataBuilder()
        .setStatus(401)
        .setError("invalid token")
        .setMsg("unauthorized")
        .build();

      return res.status(401).json(response);
    });
};

export default verifyToken;
