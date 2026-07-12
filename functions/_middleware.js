import { sha256 } from '../js/sha256.js';

function readApiSites(jsonValue) {
  if (!jsonValue) return {};

  try {
    const parsed = JSON.parse(jsonValue);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('API_SITES_JSON 必须是 JSON 对象');
    }

    const sites = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!/^[a-zA-Z0-9_]+$/.test(key) || !value || typeof value !== 'object') {
        continue;
      }

      const name = typeof value.name === 'string' ? value.name.trim() : '';
      const api = typeof value.api === 'string' ? value.api.trim() : '';
      if (!name || !isHttpUrl(api)) continue;

      sites[key] = {
        name: name.slice(0, 50),
        api,
        adult: value.adult === true
      };

      if (typeof value.detail === 'string' && isHttpUrl(value.detail.trim())) {
        sites[key].detail = value.detail.trim();
      }
    }
    return sites;
  } catch (error) {
    console.error(`API_SITES_JSON 解析失败: ${error.message}`);
    return {};
  }
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function safeInlineJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  
  if (contentType.includes("text/html")) {
    let html = await response.text();
    
    // 处理普通密码
    const password = env.PASSWORD || "";
    let passwordHash = "";
    if (password) {
      passwordHash = await sha256(password);
    }
    html = html.replace('window.__ENV__.PASSWORD = "{{PASSWORD}}";', 
      `window.__ENV__.PASSWORD = "${passwordHash}";`);

    // 将 Cloudflare Production 环境变量中的影视源安全注入页面。
    const apiSites = readApiSites(env.API_SITES_JSON || '');
    html = html.replace(
      'window.__ENV__.API_SITES = {{API_SITES_JSON}};',
      `window.__ENV__.API_SITES = ${safeInlineJson(apiSites)};`
    );

    // HTML 包含当前环境的密码哈希，不允许 Cloudflare 或浏览器复用旧页面。
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.delete('Content-Length');

    return new Response(html, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  }
  
  return response;
}
