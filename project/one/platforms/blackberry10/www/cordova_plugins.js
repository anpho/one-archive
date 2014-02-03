cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.blackberry.app/www/client.js",
        "id": "com.blackberry.app.client",
        "clobbers": [
            "blackberry.app"
        ]
    },
    {
        "file": "plugins/com.blackberry.invoke/www/client.js",
        "id": "com.blackberry.invoke.client",
        "clobbers": [
            "blackberry.invoke"
        ]
    },
    {
        "file": "plugins/com.blackberry.invoke.card/www/client.js",
        "id": "com.blackberry.invoke.card.client",
        "clobbers": [
            "blackberry.invoke.card"
        ]
    },
    {
        "file": "plugins/com.blackberry.io/www/client.js",
        "id": "com.blackberry.io.client",
        "clobbers": [
            "blackberry.io"
        ]
    },
    {
        "file": "plugins/com.blackberry.io.filetransfer/www/client.js",
        "id": "com.blackberry.io.filetransfer.client",
        "clobbers": [
            "blackberry.io.filetransfer"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.toast/www/client.js",
        "id": "com.blackberry.ui.toast.client",
        "clobbers": [
            "blackberry.ui.toast"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.contextmenu/www/client.js",
        "id": "com.blackberry.ui.contextmenu.client",
        "clobbers": [
            "blackberry.ui.contextmenu"
        ]
    },
    {
        "file": "plugins/com.blackberry.community.curl/www/client.js",
        "id": "com.blackberry.community.curl.client",
        "clobbers": [
            "community.curl"
        ]
    }
]
});