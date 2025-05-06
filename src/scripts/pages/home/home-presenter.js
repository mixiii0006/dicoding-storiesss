import L from "leaflet";
import "leaflet/dist/leaflet.css"; 

import markerIcon from "/src/public/images/marker-icon.png";
import markerShadow from "/src/public/images/marker-shadow.png";

import {
  getAllStories,
} from "../../data/api.js";

import { saveStories, getAllStories as getStoriesFromIDB } from "../../utils/indexeddb.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.currentPage = 1;
    this.pageSize = 20;
    this.map = null;
  }

  async init() {
    this.view.clearStoryList();
    this.view.clearMap();

    const token = localStorage.getItem("token");
    if (!token) {
      this.view.showLoginPrompt();
      return;
    }

    this.setupMap();

    try {
      await this.loadStories(this.currentPage);
    } catch (error) {
      console.warn("Loading stories from IndexedDB due to error:", error);
      const cachedStories = await getStoriesFromIDB();
      if (cachedStories.length > 0) {
        this.view.renderStories(cachedStories);
        this.addMarkersToMap(cachedStories);
        this.view.disableNextPageButton();
      } else {
        this.view.showLoadError();
      }
    }

    this.view.setNextPageButtonHandler(async () => {
      this.currentPage += 1;
      await this.loadStories(this.currentPage);
    });
  }

  setupMap() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    this.map = L.map("map").setView([0, 0], 2);

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
      },
    );

    const topoLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenTopoMap contributors",
      },
    );

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
  }

  async loadStories(page) {
    try {
      const token = localStorage.getItem("token");
      const storiesResponse = await getAllStories(token, page, this.pageSize, 1);
      const stories = storiesResponse.listStory || [];

      if (page === 1) {
        this.view.clearStoryList();
        this.clearMapMarkers();
      }

      this.view.renderStories(stories);
      await saveStories(stories);

      if (stories.length > 0) {
        const firstStory = stories[0];
        if (firstStory.lat !== null && firstStory.lon !== null) {
          this.map.setView([firstStory.lat, firstStory.lon], 5);
        }
      }

      if (stories.length < this.pageSize) {
        this.view.disableNextPageButton();
      } else {
        this.view.enableNextPageButton();
      }

      this.view.setStoryDetailButtonHandlers((id) => {
        window.location.hash = `#/story/${id}`;
      });

      this.addMarkersToMap(stories);
    } catch (error) {
      this.view.showLoadError();
      console.error(error);
      throw error;
    }
  }

  clearMapMarkers() {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }

  addMarkersToMap(stories) {

    const customIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41], 
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34], 
      shadowSize: [41, 41], 
    });

    stories.forEach((story) => {
      if (story.lat !== null && story.lon !== null) {
        const marker = L.marker([story.lat, story.lon], { icon: customIcon, title: story.name, alt: story.description }).addTo(this.map);
        marker.bindPopup(`<strong>${story.name}</strong><br />${story.description}<br /><img src="${story.photoUrl}" alt="Photo of story by ${story.name}" width="150" />`);
      }
    });
  }
}
