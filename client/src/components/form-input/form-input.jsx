import React from 'react';

import './form-input.scss';

const FormInput = ({handleChange, label, isRatio, role, ...otherProps}) => {
    return (
    <div className={`group ${isRatio?'ratio':''}`} >
    {
            label ? 
            <label className={`${otherProps.value.length?'shrink':''} form-input-label`}>
                {label}
            </label>
            : null
        }
        <input className='form-input' onChange={handleChange} checked={role===otherProps.value} {...otherProps}/>

    </div>
)}

export default FormInput;