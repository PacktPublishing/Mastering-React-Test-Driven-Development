import ReactDom from 'react-dom'
import React from 'react'
import {Appointment} from '../src/Appointment'
import { expect } from '@jest/globals'


describe('Appointment',()=>{
    let container
    let render

    beforeEach(()=>{
        container = document.createElement('div')
        document.body.appendChild(container)
        render = (element) =>  ReactDom.render(element, container)
    })

    it ('renders the customer first name Anna', ()=>{
        const customer ={firstName: "Anna"}
        const element =<Appointment customer={customer}/>
        render(element)
        expect(document.body.textContent).toMatch('Anna')
    })
    it ('renders the customer first name Josh', ()=>{
        const customer ={firstName: "Josh"}
        const element =<Appointment customer={customer}/>
        render(element)
        expect(document.body.textContent).toMatch('Josh')
    })
})