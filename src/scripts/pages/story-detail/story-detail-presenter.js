import { getStoryDetail } from "../../data/api.js";


import L from "leaflet";
import "leaflet/dist/leaflet.css";


import markerIcon from "/src/public/images/marker-icon.png";
import markerShadow from "/src/public/images/marker-shadow.png";

export default class StoryDetailPresenter {
  constructor(view) {
    this.view = view;
    this.map = null;
  }

  async init() {
    const backButton = document.getElementById("back-button");

    const url = window.location.hash.slice(2);
    const id = url.split("/")[1];

    const token = localStorage.getItem("token");
    if (!token) {
      this.view.showLoginPrompt();
      return;
    }

    try {
      const response = await getStoryDetail(token, id);
      if (response.error) {
        this.view.showError(response.message);
        return;
      }

      const story = response.story;
      this.view.renderStoryDetail(story);

      if (story.lat !== null && story.lon !== null) {
        this.initMap(story.lat, story.lon, story);
      } else {
        this.view.showNoLocation();
      }
    } catch (error) {
      this.view.showError(`Error loading story detail: ${error.message}`);
    }

    backButton.addEventListener("click", () => {
      window.location.hash = "#/";
    });
  }

  initMap(lat, lon, story) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    this.map = L.map("story-map").setView([lat, lon], 13);

    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    });

    const topoLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenTopoMap contributors",
    });

    const watercolorLayer = L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
      {
        attribution: "Map tiles by Stamen Design, under CC BY 3.0.",
      },
    );

    osmLayer.addTo(this.map);

    const baseMaps = {
      OpenStreetMap: osmLayer,
      Topographic: topoLayer,
      Watercolor: watercolorLayer,
    };

    L.control.layers(baseMaps).addTo(this.map);


    const customIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41], 
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34], 
      shadowSize: [41, 41], 
    });

    L.marker([lat, lon], { icon: customIcon, title: story.name, alt: story.description })
      .addTo(this.map)
      .bindPopup(`<strong>${story.name}</strong><br />${story.description}`)
      .openPopup();
  }
}
