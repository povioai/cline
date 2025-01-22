import { RestClient } from "../../utils/rest/rest.client"

export const robodevRestClient = new RestClient({ config: { baseURL: "http://localhost:3000/api" } })
