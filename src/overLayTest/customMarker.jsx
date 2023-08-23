import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import OverlayView from "./overlayView";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { GEO_CORDINATES } from "../geodata";
import { useEffect, useRef, useState } from "react";
// interface CustomMarkerProps {
//   hotel: Hotel;
//   map?: google.maps.Map;
// }

export default function CustomMarker({ position, map, heatmap, setHeatMap }) {
  const geoCordinatesData = [
    GEO_CORDINATES.SampleData,
    GEO_CORDINATES.TraverseData,
  ];



  const [heatmapArray, setHeatMapArray] = useState(geoCordinatesData[0]);

  const PrevClick = () => {
    setHeatMapArray(geoCordinatesData[0]);
  };

  const NextClick = () => {
    setHeatMapArray(geoCordinatesData[1]);
  };

  return (
    <>
      {map && (
        <OverlayView
          position={position}
          map={map}
          styles={{
            backgorundColor: "DarkGray",
            color: "white",
          }}
          heatmapArray={heatmap}
        >
          <Dlement
            heatmapArray={heatmapArray}
            PrevClick={PrevClick}
            NextClick={NextClick}
          />
        </OverlayView>
      )}
    </>
  );
}

function Dlement({ heatmapArray, PrevClick, NextClick }) {
  const MapRef = useRef(null);
  const heatMapRef = useRef();
  const mapElement = useRef();
  const mapOptions = {
    zoom: 11,
    scrollwheel: true,
    draggable: false,
    disableDoubleClickZoom: false,
    keyboardShortcuts: false,
    center: { lat: heatmapArray[0][1], lng: heatmapArray[0][0] },
    disableDefaultUI: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    mapTypeId: "roadmap",
  };
  useEffect(() => {
    if (window.google) {
      let gm = new window.google.maps.Map(MapRef.current, mapOptions);
      const gHeatMap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapArray.map(
          (lat_lng) => new window.google.maps.LatLng(lat_lng[1], lat_lng[0])
        ),
        map: gm,
        maxIntensity: 50,
        radius: 5,
        opacity: 1,
      });
      heatMapRef.current = gHeatMap;
      mapElement.current = gm;
    }
  }, [window.google]);

  useEffect(() => {
    if (mapElement.current && heatMapRef.current && window.google) {
      const hmdata = heatmapArray.map(
        (lat_lng) => new window.google.maps.LatLng(lat_lng[1], lat_lng[0])
      );
      heatMapRef.current.setData(hmdata);
      mapElement.current.setCenter(mapOptions.center);
    }
  }, [heatmapArray]);

  return (
    <div>
      <button onClick={PrevClick}>Prev</button>
      <button onClick={NextClick}>Next</button>
      <div
        ref={MapRef}
        style={{ width: "100%", height: "15rem", position: "relative" }}
      ></div>
    </div>
  );
}

//here two Arrows when we click on Arrows We Need to Change The HeatMap Data
