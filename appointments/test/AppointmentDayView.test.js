import ReactDom from 'react-dom'
import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'
import { expect } from '@jest/globals'
import { AppointmentDayView } from '../src/AppointmentDayView'

describe('AppointmentDayView',()=>{
    let container
    let render
    const today = new Date()
    const appointments = [
        {customer:{firstName:'Ashley'}, startAt: today.setHours(12,0)},
        {customer:{firstName:'Anna'}, startAt: today.setHours(13,0)}
    ]

        

    beforeEach(()=>{
        container = document.createElement('div')
        render = (element) =>  ReactDom.render(element, container)
    })

    it ('renders multiple appointments in an ol element', ()=>{
        const element = <AppointmentDayView appointments={appointments}/>
        render(element)
        expect(container.querySelector('ol')).not.toBeNull()
        expect(container.querySelector('ol').children).toHaveLength(2)
        expect(container.querySelectorAll('li')[0].textContent).toEqual("12:00")
        expect(container.querySelectorAll('li')[1].textContent).toEqual("13:00")
    })

    it('initally shoes a message saying there are no appintments today', ()=>{
        const element = <AppointmentDayView appointments={[]}/>
        render(element)
        expect(container.textContent).toMatch('There are no appointments scheduled for today')
    })

    it('seletct the first appointment by default', ()=>{

   
        const element = <AppointmentDayView appointments={appointments}/>
        render(element)
        expect(container.textContent).toMatch('Ashley')
    })

    it('has a button element in each li',()=>{
        const element = <AppointmentDayView appointments={appointments}/>
        render(element)
        expect(container.querySelectorAll('li > button')).toHaveLength(2)
        expect(container.querySelectorAll('li > button')[0].type).toEqual('button')

    })

    it('renders another appintment when clicked',()=>{
        const element = <AppointmentDayView appointments={appointments}/>
        render(element)
        const button = container.querySelectorAll('button')[0]
        ReactTestUtils.Simulate.click(button)
        expect(container.textContent).toMatch('Ashley')
    })

    
})