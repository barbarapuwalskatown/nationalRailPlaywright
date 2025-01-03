import { Page} from "@playwright/test";


export class PlanJourney{
    readonly page: Page

    constructor(page:Page){
        this.page = page
    }

    departureStationName(){
        const london_list = ["Cannon Street", "Charing Cross", "Bridge", "Blackfriars", "Euston", "Fenchurch", "Fields",
            "Kings Cross"]
        const departureName = "London " + london_list[(Math.floor(Math.random() * london_list.length))]

        return departureName
        
    }

    arrivalStationName(){
        const manchester_list = ["Airport", "Oxford", "Piccadilly", "Victoria"]
        const arrivalName = "Manchester " + manchester_list[(Math.floor(Math.random() * manchester_list.length))]

        return arrivalName
    }

    async fillInDepartureArrival(){
        const departureStationName = this.departureStationName()
        const arrivalStationName = this.arrivalStationName()

        await this.page.getByLabel('Plan a Journey').first().click()

        const departureStationInput = this.page.locator('#jp-origin')
        await departureStationInput.fill(departureStationName)
        await this.page.locator('.styled__StyledResultsListItem-sc-1ytphrk-1').first().click()

        const arrivalStationInput = this.page.locator('#jp-destination')
        await arrivalStationInput.fill(arrivalStationName)
        await this.page.locator('.styled__StyledResultsListItem-sc-1ytphrk-1').first().click()

        return [departureStationName, arrivalStationName]
    }

    async searchJourneyStationNames(){
        const [departureStationName, arrivalStationName] = await this.fillInDepartureArrival()
        await this.page.getByRole('button', {name: "Get times and prices"}).first().click()

        const searchedJourney = await this.page.locator('#station-heading-journey-planner-query').textContent()

        return [searchedJourney, departureStationName, arrivalStationName]
    }

    async searchJourneyWithMoreAdults(){
        await this.fillInDepartureArrival()
        const numberOfPeople = (Math.floor(Math.random() * 8) + 2).toString()

        await this.page.locator('#adults').selectOption({value: numberOfPeople})
        await this.page.getByRole('button', {name: "Get times and prices"}).click()

        const searchedJourney = await this.page.locator('#grid-jp-results').textContent()

        return [searchedJourney, numberOfPeople]
    }

    async fastestTrainsOnly(){
        await this.fillInDepartureArrival()

        await this.page.getByRole('button', {name: "Journey options"}).click()
        await this.page.getByRole('checkbox', {name: "Fastest trains only"}).check()

        await this.page.getByRole('button', {name: "Get times and prices"}).click()

        const searchedJourney = await this.page.locator('#station-heading-journey-planner-query').locator('..').textContent()

        return searchedJourney
    }

    async notChangeAt(){
        await this.fillInDepartureArrival()

        await this.page.getByRole('button', {name: "Route"}).click()
        await this.page.locator('#route-constraint-type').selectOption({value: "do-not-change-at"})
        const notChangeStation = await this.page.locator('#route-constraint-station')

        const numberCodeASCII = (Math.floor(Math.random() * 25) + 97)
        const firstLetter = String.fromCharCode(numberCodeASCII)

        await notChangeStation.fill(firstLetter)
        const notChangeStationName = await this.page.locator('.styled__StyledResultsListItem-sc-1ytphrk-1').first().innerText()
        notChangeStation.toString().split(" ");
        
        await this.page.locator('.styled__StyledResultsListItem-sc-1ytphrk-1').first().click()
        await this.page.getByRole('button', {name: "Get times and prices"}).click()

        const searchedJourney = await this.page.locator('#station-heading-journey-planner-query').textContent()

        return [searchedJourney, notChangeStationName[0]]
    }
        
    async selectDateWithinThirtyDays(){
        await this.fillInDepartureArrival()

        await this.page.locator('#leaving-date').click()

        let date = new Date()
        date.setDate(date.getDate() + (Math.floor(Math.random() * 30) + 1))
        let expectedDay = date.getDate().toString()
     
        const expectedMonth = date.toLocaleString('en-GB', { month: 'short' })
        const expectedYear = date.getFullYear()
        const fullExpectedDate = `${expectedDay} ${expectedMonth} ${expectedYear}`
        
        await this.page.locator('.react-datepicker__day[aria-disabled="false"]').getByText(expectedDay, {exact: true}).first().click()

        await this.page.getByRole('button', {name: "Get times and prices"}).click()

        const searchedJourney = await this.page.locator('#station-heading-journey-planner-query').locator('..').textContent()
     
        return [searchedJourney, fullExpectedDate]
    }
}