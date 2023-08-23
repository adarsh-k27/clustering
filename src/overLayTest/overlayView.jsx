/* eslint-disable react-hooks/exhaustive-deps */
import {  useEffect, useMemo, useRef, useState } from "react";
import { createPortal, render } from "react-dom";
import { Overlay } from "./overlay";

// type OverlayProps = PropsWithChildren<{
//   position: google.maps.LatLng | google.maps.LatLngLiteral
//   pane?: keyof google.maps.MapPanes
//   map: google.maps.Map
//   zIndex?: number
// }>

export default function OverlayView({
  position,
  pane = "floatPane",
  map,
  zIndex,
  children,
  heatmapArray,
}) {
  const [data, setData] = useState(false);

  const container = useMemo(() => {
    //container styling
    const div = document.createElement("div");
    div.setAttribute("id", "container");
    div.style.position = "absolute";
    div.style.backgroundColor = "white";
    div.style.padding = "10px";
    div.style.height = "15rem";
    div.style.width = "20rem";
    //mapStyling
    // const mapContainer = document.createElement("div");
    // mapContainer.setAttribute("id", "hashMap");
    // mapContainer.style.height = "15rem";
    // mapContainer.style.width = "20rem";
    // mapContainer.style.position = "relative";
    //mapContainer.style.z
    //mapOptions here
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

    //const mapDetails = new window.google.maps.Map(mapContainer, mapOptions);

    // const gHeatMap = new window.google.maps.visualization.HeatmapLayer({
    //   data: heatmapArray.map(
    //     (lat_lng) => new window.google.maps.LatLng(lat_lng[1], lat_lng[0])
    //   ),
    //   map: mapDetails,
    //   maxIntensity: 50,
    //   radius: 5,
    //   opacity: 1,
    // });
    // div.appendChild(mapContainer);
    return div;
  }, [window.google]);

  const overlay = useMemo(() => {
    return new Overlay(container, pane, position);
  }, [container, pane, position]);

  useEffect(() => {
    overlay?.setMap(map);
    return () => overlay?.setMap(null);
  }, [map, overlay]);

  // to move the container to the foreground and background
  useEffect(() => {
    container.style.zIndex = `${zIndex}`;
  }, [zIndex, container]);

  return createPortal(children, container);
}

