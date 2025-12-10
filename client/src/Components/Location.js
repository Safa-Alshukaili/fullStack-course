// src/Components/Location.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Location = () => {
  const [ip, setIp] = useState(null);        // IP address
  const [geoData, setGeoData] = useState(null); // Country / Region

  // 1) جلب الـ IP من ipify
  const fetchIpAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      setIp(response.data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error.message);
    }
  };

  // 2) جلب بيانات الـ Geolocation باستخدام الـ IP
  const getGeoLocationData = async () => {
    if (!ip) return; // نتأكد إن الـ IP جاهز

    try {
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country?apiKey=at_hLX3rngVbIZ1IHWiSkeVLDqgafmiU&ipAddress=${ip}`
      );
      setGeoData(response.data);
      console.log("GeoLocation Data:", response.data);
    } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
    }
  };

  // 3) أول ما يشتغل الكومبوننت → يجيب الـ IP
  useEffect(() => {
    fetchIpAddress();
  }, []);

  // 4) لما يتغير الـ IP → نجيب بيانات الدولة/المنطقة
  useEffect(() => {
    if (ip) {
      getGeoLocationData();
    }
  }, [ip]);

  return (
    <div className="location">
      <br />
      {ip ? <p>IP Address: {ip}</p> : <p>Loading IP address...</p>}
      

      {geoData ? (
       <div>
    Country: {geoData.location.country}
    <br />
    Region: {geoData.location.region.replace("Governorate", "").trim()}
    <br />
    Governorate
  </div>
) : (
  <p>Loading Geolocation Data...</p>
      )}
    </div>
  );
};

export default Location;
