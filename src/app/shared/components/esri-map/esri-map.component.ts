import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { loadModules } from 'esri-loader';
import { EsriMapService } from './esri-map.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.less']
})
export class EsriMapComponent implements OnInit, OnDestroy {

  @Output() mapLoadedEvent = new EventEmitter<boolean>();
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  private _map: any = null; //地图
  private _view: any = null; // 视图
  public _loaded = false;

  constructor(private esriMapService: EsriMapService) { }

  // 初始化组件
  ngOnInit() {
    this.initializeMap().then((sceneView) => {
      // The map has been initialized
      console.log("sceneView ready: ", this._view.ready);

      // 加载完成后处理
      this.esriMapService.setMap(this._map);
      this.esriMapService.setView(sceneView);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true); // 向父组件传递，视图加载完毕
      
      // 初始化工具
      this.initWidget();
    });
  }

  // 初始化地图
  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, SceneView] = await loadModules(['esri/Map', 'esri/views/SceneView']);

      // Configure the Map
      this._map = new Map({
        basemap: "hybrid",
        ground: "world-elevation"
      });

      // Initialize the MapView
      this._view = new SceneView({
        container: this.mapViewEl.nativeElement,
        map: this._map,
        camera: {
          position: [
            107.74266, // lon
            30.35908, // lat
            25045390,  // elevation in meters
          ],
        },
        padding: { left: 0, top: 0, right: 0, bottom: 0 },
        ui: { components: [] } // 置空默认的工具
      });

      await this._view.when();
      return this._view;

    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  // 初始化工具
  async initWidget() {
    const [Home, Compass, Zoom, Search, Expand, CoordinateConversion, BasemapGallery, LayerList] = await loadModules([
      'esri/widgets/Home',
      'esri/widgets/Compass',
      'esri/widgets/Zoom',
      'esri/widgets/Search',
      'esri/widgets/Expand',
      'esri/widgets/CoordinateConversion',
      'esri/widgets/BasemapGallery',
      'esri/widgets/LayerList'
    ]);

    const compass = new Compass({ view: this._view }); // 指南针
    const zoom = new Zoom({ view: this._view }); // 缩放
    const home = new Home({ view: this._view }); // home
    const coordinate = new CoordinateConversion({ view: this._view }); // 坐标转换
    const search = new Search({ view: this._view }); // 搜索
    const expand_search = new Expand({ view: this._view, content: search, expandTooltip: '搜索' }); // 折叠-搜索
    const basemapGallery = new BasemapGallery({ view: this._view }); // 底图容器
    const expand_basemap = new Expand({ view: this._view, content: basemapGallery, expandTooltip: '底图' }); // 折叠-底图容器
    const expand_tool = new Expand({ view: this._view, content: document.getElementById('map-draw-tool'), expandIconClass: "esri-icon-polyline", expandTooltip: '绘制' }); // 折叠-绘制工具条
    const layerList = new LayerList({ view: this._view });
    const expand_layerList = new Expand({ view: this._view, content: layerList, expandIconClass: "esri-icon-layers", expandTooltip: '图层' }); // 折叠-图层

    this._view.ui.components = [];
    this._view.ui.add(expand_search, "top-right");
    this._view.ui.add(expand_tool, 'top-left');
    this._view.ui.add(zoom, 'top-left');
    this._view.ui.add(compass, 'top-left');
    this._view.ui.add(home, 'top-left');
    this._view.ui.add(expand_basemap, 'top-right');
    this._view.ui.add(coordinate, "bottom-left");
    this._view.ui.add(expand_layerList, "top-right");

  }


  // 销毁组件，销毁地图实例
  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
      this.esriMapService.setMap(null);
      this.esriMapService.setView(null);
    }
  }

}
