import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import SETTINGS from "../settings.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/lottery/event";
// const apiEndpoint = "http://localhost:5000/api/v1/lottery/event";
const apiEndpoint = `${SETTINGS.API_ENDPOINT}/lottery/event`;
let headers = { Authorization: "Bearer " + SETTINGS.API_ACCESS_TOKEN };
let params = { event_id: 1 };

describe(`GET ${apiEndpoint}`, () => {
    beforeEach(() => {
        headers = { Authorization: "Bearer " + SETTINGS.API_ACCESS_TOKEN };
        params = { event_id: 1 };
    });

    //* 200 response check
    it("should response with a 200 and a list of lottery events", async () => {
        let lotteryEvent;
        if (process.env.USE_MOCK_DATA) {
            lotteryEvent = MOCK_DATA.mockLotteryEventResponse;
            console.log("using mock data");
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                // console.log(`response`);
                console.log(response);
                lotteryEvent = response.data;
            } catch (err) {
                console.error(err);
                // console.error(err.response.data);
            }
        }

        expect(lotteryEvent).toHaveProperty("code", CODE.success);
        expect(lotteryEvent).toHaveProperty("message", "取得成功");
        expect(lotteryEvent).toHaveProperty("data");
        expect(Array.isArray(lotteryEvent.data)).toBe(true);
        // expect(lotteryList).toHaveProperty("next_paging");

        //* 檢查每一個 event 中的內容是否正確
        for (const event of lotteryEvent.data) {
            expect(event).toHaveProperty("discount_name");
            expect(typeof event.discount_name).toBe("string");
            expect(event).toHaveProperty("discount_value");
            expect(typeof event.discount_value).toBe("number");
            expect(event).toHaveProperty("threshold");
            expect(typeof event.threshold).toBe("number");
            expect(event).toHaveProperty("inventory");
            expect(typeof event.inventory).toBe("number");
            expect(Number.isInteger(event.inventory)).toBe(true);
            expect(event.inventory).toBeGreaterThanOrEqual(0);
        }
    });

    // //* access_token not provided
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is undefined`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
                expect(error).toHaveProperty("code", CODE.accessTokenError);
                expect(error).toHaveProperty(
                    "message",
                    ERROR_MESSAGE.accessTokenErrorMessage
                );
            } catch (err) {
                console.error(err);
            }
        }
    });

    //* access_token is not correct
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is not correct`, async () => {
        let error;
        headers.Authorization = `Bearer ${SETTINGS.API_ACCESS_TOKEN}wrong`;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log(`response`);
                console.log(response.data);
                error = response.data;
            } catch (err) {
                console.log(err);
                // console.error(err.response.data);
            }
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });
    // //* if params is not provided
    it(`should response with a CODE ${CODE.queryRequiredError} if the params is undefined`, async () => {
        let error;
        params = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            try {
                // const response = await axios.get(`${apiEndpoint}`, {
                //     headers,
                //     params,
                // });
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.queryRequiredError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.queryRequiredErrorMessage
        );
    });
    //* event_id error check(not provided)
    it(`should response with a CODE ${CODE.queryRequiredError} if the event_id is undefined`, async () => {
        let error;
        params.event_id = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                // const response = await axios.get(`${apiEndpoint}`, {
                //     headers,
                //     params,
                // });
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.queryRequiredError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.queryRequiredErrorMessage
        );
    });
    //* event_id error check(invalid value)
    it(`should response with a CODE ${CODE.inputValueInvalidError} if the event_id is invalid`, async () => {
        let error;
        params.event_id = "wrong type !!";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
});

/**
 * * Get response from API endpoint
 * @returns
 */
async function getResponseFromAPIEndpoint() {
    const response = await axios.get(`${apiEndpoint}`, {
        headers,
        params,
    });

    return response;
}
