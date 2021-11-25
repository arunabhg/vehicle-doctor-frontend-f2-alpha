import React from 'react';
import { Container, Grid, TextField, Typography, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { NEXT, DEALER_SIGNUP_FORM_HEADER } from '../../Constants/common.constant';
import { IDealerCredentials, IDealerCredForm } from '../../Interfaces/DealerCredInterface';

const FormDealerCredentials: React.FC<IDealerCredentials> = ({
	nextStep,
	handleFormData,
	values
}) => {
	//Regex for Mobile No field
	const phoneRegExp = /^[1-9][0-9]{9}$/;

	// Function to continue to next step of the form
	const Continue = (e: any) => {
		e.preventDefault();
		nextStep();
	};

	// Yup Validation schema for fields
	const validationSchema: Yup.SchemaOf<IDealerCredForm> = Yup.object().shape({
		name: Yup.string().required('Please enter the Name'),
		mobile: Yup.string()
			.matches(phoneRegExp, 'Mobile Number is invalid')
			.typeError('Mobile must be a 10-Digit number')
			.required('Please enter 10-Digit Mobile Number')
			.min(10, 'Mobile Number should have 10 digits')
			.max(12, 'Mobile Number should have 10 digits'),
		email_ID: Yup.string().required('Please enter the Email').email('Email is invalid'),
		password: Yup.string()
			.required('Password is required')
			.min(6, 'Password must be at least 6 characters')
			.max(20, 'Password must not exceed 20 characters'),
		confirmPassword: Yup.string()
			.required('Confirm Password is required')
			.oneOf([Yup.ref('password'), null], 'Confirm Password does not match')
	});

	//Resolve useForm hook with the validation schema declared above
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm<IDealerCredForm>({
		mode: 'all',
		resolver: yupResolver(validationSchema)
	});

	return (
		<div>
			<Container sx={{ p: 1 }}>
				<form noValidate autoComplete='off'>
					<Grid direction={'column'} container spacing={2} rowSpacing={1}>
						<Grid item>
							<Typography variant='h5'>{DEALER_SIGNUP_FORM_HEADER}</Typography>
						</Grid>
						<Grid item>
							<TextField
								id='name'
								label='Name'
								{...register('name')}
								name='name'
								placeholder='Enter Name'
								variant='outlined'
								defaultValue={values.name}
								onChange={handleFormData('name')}
								fullWidth
								required
								error={errors.name ? true : false}
								helperText={errors.name ? errors.name.message : ' '}
							/>
						</Grid>
						<Grid item>
							<TextField
								id='mobile'
								label='Mobile'
								type='number'
								{...register('mobile')}
								name='mobile'
								placeholder='Enter 10-digit Mobile Number'
								variant='outlined'
								defaultValue={values.mobile}
								inputProps={{ maxLength: 10 }}
								onChange={handleFormData('mobile')}
								fullWidth
								required
								error={errors.mobile ? true : false}
								helperText={errors.mobile ? errors.mobile.message : ' '}
							/>
						</Grid>
						<Grid item>
							<TextField
								id='email_ID'
								type='email'
								label='Email ID'
								{...register('email_ID')}
								name='email_ID'
								placeholder='Enter Email ID'
								variant='outlined'
								defaultValue={values.email_ID}
								onChange={handleFormData('email_ID')}
								fullWidth
								required
								error={errors.email_ID ? true : false}
								helperText={errors.email_ID ? errors.email_ID.message : ' '}
							/>
						</Grid>
						<Grid item>
							<TextField
								id='password'
								type='password'
								label='Password'
								{...register('password')}
								name='password'
								placeholder='Password'
								variant='outlined'
								defaultValue={values.password}
								onChange={handleFormData('password')}
								fullWidth
								required
								error={errors.password ? true : false}
								helperText={errors.password ? errors.password.message : ' '}
							/>
						</Grid>
						<Grid item>
							<TextField
								id='confirmPassword'
								type='password'
								label='Confirm Password'
								{...register('confirmPassword')}
								name='confirmPassword'
								placeholder='Confirm Password'
								variant='outlined'
								defaultValue={values.confirmPassword}
								onChange={handleFormData('confirmPassword')}
								fullWidth
								required
								error={errors.confirmPassword ? true : false}
								helperText={errors.confirmPassword ? errors.confirmPassword.message : ' '}
							/>
						</Grid>

						<Grid item>
							<Button variant='contained' fullWidth onClick={Continue} disabled={!isValid}>
								{NEXT}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>
	);
};

export default FormDealerCredentials;
