import { WKT } from 'ol/format';

export interface ApiData {
	id: string;
	city: string;
	district: string;
	street: string;
	wkt: string;
	isDeleted: boolean;
}

export class FeatureData {
	private wkt: string;
	private city: string;
	private district: string;
	private street: string;
	private id: number | string | undefined;
	private deleted: boolean;

	public constructor(
		wkt: string,
		city: string,
		district: string,
		street: string,
		deleted: boolean
	) {
		this.wkt = wkt;
		this.id = crypto.randomUUID();
		this.city = city;
		this.district = district;
		this.street = street;
		this.deleted = deleted;
	}

	public getWKT() {
		return this.wkt;
	}

	public setWKT(wkt: string) {
		this.wkt = wkt;
	}

	public getID() {
		return this.id;
	}

	public setID(id: string) {
		this.id = id;
	}

	public getCity() {
		return this.city;
	}

	public setCity(city: string) {
		this.city = city;
	}

	public getDistrict() {
		return this.district;
	}

	public setDistrict(district: string) {
		this.district = district;
	}

	public getStreet() {
		return this.street;
	}

	public setStreet(street: string) {
		this.street = street;
	}

	public getFeature() {
		let feature = new WKT().readFeature(this.wkt);
		feature.setId(this.id);
		return feature;
	}

	public isDeleted() {
		return this.deleted;
	}

	public convertToApiData() {
		let apidata: ApiData = {
			id: `${this.getID()}`,
			city: this.getCity(),
			district: this.getDistrict(),
			street: this.getStreet(),
			wkt: this.getWKT(),
			isDeleted: this.isDeleted(),
		};
		return apidata;
	}
}
