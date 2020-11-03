import React, {useEffect, useState, useCallback} from 'react'
import {useSelector, useDispatch, connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {login} from '../../../store/redux/authRedux'
import {showNotification} from "../../../store/redux/notificationRedux";
import {Type} from "../../../constants/Notifications";
import {object, string} from 'yup'

const validator = object().shape({
  email: string()
    .required({message: 'Please enter email'})
    .email({message: 'Please enter a valid email'}),
  password: string()
    .required({message: 'Please enter password'})

});

const tag = 'Login';
const Login = (props) => {
  // const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');


  const onChangeEmail = (event) => {
    setEmail(event.target.value)
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value)
  };

  const handleSubscribe = async () => {
    try {
      const params = await validator.validate({email: email, password: password}, {abortEarly: false});


      // console.log(tag, 'email', email);
      // console.log(tag, 'password', password);
      props.login(email, password)

    } catch (e) {
      let message = `${e.name}: `;
      if (e.errors) {
        /*for (let error of e.errors) {
          message += `${error.message}\n`
        }*/
        message += `${e.errors[0].message}`
      }
      props.toast(Type.ERROR, message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubscribe();
    }
  };

  console.log(tag, 'auth', props.auth);

  if (props.auth.isAuthenticated !== true) {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="6" sd="6">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>BADEN Admin</h1>
                      <p className="text-muted">Sign in as Admin</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user"/>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="Email" autoComplete="email" value={email}
                                onChange={onChangeEmail} onKeyPress={handleKeyPress}/>
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked"/>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" placeholder="Password" autoComplete="current-password" value={password}
                                onChange={onChangePassword} onKeyPress={handleKeyPress}/>
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary" className="px-4" onClick={handleSubscribe}>Login</CButton>
                        </CCol>
                        <CCol xs="6" className="text-right">
                          <CButton color="link" className="px-0">Forgot password?</CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  } else {
    return (<Redirect to={"/"}/>)
  }
};

export default connect(
  (state) => ({
    isLoggingIn: state.auth.isLoggingIn || false,
    auth: state.auth,
  }),
  (dispatch) => ({
    login: (email, password) => dispatch(login(email, password)),
    toast: (type, message) => dispatch(showNotification(type, message))
  })
)(Login)
