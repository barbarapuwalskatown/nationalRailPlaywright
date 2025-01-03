import {expect, test} from '@playwright/test'
import { PlanJourney } from '../page-objects/planJourneyPage'

test.beforeEach(async({page}) => {
    await page.goto('https://www.nationalrail.co.uk/plan-a-journey/')
    await page.getByRole('button', {name: "Accept"}).first().click()
})

test('search journey with station names', async({page}) => {
    const planJourneyPage = new PlanJourney(page)
    const [searchedJourney, departureStationName, arrivalStationName] = await planJourneyPage.searchJourneyStationNames()

    expect(searchedJourney).toContain(departureStationName)
    expect(searchedJourney).toContain(arrivalStationName)
})

test('add adults', async({page}) => {
    const planJourneyPage = new PlanJourney(page)
    const [searchedJourney, numberOfPeople] = await planJourneyPage.searchJourneyWithMoreAdults()

    expect(searchedJourney).toContain(`${numberOfPeople} Adults`)
})

test('search fastest trains', async({page}) => {
    const planJourneyPage = new PlanJourney(page)
    const searchedJourney = await planJourneyPage.fastestTrainsOnly()

    expect(searchedJourney).toContain(`Fastest trains only`)
})

test('do not change at', async({page}) => {
    const planJourneyPage = new PlanJourney(page)
    const [searchedJourney, notChangeStationName] = await planJourneyPage.notChangeAt()

    expect(searchedJourney).toContain(`Do Not Change At ${notChangeStationName}`)
})

test('select date within thirty days', async({page}) => {
    const planJourneyPage = new PlanJourney(page)
    const [searchedJourney, fullExpectedDate] = await planJourneyPage.selectDateWithinThirtyDays()

    expect(searchedJourney).toContain(fullExpectedDate)
})