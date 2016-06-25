import { FETCH_PICTURES, FIND_PICTURES, SET_FILTERS, SET_SEARCH } from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
	allPictures:null,
  filteredPictures:null,
	isFetching:true,
	enabledFilter:null,
  searchFor:null
}

export default function picturesReducer(state = initialState, action) {
  const flattenArray = (pictures, filter, searchTerm) => {
    // turn nested picture data into a flat array
    //console.log(state.enabledFilter, state.searchFor, pictures,'should be all')
    let flatPicsArr = [];
    let pics = pictures;

    if(pics){
      let allNestedPictures = pics.categories;
      // iterate through every category that has nested pictures
      for(let key in allNestedPictures){
        // if filter is enabled, then only add filtered content to flatPicsArr
        if(filter){
          if(removeCategory(key, filter)) continue;
        }else if(state.enabledFilter){
          if(removeCategory(key, state.enabledFilter)) continue;
        }

        // if user is searching, then only add serched content to flatPicsArr
        if(searchTerm){
          if(searchCategory(key, searchTerm)) continue;
        } else if(state.searchFor){
          if(searchCategory(key, state.searchFor)) continue;
        }
        console.log(allNestedPictures[key],'huh')
        let categoryPictures = allNestedPictures[key];
        for(let i = 0; i < categoryPictures.length; i++){
          let individualPicture = categoryPictures[i]
          flatPicsArr.push(individualPicture);
        }
      }
    }

    return flatPicsArr;
  }

  const removeCategory = (category, filter) => {
    let categories = category.split("/");
    for(let i = 0; i < categories.length; i++){
      if(categories[i] === filter)
        return false;
    }
    return true;
  }

  const searchCategory = (category, searchTerm) => {
    let categories = category.split("/");
    for(let i = 0; i < categories.length; i++){
      if( categories[i].indexOf(searchTerm) > -1 ){
        return false;
      }
    }
    return true;
  }

  switch (action.type) {
    case FETCH_PICTURES:
    	return {...state, allPictures: action.payload, filteredPictures:flattenArray(action.payload), isFetching:false};
    case SET_FILTERS:
      return {...state, enabledFilter:action.filter, filteredPictures:flattenArray(state.allPictures,action.filter)};
    case FIND_PICTURES:
      return {...state, searchFor:action.term, filteredPictures:flattenArray(state.allPictures, null, action.term) };
    case SET_SEARCH:
    console.log('action term', action.term)
      return {...state, searchFor:action.term}
    default:
      return state;
  }
}
