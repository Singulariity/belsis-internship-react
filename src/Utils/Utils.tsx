import store from '../Store';
import { ApiData, FeatureData } from '../Classes/FeatureData';
import { Type } from 'ol/geom/Geometry';

const backend_url = 'http://localhost:5101/api/FeatureDatas/';

async function deleteParcel(data: FeatureData) {
	store.isLoadingOverlay = true;
	try {
		let query = `?id=${data.getID()}`;
		let response = await fetch(backend_url + 'delete' + query, {
			method: 'POST',
			headers: new Headers({
				Accept: '*/*',
			}),
		});

		refreshFeatures();
		store.isLoadingOverlay = false;
		return response;
	} catch (error) {
		store.isLoadingOverlay = false;
		throw new Error('An error occurred while deleting parcel!');
	}
}

async function addParcel(data: FeatureData) {
	store.isLoadingOverlay = true;
	try {
		let response = await fetch(backend_url + 'add', {
			method: 'POST',
			headers: new Headers({
				'Content-type': 'application/json; charset=UTF-8',
			}),
			body: JSON.stringify(data.convertToApiData()),
		});

		refreshFeatures();
		store.isLoadingOverlay = false;
		return response;
	} catch (error) {
		store.isLoadingOverlay = false;
		throw new Error('An error occurred while adding parcel!');
	}
}

async function editParcel(data: FeatureData) {
	store.isLoadingOverlay = true;
	try {
		let query = `?id=${data.getID()}`;
		let response = await fetch(backend_url + 'update' + query, {
			method: 'PUT',
			headers: new Headers({
				'Content-type': 'application/json; charset=UTF-8',
			}),
			body: JSON.stringify(data.convertToApiData()),
		});

		refreshFeatures();
		store.isLoadingOverlay = false;
		return response;
	} catch (error) {
		store.isLoadingOverlay = false;
		throw new Error('An error occurred while updating parcel!');
	}
}

async function getParcels() {
	store.isLoadingOverlay = true;
	try {
		let response = await fetch(backend_url + 'getall');

		let list: FeatureData[] = [];
		let data: ApiData[] = await response.json();
		data.forEach((apidata) => {
			if (apidata.isDeleted) return;

			let featureData = new FeatureData(
				apidata.wkt,
				apidata.city,
				apidata.district,
				apidata.street,
				false
			);
			featureData.setID(apidata.id);
			list.push(featureData);
		});
		store.isLoadingOverlay = false;
		return list;
	} catch (error) {
		throw new Error('Database connection error!');
	}
}

async function refreshFeatures(exceptionTypes?: Type[]) {
	try {
		store.features = [];
		let arr = await getParcels();
		arr.forEach((data) => {
			if (exceptionTypes && data) {
				let type = data.getFeature().getGeometry()?.getType();
				if (exceptionTypes.includes(type as Type)) return;
			}
			store.addFeature(data);
		});
	} catch (error) {
		throw new Error('An error occurred while refreshing features!');
	}
}

export { deleteParcel, addParcel, editParcel, getParcels, refreshFeatures };
