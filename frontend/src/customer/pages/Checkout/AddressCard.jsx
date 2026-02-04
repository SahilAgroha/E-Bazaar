import { Radio } from '@mui/material';
import React from 'react';

const AddressCard = ({ item, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(item)} // On click, call the onSelect prop with the item
            className={`p-5 border rounded-md flex cursor-pointer transition-colors duration-200 ${
                isSelected ? 'border-indigo-600 bg-indigo-50' : '' // Add a highlighted border and background
            }`}
        >
            <div>
                {/* The Radio button's checked state is now controlled by the isSelected prop */}
                <Radio
                    checked={isSelected}
                    onChange={() => onSelect(item)}
                    value={item.id} // Set value to a unique ID for the radio group
                    name='shipping-address-radio'
                />
            </div>
            <div className="space-y-3 pt-3 pl-2">
                <h1>
                    {/* Use data from the item prop */}
                    <strong>{item.name}</strong>
                    {isSelected && (
                        <svg className="w-5 h-5 text-indigo-600 inline-block ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </h1>
                <p className="w-full text-sm text-gray-700">
                    {`${item.address}, ${item.locality}, ${item.city} - ${item.pinCode}, ${item.state}`}
                </p>
                <p className="text-sm">
                    <strong>Mobile: </strong>{item.mobile}
                </p>
            </div>
        </div>
    );
};

export default AddressCard;