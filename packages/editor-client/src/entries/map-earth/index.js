import "tailwindcss/lib/css/preflight.css";
import EventsManager from "./eventsManager.js";
import MapManager from "./mapManager.js";
import * as Map from "./map.js";
import MapView from "../../views/map.html";

document.querySelector("body").innerHTML = MapView;

const map = Map.init();
const eventsManager = new EventsManager();
const mapManager = new MapManager();

mapManager.setup(map, eventsManager);
eventsManager.setup(map, mapManager);
