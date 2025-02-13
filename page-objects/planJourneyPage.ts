import { Page } from "@playwright/test";
import railcards from "../test-data/railcards.json";

export class PlanJourney {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  departureStationName() {
    const london_list = [
      "Cannon Street",
      "Charing Cross",
      "Bridge",
      "Blackfriars",
      "Euston",
      "Fenchurch",
      "Fields",
      "Kings Cross",
    ];
    const departureName =
      "London " + london_list[Math.floor(Math.random() * london_list.length)];

    return departureName;
  }

  arrivalStationName() {
    const manchester_list = ["Airport", "Oxford", "Piccadilly", "Victoria"];
    const arrivalName =
      "Manchester " +
      manchester_list[Math.floor(Math.random() * manchester_list.length)];

    return arrivalName;
  }

  async fillInDepartureArrivalStationInputs() {
    const departureStationName = this.departureStationName();
    const arrivalStationName = this.arrivalStationName();

    await this.page.getByLabel("Plan a Journey").first().click();

    const departureStationInput = this.page.locator("#jp-origin");
    await departureStationInput.fill(departureStationName);
    await this.page
      .locator(".styled__StyledResultsListItem-sc-1ytphrk-1")
      .first()
      .click();

    const arrivalStationInput = this.page.locator("#jp-destination");
    await arrivalStationInput.fill(arrivalStationName);
    await this.page
      .locator(".styled__StyledResultsListItem-sc-1ytphrk-1")
      .first()
      .click();

    return [departureStationName, arrivalStationName];
  }

  async selectNumberOfAdults() {
    const numberOfAdults = Math.floor(Math.random() * 10).toString();
    await this.page.locator("#adults").selectOption({ value: numberOfAdults });

    return numberOfAdults;
  }

  async selectNumberOfChildren(numberOfAdults: number) {
    const maxNumPassengers = 9;
    const spacesLeft = maxNumPassengers - numberOfAdults;
    const numberOfChildren = Math.floor(
      Math.random() * (spacesLeft + 1)
    ).toString();
    await this.page
      .locator("#children")
      .selectOption({ value: numberOfChildren });

    return numberOfChildren;
  }

  async searchJourneyWithDepartureArrivalStationNames() {
    const [departureStationName, arrivalStationName] =
      await this.fillInDepartureArrivalStationInputs();
    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .first()
      .click();

    const searchedJourney = await this.page
      .locator("#station-heading-journey-planner-query")
      .textContent();

    return [searchedJourney, departureStationName, arrivalStationName];
  }

  async searchJourneyWithNotChangeAtStationChosen() {
    await this.fillInDepartureArrivalStationInputs();

    await this.page.getByRole("button", { name: "Route" }).click();
    await this.page
      .locator("#route-constraint-type")
      .selectOption({ value: "do-not-change-at" });
    const notChangeStation = await this.page.locator(
      "#route-constraint-station"
    );

    const numberCodeASCII = Math.floor(Math.random() * 25) + 97;
    const firstLetter = String.fromCharCode(numberCodeASCII);

    await notChangeStation.fill(firstLetter);
    const notChangeStationName = await this.page
      .locator(".styled__StyledResultsListItem-sc-1ytphrk-1")
      .first()
      .innerText();
    notChangeStation.toString().split(" ");

    await this.page
      .locator(".styled__StyledResultsListItem-sc-1ytphrk-1")
      .first()
      .click();
    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#station-heading-journey-planner-query")
      .textContent();

    return [searchedJourney, notChangeStationName[0]];
  }

  async searchJourneyWithSelectedTravelDateWithinThirtyDays() {
    await this.fillInDepartureArrivalStationInputs();

    await this.page.locator("#leaving-date").click();

    let date = new Date();
    date.setDate(date.getDate() + (Math.floor(Math.random() * 30) + 1));
    let expectedDay = date.getDate().toString();

    const expectedMonth = date.toLocaleString("en-GB", { month: "short" });
    const expectedYear = date.getFullYear();
    const fullExpectedDate = `${expectedDay} ${expectedMonth} ${expectedYear}`;

    await this.page
      .locator('.react-datepicker__day[aria-disabled="false"]')
      .getByText(expectedDay, { exact: true })
      .first()
      .click();

    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#station-heading-journey-planner-query")
      .locator("..")
      .textContent();

    return [searchedJourney, fullExpectedDate];
  }

  async searchJourneyWithChangedAmountOfAdults() {
    await this.fillInDepartureArrivalStationInputs();
    const numberOfAdults = await this.selectNumberOfAdults();

    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#grid-jp-results")
      .textContent();

    return [searchedJourney, numberOfAdults];
  }

  async searchJourneyWithWithChangedAmountOfChildren() {
    await this.fillInDepartureArrivalStationInputs();
    const numberOfAdults = Number(await this.selectNumberOfAdults());
    const numberOfChildren = await this.selectNumberOfChildren(numberOfAdults);

    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#grid-jp-results")
      .textContent();

    return [searchedJourney, numberOfChildren];
  }

  async searchJourneyWithSelectedRailcardNameAndAmount() {
    await this.fillInDepartureArrivalStationInputs();

    const listOfRailcards = JSON.parse(JSON.stringify(railcards));
    const railcardNumber = Math.floor(
      Math.random() * listOfRailcards.railcards.length
    );

    const numberOfAdults = Number(await this.selectNumberOfAdults());
    const numberOfChildren = await this.selectNumberOfChildren(numberOfAdults);

    let amount = Math.floor(
      Math.random() * (Number(numberOfAdults) + Number(numberOfChildren)) + 1
    ).toString();

    await this.page.getByRole("button", { name: "Add Railcard" }).click();
    await this.page
      .locator("#railcard-0")
      .selectOption({ value: listOfRailcards.railcards[railcardNumber] });
    await this.page
      .locator("#railcard-0-count")
      .selectOption({ value: amount });

    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#jp-summary-buy-link")
      .locator("..")
      .locator("..")
      .textContent();

    if (amount === "0") {
      amount = "No";
    }

    return [amount, searchedJourney];
  }

  async searchJourneyWithFastestTrainsOption() {
    await this.fillInDepartureArrivalStationInputs();

    await this.page.getByRole("button", { name: "Journey options" }).click();
    await this.page
      .getByRole("checkbox", { name: "Fastest trains only" })
      .check();

    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#station-heading-journey-planner-query")
      .locator("..")
      .textContent();

    return searchedJourney;
  }

  async searchJourneyWithAddedExtraTime() {
    await this.fillInDepartureArrivalStationInputs();
    const extraTimeOption = (Math.floor(Math.random() * 4) + 1).toString();

    await this.page.getByRole("button", { name: "Journey options" }).click();
    await this.page
      .locator("#extra-time")
      .selectOption({ value: extraTimeOption });

    const extraTimeText = await this.page.locator(`#extra-time`).innerText();
    const extraTimeSplit = extraTimeText.split("\n");

    await this.page
      .getByRole("button", { name: "Get times and prices" })
      .click();

    const searchedJourney = await this.page
      .locator("#station-heading-journey-planner-query")
      .locator("..")
      .textContent();

    return [searchedJourney, extraTimeSplit[extraTimeOption]];
  }
}
