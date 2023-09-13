import { useEffect, useState } from 'react';
import {
	Button,
	Form,
	FormFeedback,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from 'reactstrap';
import store from '../Store';
import { observer } from 'mobx-react';
import { editParcel } from '../Utils/Utils';

function ParselEditModal() {
	const [cityInvalid, setCityInvalid] = useState<boolean | undefined>();
	const [districtInvalid, setDistrictInvalid] = useState<
		boolean | undefined
	>();
	const [streetInvalid, setStreetInvalid] = useState<boolean | undefined>();

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		let cancel;
		if (store.cityValue.length === 0) {
			cancel = true;
			setCityInvalid(true);
		} else {
			setCityInvalid(false);
		}
		if (store.districtValue.length === 0) {
			cancel = true;
			setDistrictInvalid(true);
		} else {
			setDistrictInvalid(false);
		}
		if (store.streetValue.length === 0) {
			cancel = true;
			setStreetInvalid(true);
		} else {
			setStreetInvalid(false);
		}
		if (cancel) return;

		let data = store.features.find(
			(feat) => feat.getID() == store.formFeatures.editForm!.getID()
		);
		if (!data) return;
		data.setCity(store.cityValue);
		data.setDistrict(store.districtValue);
		data.setStreet(store.streetValue);

		editParcel(data).then(() => {
			store.setEditFormFeature(undefined);
		});
	};

	const cancelHandler = (_e: React.MouseEvent) => {
		store.setEditFormFeature(undefined);
	};

	useEffect(() => {
		clearForm();
		if (store.formFeatures.editForm) {
			store.cityValue = store.formFeatures.editForm.getCity();
			store.districtValue = store.formFeatures.editForm.getDistrict();
			store.streetValue = store.formFeatures.editForm.getStreet();
		}
	}, [store.formFeatures.editForm]);

	function clearForm() {
		store.cityValue = '';
		store.districtValue = '';
		store.streetValue = '';
		setCityInvalid(undefined);
		setDistrictInvalid(undefined);
		setStreetInvalid(undefined);
	}

	return (
		<Modal
			id="parselEditModal"
			backdrop="static"
			keyboard={false}
			aria-hidden="true"
			isOpen={store.formFeatures.editForm && true}
		>
			<Form id="parcelEditForm" onSubmit={submitHandler}>
				<ModalHeader>Edit Parcel</ModalHeader>
				<ModalBody>
					<FormGroup floating>
						<Input
							invalid={cityInvalid}
							id="city"
							placeholder="City"
							value={store.cityValue}
							onChange={(e) => {
								store.cityValue = e.target.value;
							}}
						/>
						<Label for="city">City</Label>
						<FormFeedback valid={false}>
							City cannot be empty
						</FormFeedback>
					</FormGroup>

					<FormGroup floating>
						<Input
							invalid={districtInvalid}
							id="district"
							placeholder="district"
							value={store.districtValue}
							onChange={(e) => {
								store.districtValue = e.target.value;
							}}
						/>
						<Label for="district">District</Label>
						<FormFeedback valid={false}>
							District cannot be empty
						</FormFeedback>
					</FormGroup>

					<FormGroup floating>
						<Input
							invalid={streetInvalid}
							id="street"
							placeholder="street"
							value={store.streetValue}
							onChange={(e) => {
								store.streetValue = e.target.value;
							}}
						/>
						<Label for="street">Street</Label>
						<FormFeedback valid={false}>
							Street cannot be empty
						</FormFeedback>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button color="success">Update Parcel</Button>
					<Button
						type="button"
						color="danger"
						onClick={cancelHandler}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}

export default observer(ParselEditModal);
