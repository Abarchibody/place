const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const getGeoByIp = ip => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://www.geoplugin.net/json.gp?ip=${ip}`)
      .then(res => {
        let geo = {
          areaCode: res.data.geoplugin_areaCode,
          city: res.data.geoplugin_city,
          continentCode: res.data.geoplugin_continentCode,
          continentName: res.data.geoplugin_continentName,
          countryCode: res.data.geoplugin_countryCode,
          countryName: res.data.geoplugin_countryName,
          credit: res.data.geoplugin_credit,
          currencyCode: res.data.geoplugin_currencyCode,
          currencyConverter: res.data.geoplugin_currencyConverter,
          currencySymbol: res.data.geoplugin_currencySymbol,
          currencySymbol_UTF8: res.data.geoplugin_currencySymbol_UTF8,
          delay: res.data.geoplugin_delay,
          dmaCode: res.data.geoplugin_dmaCode,
          euVATrate: res.data.euVATrate,
          inEU: res.data.geoplugin_inEU,
          locationAccuracyRadius: res.data.geoplugin_locationAccuracyRadius,
          latitude: res.data.geoplugin_latitude,
          longitude: res.data.geoplugin_longitude,
          region: res.data.geoplugin_region,
          regionCode: res.data.geoplugin_regionCode,
          regionName: res.data.geoplugin_regionName,
          request: res.data.geoplugin_request,
          ip,
          status: res.data.geoplugin_status,
          timezone: res.data.geoplugin_timezone
        };

        // Remove empty values
        Object.keys(geo).forEach(key => {
          if (!geo[key]) delete geo[key];
        });
        resolve(geo);
      })
      .catch(err => reject(err));
  });
};

const requestIP = req => {
  try {
    return (
      req.headers["x-real-ip"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress
    );
  } catch (e) {
    console.error(e);
    return "";
  }
};

app.all("*", async (req, res) => {
  const ip = requestIP(req);
  if (!ip) {
    return res.status(400).json({ message: "IP is not defined" });
  }

  try {
    const geolocation = await getGeoByIp(ip);
    res.status(200).json(geolocation);
  } catch (error) {
    res.status(500).json({ message: "Unable to find location" });
  }
});

module.exports = app;
