import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


const Icons = ({name}) => {
  switch (name) {
    case "circle":
      return <Icon name="circle-thin" size={38} color="#1E36A6"/>;

    case "cross":
      return <Icon name="times" size={38} color="#A61E1E"/>;
   
    default:
      return <Icon name="pencil" size={38} color="#FFCE00"/>;
  }
}
export default Icons;