import {expect, test} from '@playwright/test'
import { PlanJourney } from '../page-objects/planJourneyPage'

test.beforeEach(async({page}) => {
    await page.goto('https://www.nationalrail.co.uk/plan-a-journey/')
    await page.getByRole('button', {name: "Accept"}).first().click()
})

test.describe('routes details', { tag: '@PlanJourney'}, () => {

    test('search journey - add arrival and departure station - get journey summary with chosen station names', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, departureStationName, arrivalStationName] = await planJourneyPage.searchJourneyWithDepartureArrivalStationNames()
    
        expect(searchedJourney).toContain(departureStationName)
        expect(searchedJourney).toContain(arrivalStationName)
    })

    test('do not change at - add station name at which not to change - get journey summary with do not change at station', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, notChangeStationName] = await planJourneyPage.searchJourneyWithNotChangeAtStationChosen()
    
        expect(searchedJourney).toContain(`Do Not Change At ${notChangeStationName}`)
    })

})

test.describe('travel times', { tag: '@PlanJourney'}, () => {

    test('calendar - select date within thirty days - get journey summary with a date of travel within 30 days from today', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, fullExpectedDate] = await planJourneyPage.searchJourneyWithSelectedTravelDateWithinThirtyDays()
    
        expect(searchedJourney).toContain(fullExpectedDate)
    })

})

test.describe ('more passengers', { tag: '@PlanJourney'}, () => {

    test('add adults - choose number of adults within range on dropdown - get journey summary with selected number of adults', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, numberOfAdults] = await planJourneyPage.searchJourneyWithChangedAmountOfAdults()

        expect(searchedJourney).toContain(`${numberOfAdults} Adults`)
    })

    test('add children - choose number of children within range on dropdown - get journey summary with selected number of children', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney, numberOfChildren] = await planJourneyPage.searchJourneyWithWithChangedAmountOfChildren()

        if(numberOfChildren === "0") {
            expect(searchedJourney).not.toContain(`Child`)
        } else {
            expect(searchedJourney).toContain(`${numberOfChildren} Child`)
        }
        
    })
})

test.describe('railcards option', { tag: '@PlanJourney'}, () => { 

    test('add railcard - select any railcard - get journey summary with selected railcard', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [railcardsAmount, searchedJourney] = await planJourneyPage.searchJourneyWithSelectedRailcardNameAndAmount()
    
        expect(searchedJourney).toContain(`${railcardsAmount} Railcard`)
    })
    
})

test.describe('journey options', { tag: '@PlanJourney'}, () => {

    test('fastest trains only - select checkbox for fastest trains option - get journey summary with included fastest trains option', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const searchedJourney = await planJourneyPage.searchJourneyWithFastestTrainsOption()
    
        expect(searchedJourney).toContain(`Fastest trains only`)
    })

    test('add extra time - change use recommended to any other extra time option - get journey summary with selected extra time', async({page}) => {
        const planJourneyPage = new PlanJourney(page)
        const [searchedJourney,extraTimeText] = await planJourneyPage.searchJourneyWithAddedExtraTime()
    
        expect(searchedJourney).toContain(`${extraTimeText}`)
    })
})