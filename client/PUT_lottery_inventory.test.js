import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import SETTINGS from "../settings.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/lottery/inventory";
// const apiEndpoint = "http://localhost:5000/api/v1/lottery/inventory";
const apiEndpoint = `${SETTINGS.API_ENDPOINT}/lottery/inventory`;
let params = { discount_id: 1 };
let input = { increase: true };
let headers = { Authorization: `Bearer ${SETTINGS.API_ACCESS_TOKEN}` };

describe(`POST ${apiEndpoint}`, () => {
    beforeEach(() => {
        params = { discount_id: 1 };
        input = { increase: true };
        headers = { access_token: `Bearer ${SETTINGS.API_ACCESS_TOKEN}` };
    });

    //* 200 response check
    it("should response with a 200 and a list of lottery events", async () => {
        let lotteryInfo;
        if (process.env.USE_MOCK_DATA) {
            lotteryInfo = MOCK_DATA.mockLotteryInventoryResponse;
            console.log("using mock data");
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
                lotteryInfo = response.data;
            } catch (err) {
                console.log(err);
            }
        }

        expect(lotteryInfo).toHaveProperty("code", CODE.success);
        expect(lotteryInfo).toHaveProperty("message", "更新成功");
        expect(lotteryInfo).toHaveProperty("data");
        expect(lotteryInfo.data).toHaveProperty(
            "discount_id",
            expect.any(Number)
        );
        expect(lotteryInfo.data).toHaveProperty(
            "discount_id",
            params.discount_id
        );
        expect(lotteryInfo.data).toHaveProperty("event_id", expect.any(Number));
        expect(lotteryInfo.data).toHaveProperty(
            "discount_name",
            expect.any(String)
        );
        expect(lotteryInfo.data).toHaveProperty(
            "inventory",
            expect.any(Number)
        );
    });

    //* access_token not provided
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is undefined`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
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
                console.log("not using mock data");
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });
    //* params not complete error check (params is not provided)
    it(`should response with a ${CODE.queryRequiredError} if the request params is not complete`, async () => {
        let error;
        params = {};

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
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
    //* params not complete error check (request body is not provided)
    it(`should response with a ${CODE.queryRequiredError} if the request params is not complete`, async () => {
        let error;
        input = {};

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
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

    //* params value error check (discount_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params value is invalid`, async () => {
        let error;
        params.discount_id = undefined;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
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
    //* params value error check (discount_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        params.discount_id = -200;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
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
    //* request body error check (increase is not correct)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.increase = "wrong";

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
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
    //* params value error check (coupon type is invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.coupon = false;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                console.log("not using mock data");
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
    const response = await axios.put(`${apiEndpoint}`, input, {
        headers,
        params,
    });

    return response;
}
