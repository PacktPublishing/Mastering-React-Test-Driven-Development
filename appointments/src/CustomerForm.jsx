import React, { useState } from 'react'
export const CustomerForm = ({firstName}) =>{

    const [customer, setCustomer] = useState({firstName})

    const handleChangeFirstName = ({target}) =>{
        setCustomer({...customer, firstName: target.firstName})
    }
    const handleSubmit = e => {
        e.preventDefault();
        
    };
    return <div>
        <form id='customer' onSubmit={handleSubmit}>
            <label htmlFor='firstName'>First name</label>
            <input type='text' id='firstName' name='firstName' value={firstName} onChange={handleChangeFirstName}
            readOnly/>
            <input type="submit" value="Add"  />
        </form>
    </div>
}