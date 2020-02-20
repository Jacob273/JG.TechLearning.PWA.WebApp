var Helpers;
(function (Helpers) {
    class DateHelper {
        FormatDate(date) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            if (date) {
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();
            }
            else {
                return ' ';
            }
            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
    }
    Helpers.DateHelper = DateHelper;
    class NavigationHelper {
        static LogDatabaseSizeToConsole() {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                navigator.storage.estimate().then(({ usage, quota }) => {
                    console.log(`NavigationHelper:::: Using ${usage} out of ${quota} bytes.`);
                });
            }
        }
    }
    Helpers.NavigationHelper = NavigationHelper;
    class BrowserComponentGetter {
        static GetIndexedDbComponent(onGetComponentCallback) {
            var indexedDbComponent = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            onGetComponentCallback(indexedDbComponent);
        }
    }
    Helpers.BrowserComponentGetter = BrowserComponentGetter;
})(Helpers || (Helpers = {}));
//# sourceMappingURL=Helpers.js.map