import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import {get as getProjection, Projection, addProjection} from 'ol/proj.js';
import { getWidth } from 'ol/extent';

proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
const projection = new Projection({
	code: 'EPSG:4490', 
	units: 'degrees',
	axisOrientation: 'neu'
});
projection.setExtent([-180, -90, 180, 90]);
projection.setWorldExtent([-180, -90, 180, 90]);
addProjection(projection)
const projection4490 = getProjection('EPSG:4490');
const view4490 = new View({
  projection: projection4490,
  center:[114.89, 30.47],
  zoom: 12
})
let projectionExtent = projection.getExtent();
let size = getWidth(projectionExtent) / 512; //size就是一个像素代表的经纬度

let matrixIds = [];
function getResolutions2() {
	let resolutions = [];
	for (let z = 0; z < 20; ++z) {
		resolutions[z] = size / Math.pow(2, z);
		matrixIds[z] = z;
	}
	return resolutions;
}
console.log(getResolutions2())
const layer_wmts = new TileLayer({
  source: new WMTS({
      //服务地址
      url: 'http://172.20.128.191:8021/rasterserver/image/WMTS/1.0/航飞影像_黄州区2022年',
      layer: '航飞影像_黄州区2022年',
      serviceName: '航飞影像_黄州区2022年',
      //切片集
      matrixSet: 'EPSG:4490',
      format: 'image/png',
      // projection: projection4490,
      version: '1.0.0',
      //切片信息
      tileGrid: new WMTSTileGrid({
          tileSize: [512, 512],
          extent: [-180.0, -90.0, 180.0, 90.0],//范围
          origin: [-180.0, 90.0],
          resolutions: getResolutions2(),
          matrixIds: matrixIds
      }),
      wrapX: true
  })
});
//初始化地图
const map2 = new Map({
  layers: [
      layer_wmts
  ],
  //渲染方式
  render: 'canvas',
  target: 'map',
  view: view4490
});