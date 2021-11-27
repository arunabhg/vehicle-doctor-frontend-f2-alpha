import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import InputAdornment from '@mui/material/InputAdornment';
import CallIcon from '@mui/icons-material/Call';
import TextField from '@mui/material/TextField';
import firebase from '../../firebase';
import { Event } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { ILoginInterface } from '../../Interfaces/ILoginInterface';
import { SUBMIT, VALIDATE } from '../../Constants/common.constant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import Room from '@mui/icons-material/Room';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

type Props = {
    open: boolean;
    handleClose: (val: boolean) => void;
}
declare global {
    interface Window {
        recaptchaVerifier: any;
        confirmationResult: any;
    }
}

const LoginModal: React.FC<Props> = ({ open, handleClose }) => {
    const [state, setState] = useState<ILoginInterface>({ mobile: '', otp: '' });
    const [result, setConfirmationResult] = useState<any>();
    const [showInfo, setShowInfo] = useState<boolean>(false);
    window.recaptchaVerifier = window.recaptchaVerifier || {};
    const phoneRegExp = /^[1-9][0-9]{9}$/;

    const validationSchema: Yup.SchemaOf<ILoginInterface> = Yup.object().shape({
        mobile: Yup.string()
            .matches(phoneRegExp, 'Mobile Number is invalid')
            .typeError('Mobile must be a 10-Digit number')
            .required('Please enter 10-Digit Mobile Number')
            .min(10, 'Mobile Number should have 10 digits'),
        otp: Yup.string()
    });

    const handleChange = (input: string) => (e: any) => {
        const { value } = e.target;
        setState(prevState => ({
            ...prevState,
            [input]: value,
        }))
    }

    const { register, control, handleSubmit, formState: { errors, isValid } } = useForm<ILoginInterface>({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const configureCaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response: any) => {
                onSignInSubmit(Event);
            },
            defaultCountry: "IN"
        });
    }

    const onSignInSubmit = (e: any) => {
        console.log(state.mobile);
        e.preventDefault();
        configureCaptcha()
        const phoneNumber = "+91" + state.mobile
        console.log(phoneNumber)
        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                setConfirmationResult(window.confirmationResult)
                console.log(result);
                console.log("OTP has been sent")
                // ...
            }).catch((error) => {
                console.log(error);
                console.log("SMS not sent")
            });
    }

    const onSubmitOTP = (e: any) => {
        e.preventDefault()
        const code = state.otp
        console.log(code)
        window.confirmationResult.confirm(code).then((result: any) => {
            // User signed in successfully.
            const user = result.user;
            console.log(JSON.stringify(user))
            handleClose(true);
        }).catch((error: any) => {
            console.log(error);
        });
        setShowInfo(true);
    }

    return (
        <>
            <Modal
                size='sm'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                show={open}
                onHide={handleClose}
                backdrop='static'
                keyboard={false}>
                <Modal.Header className='modalHeader' closeButton>
                    Login
                </Modal.Header>

                <Modal.Body>
                    {window.confirmationResult == null ?
                        <div className='divModal'>
                            <div id="sign-in-button"></div>

                            <TextField
                                id='input-with-icon-textfield'
                                label='Mobile'
                                type="number"
                                {...register('mobile')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <CallIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                                onChange={handleChange('mobile')}
                                required
                                error={errors.mobile ? true : false}
                                helperText={errors.mobile ? errors.mobile.message : ' '}
                            />
                        </div>
                        :
                        <div className='divModal'>
                            <TextField
                                id='input-with-icon-textfield'
                                label='OTP'
                                type="number"
                                {...register('otp')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                                onChange={handleChange('otp')}
                            />
                        </div>}
                </Modal.Body>

                <Modal.Footer>
                    {window.confirmationResult == null ?
                        <Button size='sm' variant='primary' type="submit" onClick={onSignInSubmit} disabled={!isValid}>
                            {SUBMIT}
                        </Button> :
                        <Button size='sm' variant='primary' type="submit" onClick={onSubmitOTP}>
                            {VALIDATE}
                        </Button>}
                </Modal.Footer>
            </Modal>
            <Modal size='sm' aria-labelledby='contained-modal-title-vcenter' centered show={showInfo} onHide={() => setShowInfo(!showInfo)} backdrop='static' keyboard={false}>
                <Modal.Header className='modalHeader' closeButton>
                    Profile Information{' '}
                </Modal.Header>
                <Modal.Body>
                    <div className='divModal'>
                        <div className='modalBody'>
                            <TextField
                                id='input-with-icon-textfield'
                                label='Name'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                            />
                        </div>
                        <div className='modalBody'>
                            <TextField
                                id='input-with-icon-textfield'
                                label='E-Mail'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <EmailIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                            />
                        </div>
                        <div className='modalBody'>
                            <TextField
                                id='input-with-icon-textfield'
                                label='Locality/Street'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <MapsHomeWorkIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                            />
                        </div>
                        <div className='modalBody'>
                            <TextField
                                id='input-with-icon-textfield'
                                label='City'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <LocationCityIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                            />
                        </div>
                        <div className='modalBody'>
                            <TextField
                                id='input-with-icon-textfield'
                                label='State'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Room />
                                        </InputAdornment>
                                    )
                                }}
                                variant='standard'
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button size='sm' variant='primary' onClick={() => setShowInfo(!showInfo)}>
                        REGISTER
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LoginModal;