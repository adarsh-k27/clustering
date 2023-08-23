/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */

import { useState, useEffect, useRef } from "react";
import { gpx } from "@tmcw/togeojson";
import { DOMParser } from "xmldom";
import { GEO_CORDINATES } from "./geodata";
import { ThreeDots } from "react-loader-spinner";
import { UploafileAction, updateCollection } from "./actions/geography";
import CustomMarker from "./overLayTest/customMarker";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";

function App() {
  const map = useRef(null);
  const [heatmap, setHeatmap] = useState(null);
  const [geoCordinates, setGeoCordinates] = useState([]);
  const [loadRef, setLoadRef] = useState(false);
  const [zoom, setZoomLevel] = useState(5);
  const [position, setPosition] = useState(null);
  const [dd, setDd] = useState(GEO_CORDINATES.SampleData);
  var highlightedClusterIcon = {
    url: "http://localhost:3000/images.png", // Replace with your custom icon URL
    size: new google.maps.Size(48, 48),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(24, 24),
  };

  useEffect(() => {
    if (window.google) {
      const gMap = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: 32.947603510692716, lng: -117.23711790516973 },
        //center: { lat: -34.397, lng: 150.644 },
        mapTypeId: "roadmap",
        minZoom: 2,
        disableDefaultUI: true,
      });
      map.current = gMap;
      const gHeatMap = new window.google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: gMap,
        maxIntensity: 60,
        radius: 7,
        opacity: 0.4,
        dissipating:true,
      });
      setHeatmap(gHeatMap);
      setGeoCordinates(getPoints());

      let clustersMarker = new MarkerClusterer(
        gMap,
        [
          // Add more markers...
        ],
        {
          imagePath: "http://localhost:3000/logo192.png",
          styles: [
            {
              url: "http://localhost:3000/logo192.png", // URL to your custom cluster icon image
              width: 80, // Width of the cluster icon image
              height: 80, // Height of the cluster icon image
              anchorText: [-15, -15], // Position of the text label within the icon (if applicable)
            },
            // Add more styles for different cluster sizes if needed
          ],
        }
      );

      let infoWindow = new google.maps.InfoWindow();

      const html = `<div>
            <h1>Hy Hello mY window</h1>
         </div>`;

      google.maps.event.addListener(
        clustersMarker,
        "clusterclick",
        (cluster) => {
          clustersMarker.zoomOnClick_ = false;
          setPosition({ lat: 32.947603510692716, lng: -117.23711790516973 });
          cluster.clusterIcon_.height_ = 40;
          cluster.clusterIcon_.div_.autofocus = true;
          cluster.clusterIcon_.div_.style.color = "green";
          cluster.clusterIcon_.url_ = "http://localhost:3000/cluster.png";
          cluster.clusterIcon_.show();

          // infoWindow.setContent(html);
          // infoWindow.setPosition({ lat: -34.397, lng: 150.644 });
          // infoWindow.open({ map: gMap });
        }
      );

      //lat="32.947603510692716" lon="-117.23711790516973"
      //lat="32.94806493446231" lon="-117.23676351830363"
      google.maps.event.addListener(gMap, "zoom_changed", () => {
        //here we will get zoom level with
        const zoomLevel = gMap.getZoom();

        //initial Zoomlevel approximate to 11
        setZoomLevel(zoomLevel);
        if (zoomLevel <= 9) {
          //console.log("Add Cluster");

          const newCordinates = GEO_CORDINATES;

          // const markers = Object.keys(newCordinates).map((key) => {
          //   return new google.maps.Marker({
          //     position: {
          //       lat: GEO_CORDINATES[key][0][1],
          //       lng: GEO_CORDINATES[key][0][0],
          //     },
          //     label: "1",
          //   });
          // });

          const markers = [
            new google.maps.Marker({
              position: { lat: -34.397, lng: 150.644 },
              label: "1",
              title: "this is heat map 2",
            }),
            new google.maps.Marker({
              position: { lat: -35.397, lng: 151.644 },
              label: "1",
              title: "This is heatmap 1",
            }),
            new google.maps.Marker({
              position: { lat: -27.4705, lng: 153.026 },
              label: "1",
              title: "This is heatmap 1",
            }),
            new google.maps.Marker({
              position: { lat: -28.0167, lng: 153.4 },
              label: "1",
              title: "This is heatmap 1",
              icon: {
                url: "http://localhost:3000/cluster.png", // URL to your custom icon image
                scaledSize: new google.maps.Size(20, 20), // Adjust the size of the icon
              },
            }),
            // Add more markers...
          ];

          clustersMarker.clearMarkers();
          clustersMarker.addMarkers(markers);
          gHeatMap.setData([]);
        } else {
          if (gMap) {
            gHeatMap.setData(getPoints());
            if (clustersMarker) {
              clustersMarker.clearMarkers();
            }
          }
        }
      });
    }
  }, [window.google]);

  function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map.current);
  }

  function changeGradient() {
    var gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];
    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
  }

  function changeRadius() {
    //heatmap.set("radius", heatmap.get("radius") ? null : 1);
  }

  function changeOpacity() {
    heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
  }

  const findRandomNumber = () => {
    const decimalPlaces = 2; // Adjust this to the number of decimal places you want
    const randomNumber = (Math.random() * 2).toFixed(decimalPlaces);
    return +randomNumber;
  };
  //im getting random weight here

  function getPoints() {
    const geoArray = [
      ...GEO_CORDINATES.SampleData,
      ...GEO_CORDINATES.TraverseData,
    ];
    return geoArray.map((lat_lng) => ({
      location: new google.maps.LatLng(lat_lng[1], lat_lng[0]),
      weight: findRandomNumber(),
      //i call that function here
    }));
  }

  function uploadGpx() {}
  const addingFile = async () => {
    const fetching = await fetch(
      "https://firebasestorage.googleapis.com/v0/b/heat-map-95b3b.appspot.com/o/sampledebu%20(1)%20-%20Copy%20-%20Copy%20-%20Copy%20-%20Copy.gpx"
    )
      .then((res) => {
        debugger;
      })

      .catch((err) => {
        debugger;
      });
    debugger;
  };

  const getPromiseCoordinat = async (file) => {
    const UploadedUrl = await UploafileAction(file);
    debugger;
    return new Promise(async (resolve) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const gpxContent = e.target.result;
        const gpxDoc = new DOMParser().parseFromString(gpxContent);
        const geojson = gpx(gpxDoc);

        // here we need to get the timeand travel distance
        const cordinates = geojson.features[0].geometry.coordinates.map(
          (lat_lng) => new google.maps.LatLng(lat_lng[1], lat_lng[0])
        );

        resolve(coordinates);
      };

      reader.onerror = () => resolve(false);

      reader.readAsText(file);
    });
  };

  async function handleChange(e) {
    let coordinate = [];
    setLoadRef(!!e.target.files);
    for (let i = 0; i < e.target.files.length; i++) {
      const finalCoordinat = await getPromiseCoordinat(e.target.files[i]);
      if (finalCoordinat.cordinates) {
        coordinate = [...coordinate, ...finalCoordinat.cordinates];
      }
      //here we are updating data base
      const { collectiondata } = {};
      await updateCollection();
    }
    if (coordinate.length) {
      const center = { lat: coordinate[0].lat(), lng: coordinate[0].lng() };
      map.current.setCenter(center);
      const finalCordinate = [...geoCordinates, ...coordinate];
      heatmap.setData(finalCordinate);
      setGeoCordinates(finalCordinate);
    }
    setLoadRef(false);
  }

  return (
    <div className="App" style={{ width: "100%", height: "100vh" }}>
      {/* <iframe
        title="Embedded Content"
        width="100%"
        height="100%"
        src="/map.html"
        //srcDoc={htmlContent} // Set the fetched and sanitized HTML content here
        allowFullScreen={true}
      /> */}

      {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
      <div id="floating-panel">
        <button onClick={toggleHeatmap}>Toggle Heatmap</button>
        <button onClick={changeGradient}>Change gradient</button>
        <button onClick={changeRadius}>Change radius</button>
        <button onClick={changeOpacity}>Change opacity</button>
        <button onClick={addingFile}>Adding File</button>
        <label className="gpx">
          <button onClick={uploadGpx}>
            {loadRef ? (
              <ThreeDots
                height="10"
                width="80"
                radius="9"
                color="#000000"
                ariaLabel="three-dots-loading"
                wrapperStyle={{ display: "block" }}
                visible={true}
              />
            ) : (
              "Upload GPX"
            )}{" "}
          </button>
          <input type="file" multiple accept=".gpx" onChange={handleChange} />
        </label>
      </div>
      <div>{zoom}</div>
      <div id="map">
        <CustomMarker
          position={position}
          map={map.current && map.current}
          heatmap={dd}
          setHeatMap={setDd}
        />
      </div>
    </div>
  );
}

export default App;

//see the putput then write a function (we needto add cluster after specific zoom level,)
// we need to apply clustering for HeatMap
// so find aneffective way
