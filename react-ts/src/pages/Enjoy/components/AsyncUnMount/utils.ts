/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-09-13 16:34:08
 * @LastEditors: camus
 * @LastEditTime: 2021-09-13 17:41:21
 */

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  PetSelected = 'PET_SELECTED',
  FetchPet = 'FETCH_PET',
  FetchPetSuccess = 'FETCH_PET_SUCCESS',
  Rest = 'RESET',
}

type PetPayLoad = {
  [Types.PetSelected]: string;
  [Types.FetchPet]: undefined;
  [Types.FetchPetSuccess]: Pet;
  [Types.Rest]: undefined;
};

interface Pet {
  name: string;
  voice: string;
  avatar: string;
}

export type PetActions = ActionMap<PetPayLoad>[keyof ActionMap<PetPayLoad>];

const petsDB = {
  dogs: { name: 'Dogs', voice: 'Woof!', avatar: '🐶' },
  cats: { name: 'Cats', voice: 'Miauuu', avatar: '🐱' },
};

const getData = (type: keyof typeof petsDB): Promise<Pet> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(petsDB[type]);
    }, 2000);
  });
};

const petsReducer = (state: any, action: PetActions) => {
  switch (action.type) {
    case 'PET_SELECTED': {
      return {
        ...state,
        selectedPet: action.payload,
      };
    }
    case 'FETCH_PET': {
      return {
        ...state,
        loading: true,
        petData: null,
      };
    }
    case 'FETCH_PET_SUCCESS': {
      return {
        ...state,
        loading: false,
        petData: action.payload,
      };
    }

    case 'RESET': {
      return initialState;
    }

    default:
      throw new Error(`Not supported action ${action.type}`);
  }
};

const initialState = { loading: false, selectedPet: '', petData: null };

export { getData, petsReducer, initialState };
