/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-09-13 16:38:56
 * @LastEditors: camus
 * @LastEditTime: 2021-09-14 11:37:15
 */
import React, { useEffect, useReducer } from 'react';
import { initialState, petsReducer, getData, Types } from './utils';
import { Select } from 'antd';
import Pets from './Pets';
const { Option } = Select;

const SelectPets: React.FC = (props) => {
  const [pets, dispatch] = useReducer(petsReducer, initialState);

  const onChange = (value: string) => {
    dispatch({ type: Types.PetSelected, payload: value });
  };

  useEffect(() => {
    if (pets.selectedPet) {
      dispatch({ type: Types.FetchPet });
      getData(pets.selectedPet).then((data) => {
        dispatch({ type: Types.FetchPetSuccess, payload: data });
      });
    } else {
      dispatch({ type: Types.Rest });
    }
  }, [pets.selectedPet]);

  return (
    <div>
      <Select placeholder={'Select a pet'} onChange={onChange}>
        <Option value="cats">Cats</Option>
        <Option value="dogs">Dogs</Option>
      </Select>
      {pets.loading && <div>Loading...</div>}
      {pets.petData && <Pets {...pets.petData} />}
    </div>
  );
};
export default SelectPets;
