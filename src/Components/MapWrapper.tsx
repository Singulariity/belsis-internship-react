import { Collection, Feature, Map, MapBrowserEvent } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { Heatmap } from 'ol/layer';
import { useRef, useEffect, useState } from 'react';
import { fromLonLat, get } from 'ol/proj';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import Select from 'ol/interaction/Select';
import Style from 'ol/style/Style';
import { RegularShape } from 'ol/style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { click } from 'ol/events/condition';
import { defaults } from 'ol/interaction/defaults';
import XYZ from 'ol/source/XYZ';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import store, { InteractionType } from '../Store';
import { observer } from 'mobx-react';
import { Type } from 'ol/geom/Geometry';
import { CustomControl } from '../Classes/CustomControl';
import VectorSource from 'ol/source/Vector';
import { GeoJSON, KML } from 'ol/format';
import {
	FormGroup,
	Input,
	Label,
	PopoverBody,
	PopoverHeader,
	UncontrolledPopover,
} from 'reactstrap';
import LayerList from './LayerList';
import { refreshFeatures } from '../Utils/Utils';
import { LayerData } from '../Classes/LayerData';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import { Point } from 'ol/geom';

function MapWrapper() {
	const [polygonState, setPolygonState] = useState(true);
	const [lineStringState, setLineStringState] = useState(true);
	const [pointState, setPointState] = useState(true);

	const selectStyle = new Style({
		fill: new Fill({
			color: 'rgba(222, 15, 0, 0.4)',
		}),
	});

	const mapRef = useRef<Map | undefined>();
	mapRef.current = store.map;

	const key = 'WZ0sdFIqkB9Op27P87FQ';
	const attributions =
		'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
		'<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

	function PolygonHandler() {
		store.currentInteraction = InteractionType.draw_polygon;
	}
	function LineStringHandler() {
		store.currentInteraction = InteractionType.draw_linestring;
	}
	function PointHandler() {
		store.currentInteraction = InteractionType.draw_point;
	}
	function ModifyHandler() {
		store.currentInteraction = InteractionType.modify;
	}
	function EditHandler() {
		store.currentInteraction = InteractionType.edit;
	}
	function DeleteHandler() {
		store.currentInteraction = InteractionType.delete;
	}
	function FeatureListHandler() {
		store.featureList = true;
	}
	function LayerListHandler() {}

	useEffect(() => {
		const extent = get('EPSG:3857')!.getExtent().slice();
		extent[0] += extent[0];
		extent[2] += extent[2];

		var controls = defaultControls();
		controls.push(
			new CustomControl(
				PolygonHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M96 151.4V360.6c9.7 5.6 17.8 13.7 23.4 23.4H328.6c0-.1 .1-.2 .1-.3l-4.5-7.9-32-56 0 0c-1.4 .1-2.8 .1-4.2 .1c-35.3 0-64-28.7-64-64s28.7-64 64-64c1.4 0 2.8 0 4.2 .1l0 0 32-56 4.5-7.9-.1-.3H119.4c-5.6 9.7-13.7 17.8-23.4 23.4zM384.3 352c35.2 .2 63.7 28.7 63.7 64c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32H119.4c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V151.4C12.9 140.4 0 119.7 0 96C0 60.7 28.7 32 64 32c23.7 0 44.4 12.9 55.4 32H328.6c11.1-19.1 31.7-32 55.4-32c35.3 0 64 28.7 64 64c0 35.3-28.5 63.8-63.7 64l-4.5 7.9-32 56-2.3 4c4.2 8.5 6.5 18 6.5 28.1s-2.3 19.6-6.5 28.1l2.3 4 32 56 4.5 7.9z"/></svg>',
				'ol-draw_polygon'
			)
		);
		controls.push(
			new CustomControl(
				LineStringHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"/></svg>',
				'ol-draw_linestring'
			)
		);
		controls.push(
			new CustomControl(
				PointHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>',
				'ol-draw_point'
			)
		);
		controls.push(
			new CustomControl(
				ModifyHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h32v96H128V192c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V288h96v96H192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8H288V288h96v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6v32H288V128h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64z"/></svg>',
				'ol-modify'
			)
		);
		controls.push(
			new CustomControl(
				EditHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>',
				'ol-edit'
			)
		);
		controls.push(
			new CustomControl(
				DeleteHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>',
				'ol-delete'
			)
		);
		controls.push(
			new CustomControl(
				FeatureListHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg>',
				'ol-featurelist'
			)
		);
		controls.push(
			new CustomControl(
				LayerListHandler,
				'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#ffffff" d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>',
				'ol-layerlist',
				'layerlistdiv'
			)
		);
		controls.push(new ScaleLine());

		const raster = new TileLayer({
			source: new XYZ({
				attributions: attributions,
				url:
					'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' +
					key,
				tileSize: 512,
			}),
		});
		const vector = new VectorLayer({
			source: store.source,
		});

		const turkey = new VectorLayer({
			source: new VectorSource({
				url: 'https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json',
				format: new GeoJSON(),
			}),
			style: new Style({
				fill: new Fill({
					color: 'rgba(222, 15, 0, 0.3)',
				}),
				stroke: new Stroke({
					color: 'rgba(222, 15, 0, 1.0)',
					width: 1,
				}),
			}),
			visible: false,
		});
		const china = new VectorLayer({
			source: new VectorSource({
				url: 'https://raw.githubusercontent.com/longwosion/geojson-map-china/master/china.json',
				format: new GeoJSON(),
			}),
			style: new Style({
				fill: new Fill({
					color: 'rgba(222, 133, 0, 0.3)',
				}),
				stroke: new Stroke({
					color: 'rgba(222, 133, 0, 1.0)',
					width: 1,
				}),
			}),
			visible: false,
		});
		const germany = new VectorLayer({
			source: new VectorSource({
				url: 'https://gist.githubusercontent.com/fegoa89/d33514a5e59eb5af812b909915bcb3da/raw/05ddd9064028f1218cf6a1efb797a1d903508ad5/germany-states.geojson',
				format: new GeoJSON(),
			}),
			style: new Style({
				fill: new Fill({
					color: 'rgba(0, 44, 222, 0.3)',
				}),
				stroke: new Stroke({
					color: 'rgba(0, 44, 222, 1.0)',
					width: 1,
				}),
			}),
			visible: false,
		});
		const earthquakes = new Heatmap({
			source: new VectorSource({
				url: 'https://raw.githubusercontent.com/openlayers/openlayers/main/examples/data/kml/2012_Earthquakes_Mag5.kml',
				format: new KML({
					extractStyles: false,
				}),
			}),
			blur: 10,
			radius: 10,
			weight: function (feature) {
				const name = feature.get('name');
				const magnitude = parseFloat(name.substr(2));
				return magnitude - 5;
			},
			visible: false,
		});

		const shaft = new RegularShape({
			points: 2,
			radius: 5,
			stroke: new Stroke({
				width: 2,
				color: 'black',
			}),
			rotateWithView: true,
		});

		const head = new RegularShape({
			points: 3,
			radius: 5,
			fill: new Fill({
				color: 'black',
			}),
			rotateWithView: true,
		});

		const styles = [
			new Style({ image: shaft }),
			new Style({ image: head }),
		];

		const winds = new VectorLayer({
			source: new VectorSource(),
			style: function (feature) {
				const wind = feature.get('wind');
				// rotate arrow away from wind origin
				const angle = ((wind.deg - 180) * Math.PI) / 180;
				const scale = wind.speed / 10;
				shaft.setScale([1, scale]);
				shaft.setRotation(angle);
				head.setDisplacement([
					0,
					head.getRadius() / 2 + shaft.getRadius() * scale,
				]);
				head.setRotation(angle);
				return styles;
			},
			visible: false,
		});

		//TODO wind features
		fetch('src/Data/weather_14.json')
			.then(async function (response) {
				return response.json();
			})
			.then(function (data) {
				const features: Feature[] = [];
				data.list.forEach(function (report: any) {
					const feature = new Feature(
						new Point(
							fromLonLat([report.coord.lon, report.coord.lat])
						)
					);
					features.push(feature);
				});
				winds.getSource()!.addFeatures(features);
			});

		store.layers.push(
			new LayerData('Türkiye', turkey),
			new LayerData('China', china),
			new LayerData('Germany', germany),
			new LayerData('Earthquakes', earthquakes),
			new LayerData('Winds', winds)
		);
		let coll = new Collection<BaseLayer>();
		store.layers.forEach((layerData) => {
			coll.push(layerData.getLayer());
		});
		let layers = new LayerGroup();
		layers.setLayers(coll);

		const initialMap = new Map({
			controls: controls,
			target: 'map',
			layers: [raster, layers, vector],
			view: new View({
				projection: 'EPSG:3857',
				center: [3854665, 4729726],
				zoom: 6,
				extent: extent,
			}),
		});

		// set map listeners
		initialMap.on('pointermove', handlePointerMove);

		store.map = initialMap;
	}, []);

	// FEATURE CHANGE
	useEffect(() => {
		if (store.features) {
			store.source.refresh();
			let arr: Feature[] = [];
			store.features.forEach((data) => {
				arr.push(data.getFeature());
			});
			store.source.addFeatures(arr);
		}
	}, [store.features]);

	// INTERACTION CHANGE
	useEffect(() => {
		if (!store.map) return;

		store.map.getInteractions().clear();
		store.map.addInteraction(new Snap({ source: store.source }));
		defaults().forEach((inte) => {
			store.map!.addInteraction(inte);
		});

		let drawType: Type;
		switch (store.currentInteraction) {
			case InteractionType.draw_polygon:
				drawType = 'Polygon';
				break;
			case InteractionType.draw_linestring:
				drawType = 'LineString';
				break;
			case InteractionType.draw_point:
				drawType = 'Point';
				break;
			default:
				drawType = 'Point';
				break;
		}
		switch (store.currentInteraction) {
			case InteractionType.draw_polygon:
			case InteractionType.draw_linestring:
			case InteractionType.draw_point:
				let draw = new Draw({
					source: store.source,
					type: drawType,
				});
				store.map.addInteraction(draw);
				draw.on('drawend', function (e) {
					let feature = e.feature;
					store.setAddFormFeature(feature);
				});
				break;
			case InteractionType.modify:
				let modify = new Modify({ source: store.source });
				modify.on('modifyend', function (_e) {
					//TODO modify
					//let feature = e.features.getArray()[0];
				});
				store.map.addInteraction(modify);
				break;
			case InteractionType.edit:
				let select = new Select({
					condition: click,
					style: selectStyle,
				});
				select.on('select', function (e) {
					if (e.target.getFeatures().length == 0) return;

					let feature: Feature = e.target.getFeatures().getArray()[0];
					let data = store.features.find(
						(feat) => feat.getID() == feature.getId()
					);
					if (data) {
						store.setEditFormFeature(data);
					}
				});
				store.map.addInteraction(select);
				break;
			case InteractionType.delete:
				let del = new Select({
					condition: click,
					style: selectStyle,
				});
				del.on('select', function (e) {
					if (e.target.getFeatures().length == 0) return;

					let feature: Feature = e.target.getFeatures().getArray()[0];
					let data = store.features.find(
						(feat) => feat.getID() == feature.getId()
					);
					if (data) {
						store.setDeleteFormFeature(data);
					}
				});
				store.map.addInteraction(del);
				break;
		}
	}, [store.currentInteraction]);

	useEffect(() => {
		if (
			!store.map ||
			store.formFeatures.deleteForm ||
			store.formFeatures.editForm
		)
			return;

		store.map.getInteractions().forEach((inte) => {
			if (inte instanceof Select) {
				inte.getFeatures().clear();
			}
		});
	}, [store.formFeatures.deleteForm, store.formFeatures.editForm]);

	useEffect(() => {
		let list: Type[] = [];
		if (!polygonState) list.push('Polygon');
		if (!lineStringState) list.push('LineString');
		if (!pointState) list.push('Point');
		refreshFeatures(list);
	}, [polygonState, lineStringState, pointState]);

	const handlePointerMove = (e: MapBrowserEvent<any>) => {
		if (!mapRef.current) return;
		let type = 'inherit';
		mapRef.current.getFeaturesAtPixel(e.pixel).forEach((feature) => {
			let x = store.features.find((data) => {
				return data.getID() == feature.getId();
			});
			if (x) {
				type = 'pointer';
				return;
			}
		});
		mapRef.current.getViewport().style.cursor = type;
	};

	return (
		<div
			className="map-container"
			style={{ position: 'relative', width: '100%', height: 400 }}
		>
			<div id="map" className="map"></div>
			{store.map ? (
				<UncontrolledPopover
					placement="left"
					target="layerlistdiv"
					trigger="legacy"
					style={{ width: '250px' }}
				>
					<PopoverHeader>Layers</PopoverHeader>
					<PopoverBody>
						<FormGroup switch inline>
							<Label check>Polygon</Label>
							<Input
								type="switch"
								checked={polygonState}
								onChange={() => {
									setPolygonState(!polygonState);
								}}
							/>
						</FormGroup>
						<FormGroup switch inline>
							<Label check>LineString</Label>
							<Input
								type="switch"
								checked={lineStringState}
								onChange={() => {
									setLineStringState(!lineStringState);
								}}
							/>
						</FormGroup>
						<FormGroup switch inline>
							<Label check>Point</Label>
							<Input
								type="switch"
								checked={pointState}
								onChange={() => {
									setPointState(!pointState);
								}}
							/>
						</FormGroup>
						<div style={{ paddingBottom: '20px' }} />
						<LayerList
							layer={store.map.getLayers().getArray()[2] as any}
							text={`Drawing Layer`}
						/>
						{store.layers.map((layerdata, i) => {
							return (
								<LayerList
									layer={layerdata.getLayer() as any}
									text={layerdata.getName()}
									key={i}
								/>
							);
						})}
					</PopoverBody>
				</UncontrolledPopover>
			) : null}
			;
		</div>
	);
}

export default observer(MapWrapper);
