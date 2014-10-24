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
        "merges": [
            "blackberry.invoke"
        ]
    },
    {
        "file": "plugins/com.blackberry.invoke/www/btoa.js",
        "id": "com.blackberry.invoke.btoa",
        "merges": [
            "blackberry.invoke.btoa"
        ]
    },
    {
        "file": "plugins/com.blackberry.invoke.card/www/client.js",
        "id": "com.blackberry.invoke.card.client",
        "merges": [
            "blackberry.invoke.card"
        ]
    },
    {
        "file": "plugins/com.blackberry.invoke.card/www/btoa.js",
        "id": "com.blackberry.invoke.card.btoa",
        "merges": [
            "blackberry.invoke.card.btoa"
        ]
    },
    {
        "file": "plugins/com.blackberry.io/www/client.js",
        "id": "com.blackberry.io.client",
        "merges": [
            "blackberry.io"
        ]
    },
    {
        "file": "plugins/com.blackberry.io.filetransfer/www/client.js",
        "id": "com.blackberry.io.filetransfer.client",
        "merges": [
            "blackberry.io.filetransfer"
        ]
    },
    {
        "file": "plugins/com.blackberry.system/www/client.js",
        "id": "com.blackberry.system.client",
        "clobbers": [
            "blackberry.system"
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
        "file": "plugins/com.blackberry.ui.dialog/www/client.js",
        "id": "com.blackberry.ui.dialog.client",
        "clobbers": [
            "blackberry.ui.dialog"
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
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.blackberry.app": "1.0.0",
    "com.blackberry.invoke": "1.0.0",
    "com.blackberry.invoke.card": "1.0.0",
    "com.blackberry.io": "1.0.0",
    "com.blackberry.io.filetransfer": "1.0.0",
    "com.blackberry.system": "1.0.0",
    "com.blackberry.ui.contextmenu": "1.0.0",
    "com.blackberry.ui.dialog": "1.0.0",
    "com.blackberry.ui.toast": "1.0.0",
    "org.apache.cordova.splashscreen": "0.3.1",
    "com.blackberry.utils": "1.0.0"
}
// BOTTOM OF METADATA
});