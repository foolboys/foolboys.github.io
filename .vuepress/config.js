module.exports = {
    "title": "foolboy's blog",
    "description": "个人博客",
    "head": [
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon.ico"
            }
        ],
        [
            "meta",
            {
                "name": "viewport",
                "content": "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    "theme": "reco",
    "themeConfig": {
        "nav": [
            {
                "text": "首页",
                "link": "/",
                "icon": "reco-home"
            },
            {
                "text": "java基础",
                "icon": "reco-message",
                "link": "/docs/java/"
            },
            {
                "text": "SQL基础",
                "icon": "reco-message",
                "link": "/docs/sql/"
            },
            {
                "text": "时间线",
                "link": "/timeline/",
                "icon": "reco-date"
            },
            {
                "text": "关于我",
                "icon": "reco-message",
                "items": [
                    {
                        "text": "GitHub",
                        "link": "https://github.com/recoluan",
                        "icon": "reco-github"
                    }
                ]
            }
        ],
        "sidebar": {
            "/docs/java/": [
                "",
                "Redisson分布式锁注意事项"
            ],
            "/docs/sql/": [
                ""
            ]
        },
        "type": "blog",
        "blogConfig": {
            "tag": {
                "location": 5,
                "text": "标签分类"
            }
        },
        "friendLink": [
            {
                "title": "午后南杂",
                "desc": "Enjoy when you can, and endure when you must.",
                "email": "1156743527@qq.com",
                "link": "https://www.recoluan.com"
            },
            {
                "title": "vuepress-java",
                "desc": "A simple and beautiful vuepress Blog & Doc theme.",
                "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                "link": "https://vuepress-theme-reco.recoluan.com"
            }
        ],
        "logo": "/logo.png",
        "search": true,
        "searchMaxSuggestions": 10,
        "lastUpdated": "Last Updated",
        "author": "foolboy",
        "authorAvatar": "/avatar.png",
        "record": "xxxx",
        "startYear": "2024"
    },
    "markdown": {
        "lineNumbers": true
    }
}
