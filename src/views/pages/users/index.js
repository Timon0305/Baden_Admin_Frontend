import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupAppend,
  CInputGroupText,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormGroup,
  CLabel,
  CFormText,
  CTextarea,
  CSelect,
  CInputRadio,
  CInputCheckbox,
  CInputFile,
  CCardFooter,
  CImg,
  CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ApiRedux from '../../../store/redux/apiRedux';
import RestApi from '../../../store/service/RestApi';
import Config from '../../../config/';
import * as datetime from 'node-datetime';
import * as Constants from '../../../constants/user';
import Avatar from 'react-avatar-upload';
import {object, string} from "yup";
import {showNotification} from "../../../store/redux/notificationRedux";
import {Type} from "../../../constants/Notifications";
// import Avatar from 'react-avatar-edit';

const fields = ['', 'name', 'email', 'bloodType', 'status', 'actions']

const getBadge = status => {
  switch (status.toString().toLowerCase()) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'secondary'
    case 'pending':
      return 'warning'
    case 'deleted':
      return 'danger'
    default:
      return 'primary'
  }
}


const validator = object().shape({
  email: string()
    .required({message: 'Please enter email'})
    .email({message: 'Please enter a valid email'}),
  fullName: string()
    .required({message: 'Please enter name'}),
  // password: string()
  //   .required({message: 'Please enter password'}),
});

const idValidator = object().shape({
  id: string().required({message: 'Id is required'}),
});

const Loading = () => {
  return (
    <div className="d-flex justify-content-center"
         style={{height: '100vh', flexDirection: 'row', alignItems: 'center'}}>
      <div className="spinner-border text-primary" role="status" style={{width: 100, height: 100}}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
};

const Users = (props) => {
  const tag = 'Page::Users';
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleView, setVisibleView] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const fetchUsers = async () => {
    try {
      let {ok, data} = await props.callApi(RestApi.getUsers);
      if (ok) {
        console.log(tag, 'fetch', data.users);
        for (let item of data.users) {
          item.avatarUrl = Config.BASE_URL + item.avatarUrl;
        }
        setUsers(data.users);
        setSelectedUser(data.users[0]);
      }
    } catch (e) {
      console.log(tag, 'FETCH_USER_ERROR', e.message)
    }
  };

  const toggleView = (val) => {
    setVisibleView(val);
  };

  const toggleEdit = (val) => {
    setVisibleEdit(val)
  };

  const onClickView = (user) => {
    setSelectedUser(user);
    toggleView(true);
  };

  const onClickEdit = (user) => {
    setCreateMode(false);
    setSelectedUser(user);
    toggleEdit(true);
  };

  const onClickDelete = async (id) => {
    try {
      let response;
      console.log(tag, 'ClickDelete');

      await idValidator.validate({id});
      response = await props.callApi(RestApi.deleteUser, id);

      let {ok, data} = response;
      if (ok) {
        await fetchUsers();
      }
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

  const handleEdit = (key, value) => {
    let temp = Object.assign({}, selectedUser);
    temp[key] = value;
    setSelectedUser(temp);
  };

  const handleUpdate = async (id) => {
    try {
      let response;
      await validator.validate({email: selectedUser.email, fullName: selectedUser.fullName});
      if (createMode) {
        response = await props.callApi(RestApi.createUser, selectedUser);
      } else {
        await idValidator.validate({id});
        response = await props.callApi(RestApi.updateUser, id, selectedUser);
      }

      let {ok, data} = response;
      if (ok) {
        await fetchUsers();
      }
      toggleEdit(false);
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

  const handleAdd = () => {
    setCreateMode(true);
    setSelectedUser(Constants.EMPTY_USER);
    toggleEdit(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          {props.isLoading === false ?
            <CCard>
              <CCardHeader>
                Users
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={users}
                  fields={fields}
                  itemsPerPage={10}
                  pagination
                  scopedSlots={{
                    '':
                      (item) => (
                        <td className="text-center">
                          <div className="c-avatar">
                            <img src={item.avatarUrl} className="c-avatar-img" alt="avatar"/>
                          </div>
                        </td>
                      ),
                    'name':
                      (item) => (
                        <td>
                          <div className="">
                            {item.fullName}
                          </div>
                        </td>
                      ),
                    'bloodType':
                      (item) => (
                        <td>
                          <CBadge color={"light"}>
                            {item.bloodType}
                          </CBadge>
                        </td>
                      ),
                    'status':
                      (item) => (
                        <td>
                          <CBadge color={getBadge(item.status)}>
                            {item.status}
                          </CBadge>
                        </td>
                      ),
                    'actions':
                      (item) => (
                        <td>
                          <CButton active variant="ghost" color="info" aria-pressed="true" size="sm"
                                   className={"btn-pill"} onClick={() => onClickView(item)}>View</CButton>&nbsp;
                          <CButton active variant="ghost" color="success" aria-pressed="true" size="sm"
                                   className={"btn-pill"} onClick={() => onClickEdit(item)}>Edit</CButton>&nbsp;
                          <CButton active variant="ghost" color="danger" aria-pressed="true" size="sm"
                                   className={"btn-pill"}
                                   onClick={() => onClickDelete(item.id.toString())}>Delete</CButton>
                        </td>
                      )

                  }}
                />
              </CCardBody>
              <CCardFooter>
                <CButton color="secondary" onClick={handleAdd}>Add User</CButton>
              </CCardFooter>
            </CCard>
            :
            <Loading/>}
        </CCol>
      </CRow>
      {selectedUser &&
      <>
        <CModal
          show={visibleView}
          onClose={() => toggleView(false)}
          size="lg"
          color={"info"}
        >
          <CModalHeader closeButton>
            <CModalTitle>{selectedUser.fullName}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12" md="12">
                <CCard>
                  <CCardBody>
                    <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                      <CFormGroup row>
                        <CCol xs="12" md="12">
                          <div style={{width: 100, height: 100, margin: 'auto'}}>
                            <CImg
                              src={selectedUser.avatarUrl}
                              className="c-avatar-img"
                              alt={selectedUser.email}
                            />
                          </div>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="text-input">Gender</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p className="form-control-static">{selectedUser.gender.toString().toUpperCase()}</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="email-input">Blood type</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p className="form-control-static">{selectedUser.bloodType}</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="password-input">Language</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p className="form-control-static">{selectedUser.language.toString().toUpperCase()}</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="password-input">Email</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p className="form-control-static">{selectedUser.email}</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="password-input">PhoneNumber</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p
                            className="form-control-static">{selectedUser.phoneNumber.length > 0 ? selectedUser.phoneNumber : '-'}</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="password-input">Joined since</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p className="form-control-static">{datetime.create(selectedUser.createdAt).format('f Y')}</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="password-input">Status</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <h4>
                            <CBadge color={getBadge(selectedUser.status)}>
                              {selectedUser.status}
                            </CBadge>
                          </h4>
                        </CCol>
                      </CFormGroup>

                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={() => toggleView(false)}>Close</CButton>
          </CModalFooter>
        </CModal>
        <CModal
          show={visibleEdit}
          onClose={() => toggleEdit(false)}
          size="lg"
          color={createMode ? "primary" : "success"}
        >
          <CModalHeader closeButton>
            <CModalTitle>
              {createMode ? "Add User" : "Edit User"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12" md="12">
                <CCard>
                  <CCardBody>
                    <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                      <CFormGroup row>
                        <CCol md={"12"}>
                          <div style={{width: 100, height: 100, margin: 'auto'}}>
                            <div style={{zIndex: 20, opacity: 0.0, position: 'absolute', bottom: -20}}>
                              <Avatar
                                style={{opacity: 0.1}}
                                getImg={(img) => {
                                  let temp = Object.assign({}, selectedUser);
                                  temp.avatarUrl = img;
                                  setSelectedUser(temp);
                                  // console.log(tag, 'image', img);
                                }}/>
                            </div>
                            <CImg
                              src={selectedUser.avatarUrl}
                              className="c-avatar-img"
                              alt={selectedUser.fullName}
                            />
                          </div>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="name-input">Full Name</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CInput id="name-input" name="name-input" placeholder="Type a full name"
                                  value={selectedUser.fullName}
                                  onChange={(e) => handleEdit('fullName', e.target.value)}
                          />
                          {/*<CFormText>This is a help text</CFormText>*/}
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="email-input">Email Address</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CInput type="email" id="email-input" name="email-input" placeholder="Type an email"
                                  autoComplete="email"
                                  value={selectedUser.email}
                                  onChange={(e) => handleEdit('email', e.target.value)}
                          />
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="phone-input">Phone Number</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CInput type="text" id="phone-input" name="phone-input" placeholder="Type a phone number"
                                  autoComplete="phone"
                                  value={selectedUser.phoneNumber}
                                  onChange={(e) => handleEdit('phoneNumber', e.target.value)}
                          />
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="language">Language</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CSelect custom name="language" id="language"
                                   value={selectedUser.language}
                                   onChange={(e) => handleEdit('language', e.target.value)}
                          >
                            <option value="-1">Please select a language</option>
                            {
                              Constants.LANG.map((item, index) => {
                                return (
                                  <option value={item} key={index}>{item.toString().toUpperCase()}</option>
                                )
                              })
                            }
                          </CSelect>
                        </CCol>
                      </CFormGroup>

                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="bloodType">Blood Type</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CSelect custom name="bloodType" id="bloodType"
                                   value={selectedUser.bloodType}
                                   onChange={e => handleEdit('bloodType', e.target.value)}
                          >
                            <option value="-1">Please select a blood type</option>
                            {
                              Constants.BLOOD_TYPE.map((item, index) => {
                                return (
                                  <option value={item} key={index}>{item.toString().toUpperCase()}</option>
                                )
                              })
                            }
                          </CSelect>
                        </CCol>
                      </CFormGroup>

                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="gender">Gender</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CSelect custom name="gender" id="gender"
                                   value={selectedUser.gender}
                                   onChange={e => handleEdit('gender', e.target.value)}
                          >
                            <option value="-1">Please select a gender</option>
                            {
                              Constants.GENDER.map((item, index) => {
                                return (
                                  <option value={item} key={index}>{item.toString().toUpperCase()}</option>
                                )
                              })
                            }
                          </CSelect>
                        </CCol>
                      </CFormGroup>

                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="status">Status</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CSelect custom name="status" id="status"
                                   value={selectedUser.status}
                                   onChange={e => handleEdit('status', e.target.value)}
                          >
                            <option value="-1">Please select a status</option>
                            {
                              Constants.STATUS.map((item, index) => {
                                return (
                                  <option value={item} key={index}>{item.toString().toUpperCase()}</option>
                                )
                              })
                            }
                          </CSelect>
                        </CCol>
                      </CFormGroup>

                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => toggleEdit(false)}>Cancel</CButton>{' '}
            <CButton color={createMode ? "primary" : "success"} onClick={() => handleUpdate(selectedUser.id)}>
              {createMode ? "Add" : "Update"}
            </CButton>
          </CModalFooter>
        </CModal>
      </>}

    </>
  )
};

export default connect(
  (state) => ({
    isLoading: state.loadingIndicator.counter === 1,
  }),
  (dispatch) => ({
    callApi: (method, ...args) => new Promise((resolve, reject) => {
      dispatch(ApiRedux.callApi(method, resolve, ...args))
    }),
    callApi2: (method, callback, ...args) => dispatch(ApiRedux.callApi(method, callback, ...args)),
    toast: (type, message) => dispatch(showNotification(type, message))
  })
)(Users)
