import React, { ChangeEvent, useEffect, useState } from 'react';
import './BuildingForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Input from '../../../core/Input/Input';
import countriesData from '../../../assets/moc/countriesList.json';
import Select from '../../../core/Select/Select';
import Button from '../../../core/Button/Button';
import {
  addBuilding, setActiveBuilding, setFormMode, updateBuilding,
} from '../../../redux/userBuildingSlice';
import { RootState } from '../../../redux/store';
import { Building } from '../../../interfaces/Building.interface';
import { SUCCESS_CREATE_MESSAGE, SUCCESS_UPDATE_MESSAGE } from '../../../constants/messages.constant';
import { DEFAULT_FORM_DATA } from '../../../constants/building.constant';

const BuildingForm = () => {
  const [countries] = useState(countriesData);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState<Building | any>();
  const formMode = useSelector((state: RootState) => state.usersBuildings.FormMode);
  const selectedBuilding = useSelector((state: RootState) => state.usersBuildings.activeBuilding);
  const dispatch = useDispatch();

  useEffect(() => {
    if (formMode === 'UPDATE') {
      setFormData(selectedBuilding);
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, []);

  const formChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const formSubmitHandler = () => {
    const { position, name } = countries.filter(
      (country) => country.id === formData.countryCode,
    )[0];

    const building: Building = {
      buildingName: formData.buildingName,
      countryCode: formData.countryCode,
      countryName: name,
      position,
      id: uuidv4(),
    };

    if (formMode === 'ADD') {
      dispatch(addBuilding(building));
      toast.success(SUCCESS_CREATE_MESSAGE);
    } else {
      dispatch(updateBuilding(building));
      toast.success(SUCCESS_UPDATE_MESSAGE);
    }
    dispatch(setActiveBuilding(building));
    dispatch(setFormMode(null));
  };

  return (
    <form className="building-form">
      <h2 className="building-form__title">{formData?.buildingName}</h2>
      <div className="building-form__group">
        <Input
          value={formData?.buildingName}
          id="buildingName"
          placeholder="Building Name"
          onChange={formChangeHandler}
          label="Building Name"
        />
      </div>
      <div className="building-form__group">
        <Select
          id="countryCode"
          placeholder="Building Location"
          options={countries}
          value={formData?.countryCode}
          keyName="name"
          keyValue="id"
          onChange={formChangeHandler}
          label="Building Location"
        />
      </div>
      <div className="building-form__actions">
        <Button onClick={() => dispatch(setFormMode(null))} type="secondary">Cancel</Button>
        <Button
          onClick={formSubmitHandler}
          type="primary"
        >
          {formMode === 'UPDATE' ? 'Edit' : 'Create'}
        </Button>
      </div>
    </form>

  );
};
export default BuildingForm;
