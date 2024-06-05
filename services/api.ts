import { ApiEndPoints } from "../config/apiconfig";

let API = {};

export default API = {
  //     const Settings= BaseUrl + "settings";
  // const Screens= BaseUrl + "screens/2";
  // const Video= BaseUrl + "videos/get-all";
  // const Images= BaseUrl+ "get-images/" //image id

  Setting: ApiEndPoints.api + "/settings",
  Screen1: ApiEndPoints.api + "/screens/1",
  Screens: ApiEndPoints.api + "/screens/2",
  Video: ApiEndPoints.api + "/videos/get-all",
  GeneralImages: ApiEndPoints.api + "/get-images",
  Weather:
    "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/241809?apikey=92qhweritEx8Ag7GIb3VAdg2XGrvEvDp",
  TeamsFromKey: ApiEndPoints.baseUrl1 + "/teams/list/SettingKey",
  HtmlFromKey: ApiEndPoints.baseUrl1 + "/htmlcontent/list/bySettingkey",
  HtmlbyPage: ApiEndPoints.baseUrl1 + "/htmlcontent/list/HtmlContentByPage",
  NoticeScrollerPublished:ApiEndPoints.baseUrl1+"/noticescroller/list/published/SettingKey",
  WebGalleryByKey:ApiEndPoints.baseUrl1+"/webgallery/listbyKey",
  BannerByKey:ApiEndPoints.baseUrl1+"/banners/list/bykey",
  NoticeByKey:ApiEndPoints.baseUrl1+"/noticepopup/list/SettingKey"
};
