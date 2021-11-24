import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useVehicleData from '../Hooks/VehicleDataHook';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { Service } from '../Interfaces/ServiceInterfaces';
import useGeoLocation from '../Hooks/GeolocationHook';

function SOS() {
	const [serviceData, setServiceData] = useState<Service[]>([]);
	const location = useGeoLocation();

	function updateServices(event: any, newValue: any) {
		setServiceData([]);
		if (newValue != null) {
			axios.get<Service[]>('http://localhost:3001/service/types/SOS')
				.then((response: AxiosResponse) => {
					setServiceData(response.data);
				})
		}
	}

	const vehicleData = useVehicleData();
	return (
		<div>
			<div>
				<Autocomplete
					disablePortal
					onChange={updateServices}
					style={{ backgroundColor: 'white' }}
					options={vehicleData}
					getOptionLabel={(option) => option.vehicle_type}
					autoHighlight
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} label='Vehicle Type' />}
				/>
			</div>
			<div>
				<Autocomplete
					disablePortal
					style={{ backgroundColor: 'white' }}
					options={serviceData}
					getOptionLabel={(option) => option.service_name}
					autoHighlight
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} label='Dealer Name' />}
				/>
			</div>
			<div>
					<TextField
						disabled
						id="outlined-disabled"
						label={location?.loaded ? location?.data[0]?.formatted_address:null}
						margin="normal"
					/>
			</div>
		</div>
	);
}

export default SOS;