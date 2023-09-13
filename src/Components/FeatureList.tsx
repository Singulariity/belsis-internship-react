import {
	ButtonDropdown,
	ButtonGroup,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
	InputGroup,
	Modal,
	ModalBody,
	ModalHeader,
	Table,
} from 'reactstrap';
import { useEffect, useState } from 'react';
import store from '../Store';
import { observer } from 'mobx-react';
import ActionButton from './ActionButton';

enum searchMode {
	city = 'City',
	district = 'District',
	street = 'Street',
}

function FeatureList() {
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState<searchMode>(searchMode.city);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownToggle = () => setDropdownOpen((prev) => !prev);

	const toggle = () => (store.featureList = !store.featureList);

	useEffect(() => {}, [store.formFeatures.editForm]);

	return (
		<Modal
			style={{ opacity: '0.9' }}
			isOpen={store.featureList}
			size="lg"
			toggle={toggle}
			centered
		>
			<ModalHeader toggle={toggle}>Parcels</ModalHeader>
			<ModalBody>
				<InputGroup>
					<Input
						id="searchBox"
						placeholder="Search"
						value={searchText}
						onChange={(e) => {
							setSearchText(e.target.value);
						}}
					/>
					<ButtonDropdown
						isOpen={dropdownOpen}
						toggle={dropdownToggle}
					>
						<DropdownToggle caret>{searchType}</DropdownToggle>
						<DropdownMenu>
							<DropdownItem
								onClick={() => setSearchType(searchMode.city)}
							>
								{searchMode.city}
							</DropdownItem>
							<DropdownItem
								onClick={() =>
									setSearchType(searchMode.district)
								}
							>
								{searchMode.district}
							</DropdownItem>
							<DropdownItem
								onClick={() => setSearchType(searchMode.street)}
							>
								{searchMode.street}
							</DropdownItem>
							<DropdownItem disabled>ID</DropdownItem>
						</DropdownMenu>
					</ButtonDropdown>
				</InputGroup>
				<Table responsive>
					<thead>
						<tr>
							<th style={{ width: '20%' }}>City</th>
							<th style={{ width: '20%' }}>District</th>
							<th style={{ width: '20%' }}>Street</th>
							<th style={{ width: '40%' }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{store.features
							.filter((data) => {
								let from;
								switch (searchType) {
									case searchMode.city:
										from = data.getCity();
										break;
									case searchMode.district:
										from = data.getDistrict();
										break;
									case searchMode.street:
										from = data.getStreet();
										break;
								}

								return (
									searchText == '' ||
									from.includes(searchText)
								);
							})
							.map((data, i) => {
								return (
									<tr key={i}>
										<td>{data.getCity()}</td>
										<td>{data.getDistrict()}</td>
										<td>{data.getStreet()}</td>
										<td>
											<ButtonGroup>
												<ActionButton
													type="go"
													data={data}
												/>
												<ActionButton
													type="edit"
													data={data}
												/>
												<ActionButton
													type="delete"
													data={data}
												/>
											</ButtonGroup>
										</td>
									</tr>
								);
							})}
					</tbody>
				</Table>
			</ModalBody>
		</Modal>
	);
}

export default observer(FeatureList);
