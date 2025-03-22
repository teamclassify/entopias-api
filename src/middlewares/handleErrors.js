import ResponseDataBuilder from "../models/ResponseData.js";

function handleErrors(err, _req, res, _next) {
  const responseBody = new ResponseDataBuilder()
    .setData(null)
    .setError(err)
    .setMsg("Error")
    .setStatus(err.status ?? 500)
    .build();

  res.status(responseBody.status).json(responseBody);
}

export default handleErrors;
