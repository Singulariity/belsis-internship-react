import { makeAutoObservable } from 'mobx';
import { Feature, Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { FeatureData } from './Classes/FeatureData';
import { LayerData } from './Classes/LayerData';

interface formInterface {
	addForm: Feature | undefined;
	deleteForm: FeatureData | undefined;
	editForm: FeatureData | undefined;
}

export enum InteractionType {
	draw_polygon,
	draw_linestring,
	draw_point,
	modify,
	edit,
	delete,
}

class MainStore {
	constructor() {
		makeAutoObservable(this);
	}

	isLoadingOverlay = false;
	featureList = false;
	cityValue = '';
	districtValue = '';
	streetValue = '';
	map: Map | undefined;
	currentInteraction: InteractionType | undefined;

	source = new VectorSource();
	setSource(source: VectorSource) {
		this.source = source;
	}

	formFeatures: formInterface = {
		addForm: undefined,
		deleteForm: undefined,
		editForm: undefined,
	};
	setAddFormFeature(feature: Feature | undefined) {
		this.formFeatures.addForm = feature;
	}
	setDeleteFormFeature(featureData: FeatureData | undefined) {
		this.formFeatures.deleteForm = featureData;
	}
	setEditFormFeature(featureData: FeatureData | undefined) {
		this.formFeatures.editForm = featureData;
	}

	features: FeatureData[] = [];
	addFeature(featureData: FeatureData) {
		this.features = [...this.features, featureData];
	}
	removeFeature(featureData: FeatureData) {
		this.features = this.features.filter((data) => data !== featureData);
	}

	layers: LayerData[] = [];
}

const store = new MainStore();
export default store;
