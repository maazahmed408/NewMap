import React, { useState, useEffect } from 'react';

const minLongitude = 77.597;
const maxLongitude = 77.603;
const minLatitude = 12.984;
const maxLatitude = 12.985;

function generateRandomCoordinate() {
  const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
  const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
  return [longitude, latitude];
}

const GeoJSONData = () => {
  const [data, setData] = useState({ type: 'FeatureCollection', features: [] });

  useEffect(() => {
    fetch('http://localhost:8003/items')
      .then(response => response.json())
      .then(vehicleData => {
        const generatedFeatures = [];

        vehicleData.forEach(item => {
          const { vehicleId, soc: finalSOC } = item;
          const initialSOC = 100;
          const numFeatures = 3;

          for (let i = 0; i < numFeatures; i++) {
            const randomCoordinate = generateRandomCoordinate();

            // Calculate interpolated SOC based on initial and final SOC
            const interpolatedSOC = initialSOC - (initialSOC - finalSOC) * (i + 1) / numFeatures;

            const feature = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: randomCoordinate,
              },
              properties: {
                vehicle_id: vehicleId,
                soc: interpolatedSOC,
              },
            };
            generatedFeatures.push(feature);
          }
        });

        setData({ type: 'FeatureCollection', features: generatedFeatures });
      })
      .catch(error => {
        console.error('Error fetching vehicle data:', error);
      });
  }, []);

  return data;
};

export default GeoJSONData;












