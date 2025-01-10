import {expect, test} from '@playwright/test'
import { PlanJourney } from '../page-objects/planJourneyPage'

test.beforeEach(async({page}) => {
    await page.goto('https://www.nationalrail.co.uk/plan-a-journey/')
    await page.getByRole('button', {name: "Accept"}).first().click()
})

test.describe('routes', { tag: '@PlanJourney'}, () => {

    test('search journey', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, departureStationName, arrivalStationName] = await planJourneyPage.searchJourneyStationNames()
    
        expect(searchedJourney).toContain(departureStationName)
        expect(searchedJourney).toContain(arrivalStationName)
    })

    test('do not change at', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, notChangeStationName] = await planJourneyPage.notChangeAt()
    
        expect(searchedJourney).toContain(`Do Not Change At ${notChangeStationName}`)
    })

})

test.describe('calendar', { tag: '@PlanJourney'}, () => {

    test('select date within thirty days', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, fullExpectedDate] = await planJourneyPage.selectDateWithinThirtyDays()
    
        expect(searchedJourney).toContain(fullExpectedDate)
    })

})

test.describe ('add passengers', { tag: '@PlanJourney'}, () => {

    test('add adults', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, numberOfAdults] = await planJourneyPage.searchJourneyWithMoreAdults()

        expect(searchedJourney).toContain(`${numberOfAdults} Adults`)
    })

    test('add children', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, numberOfChildren] = await planJourneyPage.searchJourneyWithMoreChildren()

        if(numberOfChildren === "0") {
            expect(searchedJourney).not.toContain(`Child`)
        } else {
            expect(searchedJourney).toContain(`${numberOfChildren} Child`)
        }
        
    })
})

test.describe('railcards', { tag: '@PlanJourney'}, () => { 

    test('add railcard', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [railcardsAmount, searchedJourney] = await planJourneyPage.selectAmountOfRailcards()
    
        expect(searchedJourney).toContain(`${railcardsAmount} Railcard`)
    })
    
})

test.describe('journey options', { tag: '@PlanJourney'}, () => {

    test('search fastest trains', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const searchedJourney = await planJourneyPage.fastestTrainsOnly()
    
        expect(searchedJourney).toContain(`Fastest trains only`)
    })

    test('add extra time', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney,extraTimeText] = await planJourneyPage.addExtraTime()
    
        expect(searchedJourney).toContain(`${extraTimeText}`)
    })
})