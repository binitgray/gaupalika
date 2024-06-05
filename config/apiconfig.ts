let Base_URL="http://202.51.74.85:6003"
let Host_URL="https://localhost:3000";
let Base_URL1="https://api.graycode.com.np"
  //let Base_URL="https://localhost:44325";
  let Weather="http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/241809?apikey=92qhweritEx8Ag7GIb3VAdg2XGrvEvDp"; 
let apiEndPoints: {
    api: string;
    base: string;
    baseUrl:string,
    baseUrl1:string,
    hostUrl:string
    weatherUrl :string
};

function getApiEndPoints() {
    switch (process.env.NODE_ENV) {
        case "development":
            apiEndPoints = {               
                api: Base_URL,
                base: "/",
                baseUrl:Base_URL,
                baseUrl1:Base_URL1+"/api/v1",
                hostUrl:Host_URL,
                weatherUrl:Weather
            };
            break;
        case "production":
            apiEndPoints = {               
                api: Base_URL,
                base: "/",
                baseUrl:Base_URL,
                baseUrl1:Base_URL1+"/api/v1",
                hostUrl:Host_URL,
                weatherUrl:Weather

            };
            break;

        default:
            apiEndPoints = {               
                api: Base_URL,
                base: "/",
                baseUrl:Base_URL,
                baseUrl1:Base_URL1+"/api/v1",
                hostUrl:Host_URL,
                weatherUrl:Weather

            };
    }
    return apiEndPoints;
}
export const ApiEndPoints = getApiEndPoints();
