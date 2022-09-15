import React, { useState } from 'react'
export const CustomerForm = ({firstName, fetch, onSubmit}) =>{

    const [customer, setCustomer] = useState({firstName})

    const handleChangeFirstName = ({target}) =>{
        setCustomer({...customer, firstName: target.firstName})
    }
    const handleSubmit = e => {
        e.preventDefault();
        const result = fetch('/customers',{
            method:"POST",
            credentials: 'same-origin',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify(customer)
        })
      
        onSubmit(customer)
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

CustomerForm.defaultProps = {
    fetch: async()=>{},
    onSubmit: ()=>{},
    onSave: ()=>{},
}