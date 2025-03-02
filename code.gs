function doGet(e) {
  // APIキー (環境変数として格納)
  const API_KEY = getPexelsApiKey();

  // クエリパラメータ取得
  const collectionId = e.parameter.collection;
  const theme = e.parameter.theme;
  const perPage = e.parameter.perPage || 60; // 取得数 (デフォルト10)

  let url;
  
  if (collectionId) {
    url = `https://api.pexels.com/v1/collections/${collectionId}?per_page=${perPage}`;
  } else if (theme) {
    url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(theme)}&per_page=${perPage}`;
  } else {
    return makeJsonResponse({ error: "collection または theme パラメータが必要です。" });
  }

  // APIリクエスト
  const response = fetchPexelsApi(url, API_KEY);
  return makeJsonResponse(response);
}

// Pexels API へのリクエスト関数
function fetchPexelsApi(url, apiKey) {
  try {
    const options = {
      method: "GET",
      headers: { "Authorization": apiKey },
      muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    return { error: "Pexels API の取得に失敗しました", details: error.toString() };
  }
}


function makeJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)

}


// 環境変数 (Properties Service) から APIキーを取得
function getPexelsApiKey() {
  return PropertiesService.getScriptProperties().getProperty("PEXELS_API_KEY");
}
