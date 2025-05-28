import axios from "axios";

class ShipmentController {
  getCities = async (req, res, next) => {
    try {
      const { city } = req.query;

      const apiURL = `https://mobile.servientrega.com/Services/RateQuote/api/Cotizador/AutoCompleteCiudadesOrigen/1/2/es/${city}?term=${city}`;

      const response = await axios.get(apiURL, {
        headers: {},
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  add = async (req, res, next) => {
    try {
      const { ciudadOrigenId, ciudadDestinoId, valorDeclarado } = req.query;

      const cityResponse = await axios.get(
        `https://mobile.servientrega.com/Services/RateQuote/api/Cotizador/AutoCompleteCiudadesOrigen/1/2/es/${ciudadDestinoId}?term=${ciudadDestinoId}`,
        {
          headers: {},
        }
      );

      if (!cityResponse.data || cityResponse.data.length === 0) {
        return res
          .status(404)
          .json({ error: "Ciudad de destino no encontrada" });
      }

      const cityId = cityResponse.data[0].Id;

      const url = `https://mobile.servientrega.com/Services/RateQuote/api/Cotizador/Tarifas/${ciudadOrigenId}/${cityId}/10/20/10/2/${valorDeclarado}/2/es`;

      const response = await axios.get(url, {
        headers: {},
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default ShipmentController;
