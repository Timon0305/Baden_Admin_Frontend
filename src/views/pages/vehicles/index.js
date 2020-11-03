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

const fields = ['avatar', 'name', 'actions'];

const getBadge = status => {
  switch (status.toString().toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'secondary';
    case 'pending':
      return 'warning';
    case 'deleted':
      return 'danger';
    default:
      return 'primary'
  }
};


const validator = object().shape({
  fullName: string()
    .required({message: 'Please enter name'}),
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

const Vehicles = (props) => {
  const tag = 'Page::Vehicle';
  const [vehicles, setVehicles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleView, setVisibleView] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const fetchVehicle = async () => {
    try {
      let {ok, data} = await props.callApi(RestApi.getVehicle);
      if (ok) {
        console.log(tag, 'fetch', data.vehicles);
        for (let item of data.vehicles) {
          item.carUrl = Config.BASE_URL + item.carUrl;
        }
        setVehicles(data.vehicles);
        setSelectedUser(data.vehicles[0]);
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
      response = await props.callApi(RestApi.deleteVehicle, id);

      let {ok, data} = response;
      if (ok) {
        await fetchVehicle();
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
      console.log('-<<<<<<<<', id)
      await validator.validate({fullName: selectedUser.fullName});
      if (createMode) {
        response = await props.callApi(RestApi.createVehicle, selectedUser);
      } else {
        await idValidator.validate({id});
        response = await props.callApi(RestApi.updateVehicle, id, selectedUser);
      }

      let {ok, data} = response;
      if (ok) {
        await fetchVehicle();
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
    setSelectedUser(Constants.EMPTY_VEHICLE);
    toggleEdit(true);
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          {props.isLoading === false ?
            <CCard>
              <CCardHeader>
                Vehicle Lists
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={vehicles}
                  fields={fields}
                  itemsPerPage={10}
                  pagination
                  scopedSlots={{
                    'avatar':
                      (item) => (
                        <td className="text-left">
                          <div className="c-avatar">
                            <img src={item.carUrl} className="c-avatar-img" alt="avatar"/>
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
                    'actions':
                      (item) => (
                        <td>
                          <CButton active variant="ghost" color="info" aria-pressed="true" size="sm"
                                   className={"btn-pill"} onClick={() => onClickView(item)}>View</CButton>&nbsp;
                          <CButton active variant="ghost" color="success" aria-pressed="true" size="sm"
                                   className={"btn-pill"} onClick={() => onClickEdit(item)}>Edit</CButton>&nbsp;
                          <CButton active variant="ghost" color="danger" aria-pressed="true" size="sm"
                                   className={"btn-pill"}
                                   onClick={() => onClickDelete(item._id.toString())}>Delete</CButton>
                        </td>
                      )

                  }}
                />
              </CCardBody>
              <CCardFooter>
                <CButton color="secondary" onClick={handleAdd}>Add Vehicle</CButton>
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
                              src={selectedUser.carUrl}
                              className="c-avatar-img"
                              alt={selectedUser.email}
                            />
                          </div>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="6" className="text-right">
                          <CLabel htmlFor="text-input">Vehicle Name</CLabel>
                        </CCol>
                        <CCol xs="12" md="6">
                          <p className="form-control-static">{selectedUser.fullName.toString().toUpperCase()}</p>
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
              {createMode ? "Add Vehicle" : "Edit Vehicle"}
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
                                  temp.carUrl = img;
                                  setSelectedUser(temp);
                                  // console.log(tag, 'image', img);
                                }}/>
                            </div>
                            <CImg
                              src={selectedUser.carUrl}
                              className="c-avatar-img"
                              alt={selectedUser.fullName}
                            />
                          </div>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol md="3">
                          <CLabel htmlFor="name-input">Vehicle Name</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                          <CInput id="name-input" name="name-input" placeholder="Type a vehicle name"
                                  value={selectedUser.fullName}
                                  onChange={(e) => handleEdit('fullName', e.target.value)}
                          />
                          {/*<CFormText>This is a help text</CFormText>*/}
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
            <CButton color={createMode ? "primary" : "success"} onClick={() => handleUpdate(selectedUser._id)}>
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
)(Vehicles)
