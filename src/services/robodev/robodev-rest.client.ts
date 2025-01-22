import { RestClient } from "../../utils/rest/rest.client"

export const robodevRestClient = new RestClient({ config: { baseURL: "https://cline.robodev.com/api" } })
