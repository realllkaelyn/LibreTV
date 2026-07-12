const CUSTOMER_SITES = {
    iqiyi: {
        api: 'https://iqiyizyapi.com/api.php/provide/vod',
        name: '爱奇艺'
    },
    zy360: {
        api: 'https://360zyzz.com/api.php/provide/vod',
        name: '360资源'
    },
    yzzy: {
        api: 'https://api.yzzy-api.com/inc/apijson.php',
        name: '优质资源'
    },
    guangsu: {
        api: 'https://api.guangsuapi.com/api.php/provide/vod',
        name: '光速资源'
    },
    zuidadianbo: {
        api: 'https://zuidazy.me/api.php/provide/vod',
        name: '最大点播'
    },
    zuida: {
        api: 'https://api.zuidapi.com/api.php/provide/vod',
        name: '最大资源'
    },
    xinlang: {
        api: 'https://api.xinlangapi.com/xinlangapi.php/provide/vod',
        name: '新浪资源'
    },
    wujinys: {
        api: 'https://api.wujinapi.com/api.php/provide/vod',
        name: '无尽影视'
    },
    wujinzy: {
        api: 'https://api.wujinapi.me/api.php/provide/vod',
        name: '无尽资源'
    },
    baofeng: {
        api: 'https://bfzyapi.com/api.php/provide/vod',
        name: '暴风资源'
    },
    maoyan: {
        api: 'https://api.maoyanapi.top/api.php/provide/vod',
        name: '猫眼资源'
    },
    baiduyun: {
        // LibreTV 自带 Cloudflare 代理，因此直接使用原始 CMS 接口，
        // 避免二次代理的 ?url= 参数吞掉搜索参数。
        api: 'https://api.apibdzy.com/api.php/provide/vod',
        name: '百度云'
    },
    hongniu: {
        api: 'https://www.hongniuzy2.com/api.php/provide/vod',
        name: '红牛资源'
    },
    huya: {
        api: 'https://www.huyaapi.com/api.php/provide/vod',
        name: '虎牙资源'
    },
    liangzi: {
        api: 'https://cj.lziapi.com/api.php/provide/vod',
        name: '量子影视'
    }
};

// Cloudflare Pages 中的 API_SITES_JSON 会在运行时覆盖或扩展内置源。
const CLOUDFLARE_SITES = window.__ENV__?.API_SITES;
if (CLOUDFLARE_SITES && typeof CLOUDFLARE_SITES === 'object' && !Array.isArray(CLOUDFLARE_SITES)) {
    Object.assign(CUSTOMER_SITES, CLOUDFLARE_SITES);
}

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
