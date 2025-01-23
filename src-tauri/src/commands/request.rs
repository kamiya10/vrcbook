use reqwest::Method;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct BasicRequest {
    url: String,
    method: Option<String>,
    headers: Option<HashMap<String, String>>,
    body: Option<String>,
}

#[derive(Serialize)]
pub struct BasicResponse {
    status: u16,
    status_text: String,
    headers: HashMap<String, String>,
    body: String,
}

#[tauri::command]
pub async fn request(request: BasicRequest) -> Result<BasicResponse, String> {
    use reqwest::header::HeaderName;

    let client = reqwest::Client::builder()
        .build()
        .map_err(|e| e.to_string())?;

    let method = request.method.unwrap_or_else(|| "GET".into());

    let mut req_builder = client.request(
        method.parse::<Method>().map_err(|e| e.to_string())?,
        &request.url,
    );

    if let Some(headers_map) = request.headers {
        for (k, v) in headers_map {
            let header_name = HeaderName::try_from(k).map_err(|e| e.to_string())?;
            req_builder = req_builder.header(header_name, v);
        }
    }

    if let Some(body) = request.body {
        req_builder = req_builder.body(body);
    }

    let resp = req_builder.send().await.map_err(|e| e.to_string())?;

    let status = resp.status();
    let status_text = status.canonical_reason().unwrap_or("").to_string();

    let mut response_headers = HashMap::new();
    for (key, value) in resp.headers().iter() {
        response_headers.insert(key.to_string(), value.to_str().unwrap_or("").to_string());
    }

    let body = resp.text().await.map_err(|e| e.to_string())?;

    Ok(BasicResponse {
        status: status.as_u16(),
        status_text,
        headers: response_headers,
        body,
    })
}
