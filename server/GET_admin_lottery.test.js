import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import SETTINGS from "../settings.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/admin/lottery";
// const apiEndpoint = "http://localhost:5000/api/v1/admin/lottery";
const apiEndpoint = `${SETTINGS.API_ENDPOINT}/admin/lottery`;
let params = { paging: 1, amount: 10 };

describe(`GET ${apiEndpoint}`, () => {
    beforeEach(() => {
        params = { paging: 1, amount: 10 };
    });

    it("should response with a 200 and a list of lotteries", async () => {
        let lotteryList;
        if (process.env.USE_MOCK_DATA) {
            lotteryList = MOCK_DATA.mockAdminLotteryGetResponse;
            console.log("using mock data");
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                lotteryList = response.data;
            } catch (err) {
                console.error(err);
            }
        }

        expect(lotteryList).toHaveProperty("code", CODE.success);
        expect(lotteryList).toHaveProperty("message", "取得成功");
        expect(lotteryList).toHaveProperty("data");
        expect(Array.isArray(lotteryList.data.lottery)).toBe(true);

        for (const lottery of lotteryList.data.lottery) {
            expect(lottery).toHaveProperty("event_id");
            expect(lottery.event_id).toBeGreaterThan(0);
            expect(lottery).toHaveProperty("event_name");
            expect(typeof lottery.event_name).toBe("string");
            expect(lottery).toHaveProperty("event_start_time");
            expect(typeof lottery.event_start_time).toBe("string");
            expect(lottery).toHaveProperty("event_end_time");
            expect(typeof lottery.event_end_time).toBe("string");
            expect(lottery).toHaveProperty("is_visible");
            expect(typeof lottery.is_visible).toBe("boolean");
            expect(lottery).toHaveProperty("status");
            expect(typeof lottery.status).toBe("string");
            expect(["pending", "ongoing", "cancelled", "finished"]).toContain(
                lottery.status
            );
            expect(lottery).toHaveProperty("total_inventory");
            expect(typeof lottery.total_inventory).toBe("number");
        }
    });

    //* paging type 不正確的 response check
    it("should response with a 200 and a error message when 'paging' is not a number", async () => {
        let error;
        params.paging = "wrong type of paging";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
            console.log("using mock data");
            console.log(`error:`);
            console.log(error);
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }

        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
    //* amount type 不正確的 response check
    it("should response with a 200 and a error message when 'amount' is not a number", async () => {
        let error;
        params.amount = "wrong type of paging";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
            console.log("using mock data");
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
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
        params,
    });

    return response;
}
